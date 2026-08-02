/**
 * Disease Detection Queue
 * Background job processing with Bull (requires Redis).
 * Falls back gracefully (exports a stub) when Redis is unavailable.
 */

const { DiseaseReport } = require('../models/index');
const { callAIService } = require('../services/aiService');
const { emitDiseaseResult } = require('../sockets');
const { sendNotification } = require('../services/notifications/notificationService');
const logger = require('../utils/logger');

// ── Job processor function (shared by both Bull and fallback) ──────────────
const processAnalysis = async (data) => {
  const { reportId, images, cropName, userId } = data;
  logger.info(`Processing disease detection job: ${reportId}`);

  // Update status to processing
  await DiseaseReport.findByIdAndUpdate(reportId, {
    status: 'analyzing',
    'aiAnalysis.status': 'processing',
  });

  emitDiseaseResult(reportId, { status: 'processing', progress: 30 });

  try {
    const aiResult = await callAIService(images, cropName);

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

    emitDiseaseResult(reportId, { status: 'completed', detections, reportId });

    // Send push notification for top detected disease
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
};

// ── Try to create a real Bull queue (requires Redis) ───────────────────────
let diseaseQueue;

try {
  const Bull = require('bull');
  const ioredis = require('ioredis');

  // Shared ioredis connection factory to avoid multiple connections
  const redisOpts = {
    host: process.env.BULL_REDIS_HOST || 'localhost',
    port: parseInt(process.env.BULL_REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  };

  const createRedisClient = () => {
    const client = new ioredis(redisOpts);
    client.on('error', () => {}); // suppress noise when Redis not running
    return client;
  };

  diseaseQueue = new Bull('disease-detection', {
    createClient,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  });

  function createClient(type) {
    return createRedisClient();
  }

  // ── Process Jobs ────────────────────────────────────────────────────────
  diseaseQueue.process('analyze', 3, async (job) => {
    job.progress(0);
    const result = await processAnalysis(job.data);
    job.progress(100);
    return result;
  });

  // ── Queue Events ────────────────────────────────────────────────────────
  diseaseQueue.on('completed', (job) => {
    logger.info(`Disease job ${job.id} completed`);
  });

  diseaseQueue.on('failed', (job, err) => {
    logger.error(`Disease job ${job.id} failed: ${err.message}`);
  });

  diseaseQueue.on('stalled', (job) => {
    logger.warn(`Disease job ${job.id} stalled`);
  });

  diseaseQueue.on('error', (err) => {
    logger.warn('Disease queue error (Redis likely unavailable):', err.message);
  });

  logger.info('✅ Disease detection Bull queue initialized');

} catch (err) {
  // Redis / Bull unavailable — use an in-process stub queue that runs jobs synchronously
  logger.warn('Bull queue unavailable — using synchronous inline fallback:', err.message);

  diseaseQueue = {
    add: async (_name, data) => {
      // Run inline without queueing
      setImmediate(() => processAnalysis(data).catch(e => logger.error('Inline disease processing failed:', e)));
      return { id: 'inline-' + Date.now() };
    },
    on: () => {}, // no-op
  };
}

module.exports = diseaseQueue;
