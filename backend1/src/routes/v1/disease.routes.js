const express = require('express');
const router = express.Router();
const diseaseController = require('../../controllers/disease/diseaseController');
const { protect } = require('../../middleware/auth');
const { upload } = require('../../services/uploadService');

router.post('/report', protect, upload.array('images', 5), diseaseController.submitReport);
router.get('/report/:id', protect, diseaseController.getReport);
router.get('/my-reports', protect, diseaseController.getMyReports);
router.post('/report/:id/feedback', protect, diseaseController.submitFeedback);
router.get('/outbreak-map', diseaseController.getOutbreakMap);

module.exports = router;
