/**
 * Disease Detection Controller
 * AI-powered crop disease analysis
 */

const axios = require('axios');
const { DiseaseReport } = require('../../models/index');
const { uploadToCloudinary } = require('../../services/uploadService');
const { cache } = require('../../config/redis');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../utils/logger');
const diseaseQueue = require('../../jobs/diseaseDetectionQueue');

// ── Submit Disease Report ─────────────────────
exports.submitReport = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('Please upload at least one crop image', 400);
  }

  const { cropName, farmId, cropSeasonId, notes } = req.body;

  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(
    req.files.map(async (file) => {
      const result = await uploadToCloudinary(file.buffer, {
        folder: `agrisol/disease-reports/${req.user._id}`,
        transformation: [{ width: 1024, crop: 'limit', quality: 'auto' }],
      });
      return { url: result.secure_url, publicId: result.public_id };
    })
  );

  // Create report
  const report = await DiseaseReport.create({
    farmer: req.user._id,
    farm: farmId,
    cropSeason: cropSeasonId,
    cropName,
    images: uploadedImages,
    notes,
    status: 'submitted',
    location: {
      district: req.user.district,
      state: req.user.state,
    },
    aiAnalysis: { status: 'pending' },
  });

  // Queue AI processing (async, non-blocking)
  await diseaseQueue.add('analyze', {
    reportId: report._id.toString(),
    images: uploadedImages.map(i => i.url),
    cropName,
    userId: req.user._id.toString(),
    language: req.user.preferredLanguage,
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    priority: 2,
  });

  logger.info(`Disease report submitted: ${report._id} for crop: ${cropName}`);

  res.status(201).json({
    success: true,
    message: 'Images uploaded successfully. Analysis in progress (usually 30-60 seconds).',
    data: {
      reportId: report._id,
      status: 'analyzing',
      estimatedTime: '30-60 seconds',
    },
  });
});

// ── Get Report Status/Result ──────────────────
exports.getReport = catchAsync(async (req, res) => {
  const report = await DiseaseReport.findOne({
    _id: req.params.id,
    farmer: req.user._id,
  }).populate('farm', 'name').populate('expertReview.expert', 'name expertProfile');

  if (!report) throw new AppError('Report not found', 404);

  res.json({ success: true, data: report });
});

// ── Get All Reports (farmer's) ────────────────
exports.getMyReports = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, cropName, status } = req.query;

  const query = { farmer: req.user._id };
  if (cropName) query.cropName = new RegExp(cropName, 'i');
  if (status) query.status = status;

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 50),
    sort: { createdAt: -1 },
    populate: [{ path: 'farm', select: 'name' }],
  };

  const result = await DiseaseReport.paginate(query, options);

  res.json({ success: true, data: result });
});

// ── AI Service Integration ────────────────────
exports.callAIService = async (imageUrls, cropName) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/api/detect`,
      {
        images: imageUrls,
        crop_name: cropName,
        model_version: process.env.AI_MODEL_VERSION || 'v1.0',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60s timeout
      }
    );
    return response.data;
  } catch (error) {
    logger.error('AI service error:', error.message);

    // Return mock response if AI service unavailable (dev/demo mode)
    if (process.env.NODE_ENV !== 'production') {
      return getMockAIResponse(cropName);
    }
    throw error;
  }
};

// ── Mock AI Response (placeholder) ───────────
const getMockAIResponse = (cropName) => ({
  status: 'success',
  model_version: 'v1.0-mock',
  detections: [
    {
      disease_name: 'Leaf Blight',
      disease_name_hi: 'पत्ती का अंगमारी',
      disease_name_mr: 'पानांचा करपा',
      confidence: 87.3,
      severity: 'medium',
      affected_area: '30-40%',
      description: `A fungal disease affecting ${cropName} crops, causing browning and wilting of leaves.`,
      remedies: [
        'Remove and destroy affected plant parts',
        'Improve air circulation between plants',
        'Avoid overhead irrigation',
        'Apply copper-based fungicide',
      ],
      recommended_pesticides: [
        {
          name: 'Mancozeb 75% WP',
          dosage: '2.5g per liter of water',
          application_method: 'Foliar spray',
          safety_period: '7 days before harvest',
          cost: '₹150-200 per kg',
        },
        {
          name: 'Copper Oxychloride 50% WP',
          dosage: '3g per liter of water',
          application_method: 'Foliar spray',
          safety_period: '10 days before harvest',
          cost: '₹100-150 per kg',
        },
      ],
      organic_remedies: [
        'Neem oil spray (5ml per liter)',
        'Trichoderma-based biocontrol',
        'Garlic-chili extract spray',
      ],
      prevention_tips: [
        'Use disease-resistant varieties',
        'Maintain proper plant spacing',
        'Crop rotation every 2-3 seasons',
        'Regular field scouting',
      ],
    },
  ],
});

// ── Feedback on Report ────────────────────────
exports.submitFeedback = catchAsync(async (req, res) => {
  const { isHelpful, comment } = req.body;

  const report = await DiseaseReport.findOneAndUpdate(
    { _id: req.params.id, farmer: req.user._id },
    {
      farmerFeedback: { isHelpful, comment, feedbackAt: new Date() },
    },
    { new: true }
  );

  if (!report) throw new AppError('Report not found', 404);

  res.json({ success: true, message: 'Feedback submitted. Thank you!' });
});

// ── Get Disease Outbreak Analytics ───────────
exports.getOutbreakMap = catchAsync(async (req, res) => {
  const { state, cropName, days = 30 } = req.query;

  const cacheKey = `outbreak:${state}:${cropName}:${days}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const matchQuery = {
    createdAt: { $gte: startDate },
    'aiAnalysis.status': 'completed',
  };
  if (state) matchQuery['location.state'] = state;
  if (cropName) matchQuery.cropName = new RegExp(cropName, 'i');

  const outbreaks = await DiseaseReport.aggregate([
    { $match: matchQuery },
    { $unwind: '$aiAnalysis.detections' },
    {
      $group: {
        _id: {
          disease: '$aiAnalysis.detections.diseaseName',
          district: '$location.district',
          state: '$location.state',
          cropName: '$cropName',
        },
        count: { $sum: 1 },
        avgConfidence: { $avg: '$aiAnalysis.detections.confidence' },
        lastReported: { $max: '$createdAt' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 50 },
  ]);

  await cache.set(cacheKey, outbreaks, 3600); // cache 1 hour
  res.json({ success: true, data: outbreaks });
});
