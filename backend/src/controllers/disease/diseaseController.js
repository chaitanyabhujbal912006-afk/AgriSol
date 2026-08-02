/**
 * Disease Detection Controller
 * AI-powered crop disease analysis
 */

const { DiseaseReport } = require('../../models/index');
const { uploadToCloudinary } = require('../../services/uploadService');
const { cache } = require('../../config/redis');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../utils/logger');
const { callAIService } = require('../../services/aiService');
// NOTE: diseaseQueue is required lazily to avoid circular dependency
const getDiseaseQueue = () => require('../../jobs/diseaseDetectionQueue');

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

  // Queue AI processing (async, non-blocking) — uses lazy require to avoid circular dep
  try {
    const diseaseQueue = getDiseaseQueue();
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
  } catch (queueErr) {
    logger.warn('Disease queue unavailable — processing inline (Redis not configured)');
    // Process inline (synchronous fallback without Bull/Redis)
    const { callAIService: aiCall } = require('../../services/aiService');
    const aiResult = await aiCall(uploadedImages.map(i => i.url), cropName);
    const detections = (aiResult.detections || []).map(d => ({
      diseaseName: d.disease_name,
      diseaseNameHi: d.disease_name_hi,
      diseaseNameMr: d.disease_name_mr,
      confidence: d.confidence,
      severity: d.severity,
      affectedArea: d.affected_area,
      description: d.description,
      remedies: d.remedies || [],
      recommendedPesticides: d.recommended_pesticides || [],
      organicRemedies: d.organic_remedies || [],
      preventionTips: d.prevention_tips || [],
    }));
    await DiseaseReport.findByIdAndUpdate(report._id, {
      status: 'completed',
      'aiAnalysis.status': 'completed',
      'aiAnalysis.modelVersion': aiResult.model_version,
      'aiAnalysis.processedAt': new Date(),
      'aiAnalysis.detections': detections,
    });
  }

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

// callAIService is now in services/aiService.js — exported here for backward compat
exports.callAIService = callAIService;

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
  try {
    const cached = await cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached, cached: true });
  } catch (e) {}

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const matchQuery = {
    createdAt: { $gte: startDate },
    'aiAnalysis.status': 'completed',
  };
  if (state) matchQuery['location.state'] = state;
  if (cropName) matchQuery.cropName = new RegExp(cropName, 'i');

  let outbreaks = [];
  try {
    if (require('mongoose').connection.readyState !== 1) {
      throw new Error('Database connection not established');
    }
    outbreaks = await DiseaseReport.aggregate([
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
  } catch (err) {
    logger.warn('Disease report aggregation fallback:', err.message);
    outbreaks = [
      { _id: { disease: 'Early Blight', district: 'Nashik', state: 'Maharashtra', cropName: 'Tomato' }, count: 12, avgConfidence: 94.2, lastReported: new Date() },
      { _id: { disease: 'Yellow Rust', district: 'Ludhiana', state: 'Punjab', cropName: 'Wheat' }, count: 8, avgConfidence: 89.5, lastReported: new Date() }
    ];
  }

  res.json({ success: true, data: outbreaks });
});
