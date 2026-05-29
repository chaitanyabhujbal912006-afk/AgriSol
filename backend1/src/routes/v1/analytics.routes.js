const express = require('express');
const router = express.Router();
const { CropSeason } = require('../../models/Farm');
const { DiseaseReport, MarketPrice } = require('../../models/index');
const { protect } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');

// Farmer's financial summary
router.get('/financial', protect, catchAsync(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const summary = await CropSeason.aggregate([
    { $match: { farmer: req.user._id, year: parseInt(year) } },
    { $unwind: { path: '$expenses', preserveNullAndEmptyArrays: true } },
    { $group: {
      _id: '$expenses.category',
      totalAmount: { $sum: '$expenses.amount' },
      count: { $sum: 1 },
    }},
  ]);

  const yieldSummary = await CropSeason.aggregate([
    { $match: { farmer: req.user._id, year: parseInt(year), status: 'completed' } },
    { $group: {
      _id: '$cropName',
      totalYield: { $sum: '$actualYield.value' },
      totalRevenue: { $sum: { $multiply: ['$actualYield.value', '$sellingPrice.value'] } },
      count: { $sum: 1 },
    }},
  ]);

  res.json({ success: true, data: { expenseByCategory: summary, yieldByCrop: yieldSummary, year } });
}));

// Disease history
router.get('/disease-history', protect, catchAsync(async (req, res) => {
  const history = await DiseaseReport.aggregate([
    { $match: { farmer: req.user._id, 'aiAnalysis.status': 'completed' } },
    { $unwind: '$aiAnalysis.detections' },
    { $group: { _id: '$aiAnalysis.detections.diseaseName', count: { $sum: 1 }, crops: { $addToSet: '$cropName' } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ success: true, data: history });
}));

module.exports = router;
