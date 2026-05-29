const express = require('express');
const router = express.Router();
const { Farm, CropSeason } = require('../../models/Farm');
const { protect } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');

// ── Farm CRUD ──────────────────────────────────
router.get('/farms', protect, catchAsync(async (req, res) => {
  const farms = await Farm.find({ farmer: req.user._id, isActive: true });
  res.json({ success: true, data: farms });
}));

router.post('/farms', protect, catchAsync(async (req, res) => {
  const farm = await Farm.create({ ...req.body, farmer: req.user._id });
  res.status(201).json({ success: true, data: farm });
}));

router.put('/farms/:id', protect, catchAsync(async (req, res) => {
  const farm = await Farm.findOneAndUpdate({ _id: req.params.id, farmer: req.user._id }, req.body, { new: true });
  if (!farm) throw new AppError('Farm not found', 404);
  res.json({ success: true, data: farm });
}));

// ── Crop Season CRUD ───────────────────────────
router.get('/seasons', protect, catchAsync(async (req, res) => {
  const { status, season, year, page = 1, limit = 10 } = req.query;
  const query = { farmer: req.user._id };
  if (status) query.status = status;
  if (season) query.season = season;
  if (year) query.year = parseInt(year);

  const seasons = await CropSeason.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('farm', 'name location');

  const total = await CropSeason.countDocuments(query);
  res.json({ success: true, data: { seasons, total } });
}));

router.post('/seasons', protect, catchAsync(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.body.farmId, farmer: req.user._id });
  if (!farm) throw new AppError('Farm not found', 404);

  const season = await CropSeason.create({ ...req.body, farm: req.body.farmId, farmer: req.user._id });
  res.status(201).json({ success: true, data: season });
}));

router.get('/seasons/:id', protect, catchAsync(async (req, res) => {
  const season = await CropSeason.findOne({ _id: req.params.id, farmer: req.user._id }).populate('farm');
  if (!season) throw new AppError('Crop season not found', 404);
  res.json({ success: true, data: season });
}));

router.put('/seasons/:id', protect, catchAsync(async (req, res) => {
  const season = await CropSeason.findOneAndUpdate({ _id: req.params.id, farmer: req.user._id }, req.body, { new: true });
  if (!season) throw new AppError('Crop season not found', 404);
  res.json({ success: true, data: season });
}));

// Add expense
router.post('/seasons/:id/expenses', protect, catchAsync(async (req, res) => {
  const season = await CropSeason.findOneAndUpdate(
    { _id: req.params.id, farmer: req.user._id },
    { $push: { expenses: req.body } },
    { new: true }
  );
  if (!season) throw new AppError('Crop season not found', 404);
  res.json({ success: true, data: season });
}));

// Update irrigation schedule
router.put('/seasons/:id/irrigation/:irrigationId', protect, catchAsync(async (req, res) => {
  const season = await CropSeason.findOneAndUpdate(
    { _id: req.params.id, farmer: req.user._id, 'irrigationSchedule._id': req.params.irrigationId },
    { $set: { 'irrigationSchedule.$': { ...req.body, _id: req.params.irrigationId } } },
    { new: true }
  );
  if (!season) throw new AppError('Not found', 404);
  res.json({ success: true, data: season });
}));

module.exports = router;
