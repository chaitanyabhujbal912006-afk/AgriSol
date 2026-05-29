/**
 * AgriSol API v1 Routes
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const farmerRoutes = require('./farmer.routes');
const cropRoutes = require('./crop.routes');
const diseaseRoutes = require('./disease.routes');
const weatherRoutes = require('./weather.routes');
const marketRoutes = require('./market.routes');
const schemeRoutes = require('./scheme.routes');
const communityRoutes = require('./community.routes');
const notificationRoutes = require('./notification.routes');
const adminRoutes = require('./admin.routes');
const analyticsRoutes = require('./analytics.routes');
const chatRoutes = require('./chat.routes');
const soilRoutes = require('./soil.routes');
const calendarRoutes = require('./calendar.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/farmers', farmerRoutes);
router.use('/crops', cropRoutes);
router.use('/disease', diseaseRoutes);
router.use('/weather', weatherRoutes);
router.use('/market', marketRoutes);
router.use('/schemes', schemeRoutes);
router.use('/community', communityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/chat', chatRoutes);
router.use('/soil', soilRoutes);
router.use('/calendar', calendarRoutes);

// API status
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AgriSol API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      farmers: '/api/v1/farmers',
      crops: '/api/v1/crops',
      disease: '/api/v1/disease',
      weather: '/api/v1/weather',
      market: '/api/v1/market',
      schemes: '/api/v1/schemes',
      community: '/api/v1/community',
      notifications: '/api/v1/notifications',
      admin: '/api/v1/admin',
      analytics: '/api/v1/analytics',
      chat: '/api/v1/chat',
    },
  });
});

module.exports = router;
