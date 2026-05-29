/**
 * Disease Detection Queue
 * Background job processing with Bull
 */

const Bull = require('bull');
const { DiseaseReport } = require('../models/index');
const { callAIService } = require('../controllers/disease/diseaseController');
const { emitDiseaseResult } = require('../sockets');
const { sendNotification } = require('../services/notifications/notificationService');
const logger = require('../utils/logger');

const diseaseQueue = new Bull('disease-detection', {
  redis: {
    host: process.env.BULL_REDIS_HOST || 'localhost',
    port: parseInt(process.env.BULL_REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// ── Process Jobs ──────────────────────────────
diseaseQueue.process('analyze', 3, async (job) => {
  const { reportId, images, cropName, userId, language } = job.data;
  logger.info(`Processing disease detection job: ${reportId}`);

  // Update status to processing
  await DiseaseReport.findByIdAndUpdate(reportId, {
    status: 'analyzing',
    'aiAnalysis.status': 'processing',
  });

  // Emit progress to WebSocket
  emitDiseaseResult(reportId, { status: 'processing', progress: 30 });

  job.progress(30);

  try {
    // Call AI service
    const aiResult = await callAIService(images, cropName);
    job.progress(80);

    // Parse and store results
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

    await DiseaseReport.findByIdAndUpdate(reportId, {
      status: 'completed',
      'aiAnalysis.status': 'completed',
      'aiAnalysis.modelVersion': aiResult.model_version,
      'aiAnalysis.processedAt': new Date(),
      'aiAnalysis.detections': detections,
      'aiAnalysis.rawResponse': aiResult,
    });

    job.progress(100);

    // Emit result to WebSocket
    emitDiseaseResult(reportId, {
      status: 'completed',
      detections,
      reportId,
    });

    // Send push notification
    const topDisease = detections[0];
    if (topDisease) {
      await sendNotification(userId, {
        type: 'disease_result',
        title: `🔬 Disease Detected: ${topDisease.diseaseName}`,
        body: `Confidence: ${topDisease.confidence.toFixed(1)}%. Tap to see remedies.`,
        data: { reportId, type: 'disease_result' },
        priority: topDisease.severity === 'critical' ? 'urgent' : 'normal',
      });
    }

    logger.info(`Disease detection completed for report: ${reportId}`);
    return { success: true, detections };

  } catch (error) {
    logger.error(`Disease detection failed for ${reportId}:`, error);

    await DiseaseReport.findByIdAndUpdate(reportId, {
      status: 'completed',
      'aiAnalysis.status': 'failed',
      'aiAnalysis.errorMessage': error.message,
    });

    emitDiseaseResult(reportId, {
      status: 'failed',
      message: 'Analysis failed. Please try again or consult an expert.',
    });

    throw error;
  }
});

// ── Queue Events ──────────────────────────────
diseaseQueue.on('completed', (job, result) => {
  logger.info(`Disease job ${job.id} completed`);
});

diseaseQueue.on('failed', (job, err) => {
  logger.error(`Disease job ${job.id} failed: ${err.message}`);
});

diseaseQueue.on('stalled', (job) => {
  logger.warn(`Disease job ${job.id} stalled`);
});

module.exports = diseaseQueue;
