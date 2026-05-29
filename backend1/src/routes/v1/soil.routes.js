const express = require('express');
const router = express.Router();
const soilController = require('../../controllers/soil/soilController');
const { protect } = require('../../middleware/auth');
const { upload } = require('../../services/uploadService');

router.post('/analyze', protect, upload.single('file'), soilController.analyzeSoil);
router.get('/history', protect, soilController.getSoilHistory);

module.exports = router;
