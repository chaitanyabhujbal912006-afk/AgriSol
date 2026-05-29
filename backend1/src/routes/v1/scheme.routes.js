const express = require('express');
const router = express.Router();
const { GovernmentScheme } = require('../../models/index');
const { protect, restrictTo } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');

// Get all schemes
router.get('/', catchAsync(async (req, res) => {
  const { category, state, crop, page = 1, limit = 10, featured } = req.query;
  const query = { isActive: true };
  if (category) query.category = category;
  if (state) query['targetBeneficiaries.states'] = { $in: [state, 'all'] };
  if (crop) query['targetBeneficiaries.crops'] = { $in: [crop, 'all'] };
  if (featured) query.isFeatured = true;

  const schemes = await GovernmentScheme.find(query)
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('postedBy', 'name');

  const total = await GovernmentScheme.countDocuments(query);
  res.json({ success: true, data: { schemes, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
}));

// Get personalized schemes for logged in farmer
router.get('/personalized', protect, catchAsync(async (req, res) => {
  const user = req.user;
  const query = {
    isActive: true,
    $or: [
      { 'targetBeneficiaries.states': { $in: [user.state, 'all', null] } },
      { 'targetBeneficiaries.states': { $exists: false } },
    ],
  };
  if (user.cropsGrown?.length) {
    query['targetBeneficiaries.crops'] = { $in: [...user.cropsGrown, 'all'] };
  }

  const schemes = await GovernmentScheme.find(query).sort({ isFeatured: -1, createdAt: -1 }).limit(20);
  res.json({ success: true, data: schemes });
}));

// Get single scheme
router.get('/:id', catchAsync(async (req, res) => {
  const scheme = await GovernmentScheme.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('postedBy', 'name');
  if (!scheme) throw new AppError('Scheme not found', 404);
  res.json({ success: true, data: scheme });
}));

// Admin: Create scheme
router.post('/', protect, restrictTo('admin'), catchAsync(async (req, res) => {
  const scheme = await GovernmentScheme.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json({ success: true, data: scheme });
}));

// Admin: Update scheme
router.put('/:id', protect, restrictTo('admin'), catchAsync(async (req, res) => {
  const scheme = await GovernmentScheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!scheme) throw new AppError('Scheme not found', 404);
  res.json({ success: true, data: scheme });
}));

// Admin: Delete scheme
router.delete('/:id', protect, restrictTo('admin'), catchAsync(async (req, res) => {
  await GovernmentScheme.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Scheme deactivated.' });
}));

module.exports = router;
