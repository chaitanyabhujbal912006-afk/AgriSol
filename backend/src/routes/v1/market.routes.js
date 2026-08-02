const express = require('express');
const router = express.Router();
const marketController = require('../../controllers/market/marketController');
const { protect, restrictTo } = require('../../middleware/auth');

router.get('/prices', marketController.getLatestPrices);
router.get('/trends/:cropName/:state', marketController.getPriceTrends);
router.get('/nearby', protect, marketController.getNearbyMarkets);
router.get('/predict/:cropName/:state', marketController.getPricePrediction);
router.get('/search', marketController.searchCrops);
router.post('/seed', protect, restrictTo('admin'), marketController.seedMarketPrices);

module.exports = router;
