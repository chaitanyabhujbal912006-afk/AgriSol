const express = require('express');
const router = express.Router();
const calendarController = require('../../controllers/calendar/calendarController');
const { protect } = require('../../middleware/auth');

router.get('/events', protect, calendarController.getEvents);
router.post('/events', protect, calendarController.createEvent);
router.post('/events/:eventId/toggle', protect, calendarController.toggleComplete);

module.exports = router;
