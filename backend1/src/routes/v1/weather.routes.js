const express = require('express');
const router = express.Router();
const weatherController = require('../../controllers/weather/weatherController');
const { protect, optionalAuth } = require('../../middleware/auth');

router.get('/current', optionalAuth, weatherController.getCurrentWeather);
router.get('/forecast', optionalAuth, weatherController.getForecast);
router.get('/location/:state/:city', weatherController.getWeatherByLocation);
router.get('/farming-calendar', protect, weatherController.getFarmingCalendar);

module.exports = router;
