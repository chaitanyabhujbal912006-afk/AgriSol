/**
 * Notification Service
 * Orchestrates push, SMS, and email notifications
 */

const { Notification } = require('../../models/index');
const User = require('../../models/User');
const { emitToUser } = require('../../sockets');
const logger = require('../../utils/logger');

// Lazy imports to avoid circular dependencies
let admin;
const getFirebaseAdmin = () => {
  if (!admin) {
    admin = require('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
  }
  return admin;
};

// ── Send Notification ─────────────────────────
const sendNotification = async (userId, options) => {
  try {
    const user = await User.findById(userId).select(
      'name mobile email preferredLanguage fcmTokens notificationPreferences'
    );

    if (!user) return;

    const lang = user.preferredLanguage || 'en';

    // Create notification record
    const notification = await Notification.create({
      recipient: userId,
      type: options.type,
      title: options.title,
      titleHi: options.titleHi || options.title,
      body: options.body,
      bodyHi: options.bodyHi || options.body,
      data: options.data,
      priority: options.priority || 'normal',
      actionUrl: options.actionUrl,
    });

    const results = [];

    // ── Real-time via WebSocket ────────────────
    emitToUser(userId, 'notification:new', notification.toObject());

    // ── Push Notification ──────────────────────
    if (user.notificationPreferences?.push && user.fcmTokens?.length) {
      try {
        const firebaseAdmin = getFirebaseAdmin();
        const tokens = user.fcmTokens.map(t => t.token).filter(Boolean);

        if (tokens.length) {
          const message = {
            notification: {
              title: options.title,
              body: options.body,
            },
            data: {
              type: options.type || 'general',
              ...Object.fromEntries(
                Object.entries(options.data || {}).map(([k, v]) => [k, String(v)])
              ),
            },
            android: {
              priority: options.priority === 'urgent' ? 'high' : 'normal',
              notification: { sound: 'default', channelId: 'agrisol-alerts' },
            },
            apns: {
              payload: { aps: { sound: 'default', badge: 1 } },
            },
            tokens,
          };

          const response = await firebaseAdmin.messaging().sendEachForMulticast(message);

          // Remove invalid tokens
          const invalidTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
              invalidTokens.push(tokens[idx]);
            }
          });

          if (invalidTokens.length) {
            await User.findByIdAndUpdate(userId, {
              $pull: { fcmTokens: { token: { $in: invalidTokens } } },
            });
          }

          await Notification.findByIdAndUpdate(notification._id, {
            'channels.push.sent': response.successCount > 0,
            'channels.push.sentAt': new Date(),
          });

          results.push({ channel: 'push', success: response.successCount > 0 });
        }
      } catch (err) {
        logger.error('Push notification error:', err.message);
        await Notification.findByIdAndUpdate(notification._id, {
          'channels.push.sent': false,
          'channels.push.error': err.message,
        });
      }
    }

    // ── SMS Notification ───────────────────────
    if (user.notificationPreferences?.sms && options.sendSMS !== false) {
      try {
        const { sendSMS } = require('../sms/smsService');
        const smsBody = `AgriSol: ${options.body}`;
        const result = await sendSMS(user.mobile, smsBody);

        await Notification.findByIdAndUpdate(notification._id, {
          'channels.sms.sent': true,
          'channels.sms.sentAt': new Date(),
          'channels.sms.messageId': result?.sid,
        });

        results.push({ channel: 'sms', success: true });
      } catch (err) {
        logger.error('SMS notification error:', err.message);
      }
    }

    return { notification, results };

  } catch (err) {
    logger.error('Notification service error:', err);
  }
};

// ── Bulk Notifications ────────────────────────
const sendBulkNotification = async (userIds, options) => {
  const results = await Promise.allSettled(
    userIds.map(userId => sendNotification(userId, options))
  );

  const success = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  logger.info(`Bulk notification: ${success} sent, ${failed} failed`);
  return { success, failed };
};

// ── Weather Alert Broadcast ───────────────────
const sendWeatherAlert = async (district, state, alertData) => {
  const users = await User.find({
    district,
    state,
    isActive: true,
    'notificationPreferences.weather': true,
  }).select('_id').lean();

  const userIds = users.map(u => u._id.toString());
  return sendBulkNotification(userIds, {
    type: 'weather_alert',
    title: `⛈️ Weather Alert - ${district}`,
    body: alertData.description,
    data: alertData,
    priority: alertData.severity === 'high' ? 'urgent' : 'normal',
    sendSMS: alertData.severity === 'high',
  });
};

// ── Market Price Alert ────────────────────────
const sendMarketAlert = async (cropName, state, priceData) => {
  const users = await User.find({
    state,
    cropsGrown: cropName,
    isActive: true,
    'notificationPreferences.market': true,
  }).select('_id').lean();

  const userIds = users.map(u => u._id.toString());
  const change = priceData.changePercent;
  const emoji = change > 0 ? '📈' : '📉';

  return sendBulkNotification(userIds, {
    type: 'market_price',
    title: `${emoji} ${cropName} Price Update`,
    body: `${cropName} price: ₹${priceData.modalPrice}/quintal (${change > 0 ? '+' : ''}${change.toFixed(1)}%)`,
    data: priceData,
  });
};

module.exports = {
  sendNotification,
  sendBulkNotification,
  sendWeatherAlert,
  sendMarketAlert,
};
