/**
 * Scheduled Jobs - Cron Tasks
 * Weather alerts, market updates, crop reminders
 */

const cron = require('node-cron');
const axios = require('axios');
const User = require('../models/User');
const { CropSeason } = require('../models/Farm');
const { MarketPrice, WeatherLog } = require('../models/index');
const { sendNotification, sendBulkNotification, sendWeatherAlert, sendMarketAlert } = require('../services/notifications/notificationService');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');

const initCronJobs = () => {
  logger.info('⏰ Initializing cron jobs...');

  // ── Crop Reminders — Daily at 7 AM ────────────
  cron.schedule('0 7 * * *', async () => {
    logger.info('Running: Daily crop reminders');
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 2);

      // Find crops with pending irrigation schedules due today/tomorrow
      const cropsWithIrrigation = await CropSeason.find({
        status: { $in: ['sowing', 'growing', 'flowering'] },
        'irrigationSchedule': {
          $elemMatch: {
            status: 'pending',
            scheduledDate: { $gte: today, $lte: dayAfter },
          },
        },
      }).select('farmer cropName irrigationSchedule');

      for (const crop of cropsWithIrrigation) {
        const upcoming = crop.irrigationSchedule.find(
          s => s.status === 'pending' && new Date(s.scheduledDate) >= today && new Date(s.scheduledDate) <= dayAfter
        );
        if (upcoming) {
          await sendNotification(crop.farmer, {
            type: 'irrigation_reminder',
            title: '💧 Irrigation Reminder',
            body: `Time to irrigate your ${crop.cropName} crop. Scheduled: ${new Date(upcoming.scheduledDate).toLocaleDateString('en-IN')}`,
            data: { cropSeasonId: crop._id, type: 'irrigation' },
            sendSMS: false,
          });
        }
      }

      // Find crops with fertilizer schedules
      const cropsWithFertilizer = await CropSeason.find({
        status: { $in: ['sowing', 'growing', 'flowering'] },
        'fertilizerSchedule': {
          $elemMatch: {
            status: 'pending',
            scheduledDate: { $gte: today, $lte: dayAfter },
          },
        },
      }).select('farmer cropName fertilizerSchedule');

      for (const crop of cropsWithFertilizer) {
        const upcoming = crop.fertilizerSchedule.find(
          s => s.status === 'pending' && new Date(s.scheduledDate) >= today
        );
        if (upcoming) {
          await sendNotification(crop.farmer, {
            type: 'fertilizer_reminder',
            title: '🌿 Fertilizer Reminder',
            body: `Apply ${upcoming.fertilizerName} to your ${crop.cropName} crop today.`,
            data: { cropSeasonId: crop._id, type: 'fertilizer' },
            sendSMS: false,
          });
        }
      }

      logger.info(`Crop reminders sent for ${cropsWithIrrigation.length + cropsWithFertilizer.length} crops`);
    } catch (err) {
      logger.error('Crop reminder job error:', err);
    }
  });

  // ── Market Price Update — Every 6 hours ───────
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Running: Market price cache refresh');
    try {
      // Invalidate market price caches
      await cache.delPattern('market:prices:*');
      await cache.delPattern('market:trends:*');
      logger.info('Market price cache cleared');

      // In production, this would fetch from AgMarkNet API
      // await fetchAndSeedMarketPrices();
    } catch (err) {
      logger.error('Market update job error:', err);
    }
  });

  // ── Weather Alerts — Every 3 hours ────────────
  cron.schedule('0 */3 * * *', async () => {
    logger.info('Running: Weather alert check');
    try {
      // Get distinct state/district combinations of active users
      const locations = await User.aggregate([
        { $match: { isActive: true, 'notificationPreferences.weather': true } },
        { $group: { _id: { state: '$state', district: '$district' } } },
        { $match: { '_id.state': { $ne: null } } },
        { $limit: 50 },
      ]);

      for (const loc of locations) {
        if (!loc._id.district) continue;

        const cacheKey = `weather:alert:${loc._id.district}`;
        const alreadySent = await cache.get(cacheKey);
        if (alreadySent) continue;

        // Check recent weather log for alerts
        const recentWeather = await WeatherLog.findOne({
          'location.district': loc._id.district,
        }).sort({ fetchedAt: -1 });

        if (recentWeather?.alerts?.length > 0) {
          const highAlert = recentWeather.alerts.find(a => a.severity === 'high');
          if (highAlert) {
            await sendWeatherAlert(loc._id.district, loc._id.state, highAlert);
            await cache.set(cacheKey, '1', 6 * 60 * 60); // Don't resend for 6 hours
          }
        }
      }
    } catch (err) {
      logger.error('Weather alert job error:', err);
    }
  });

  // ── Harvest Prediction Reminder — Weekly (Monday 8 AM) ──
  cron.schedule('0 8 * * 1', async () => {
    logger.info('Running: Harvest prediction reminders');
    try {
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      const today = new Date();

      const upcomingHarvests = await CropSeason.find({
        status: { $in: ['growing', 'flowering'] },
        expectedHarvestDate: { $gte: today, $lte: twoWeeksFromNow },
      }).select('farmer cropName expectedHarvestDate');

      for (const crop of upcomingHarvests) {
        const daysLeft = Math.ceil((new Date(crop.expectedHarvestDate) - today) / (1000 * 60 * 60 * 24));
        await sendNotification(crop.farmer, {
          type: 'crop_reminder',
          title: '🌾 Harvest Approaching!',
          body: `Your ${crop.cropName} harvest is expected in ${daysLeft} days. Start preparing storage and transport.`,
          data: { cropSeasonId: crop._id },
          sendSMS: true,
        });
      }

      logger.info(`Harvest reminders sent for ${upcomingHarvests.length} crops`);
    } catch (err) {
      logger.error('Harvest reminder job error:', err);
    }
  });

  // ── Cleanup Old Notifications — Daily at 2 AM ─
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running: Notification cleanup');
    try {
      const { Notification } = require('../models/index');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const result = await Notification.deleteMany({
        isRead: true,
        createdAt: { $lt: thirtyDaysAgo },
      });

      logger.info(`Cleaned up ${result.deletedCount} old notifications`);
    } catch (err) {
      logger.error('Notification cleanup error:', err);
    }
  });

  // ── Pest Outbreak Detection — Every 12 hours ──
  cron.schedule('0 */12 * * *', async () => {
    logger.info('Running: Pest outbreak detection');
    try {
      const { DiseaseReport } = require('../models/index');
      const last48Hours = new Date(Date.now() - 48 * 60 * 60 * 1000);

      // Find disease clusters
      const outbreaks = await DiseaseReport.aggregate([
        {
          $match: {
            createdAt: { $gte: last48Hours },
            'aiAnalysis.status': 'completed',
          },
        },
        { $unwind: '$aiAnalysis.detections' },
        {
          $group: {
            _id: {
              disease: '$aiAnalysis.detections.diseaseName',
              district: '$location.district',
            },
            count: { $sum: 1 },
            state: { $first: '$location.state' },
            cropNames: { $addToSet: '$cropName' },
          },
        },
        { $match: { count: { $gte: 3 } } }, // Alert if 3+ reports
      ]);

      for (const outbreak of outbreaks) {
        if (!outbreak._id.district) continue;
        const alertKey = `pest:alert:${outbreak._id.district}:${outbreak._id.disease}`;
        const alreadyAlerted = await cache.get(alertKey);
        if (alreadyAlerted) continue;

        await sendWeatherAlert(outbreak._id.district, outbreak.state, {
          type: 'pest_outbreak',
          severity: outbreak.count >= 5 ? 'high' : 'medium',
          description: `⚠️ Pest Alert: ${outbreak._id.disease} outbreak detected in ${outbreak._id.district}. ${outbreak.count} reports in last 48 hours. Affected crops: ${outbreak.cropNames.join(', ')}.`,
        });

        await cache.set(alertKey, '1', 24 * 60 * 60); // Don't repeat for 24 hours
        logger.info(`Pest outbreak alert sent: ${outbreak._id.disease} in ${outbreak._id.district}`);
      }
    } catch (err) {
      logger.error('Pest outbreak job error:', err);
    }
  });

  logger.info('✅ Cron jobs initialized');
};

module.exports = { initCronJobs };
