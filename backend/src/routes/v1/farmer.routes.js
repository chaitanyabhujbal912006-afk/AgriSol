const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { Farm, CropSeason } = require('../../models/Farm');
const { protect, isOwnerOrAdmin } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const { upload, uploadToCloudinary } = require('../../services/uploadService');

// Get farmer profile
router.get('/profile', protect, catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  res.json({ success: true, data: user });
}));

// Update farmer profile
router.put('/profile', protect, catchAsync(async (req, res) => {
  const allowedFields = ['name', 'email', 'village', 'taluka', 'district', 'state', 'pincode',
    'landSize', 'cropsGrown', 'farmingType', 'soilType', 'irrigationType', 'preferredLanguage',
    'notificationPreferences', 'gender', 'dateOfBirth'];

  const updates = {};
  allowedFields.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, data: user.toSafeJSON() });
}));

// Upload profile image
router.put('/profile/image', protect, upload.single('image'), catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No image uploaded', 400);
  const result = await uploadToCloudinary(req.file.buffer, { folder: `agrisol/profiles/${req.user._id}`, transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] });
  const user = await User.findByIdAndUpdate(req.user._id, { profileImage: { url: result.secure_url, publicId: result.public_id } }, { new: true });
  res.json({ success: true, data: { profileImage: user.profileImage } });
}));

// Get dashboard stats
router.get('/dashboard', protect, catchAsync(async (req, res) => {
  const [activeCrops, totalFarms, completedHarvests] = await Promise.all([
    CropSeason.countDocuments({ farmer: req.user._id, status: { $in: ['sowing', 'growing', 'flowering'] } }),
    Farm.countDocuments({ farmer: req.user._id, isActive: true }),
    CropSeason.countDocuments({ farmer: req.user._id, status: 'completed' }),
  ]);

  const recentCrops = await CropSeason.find({ farmer: req.user._id }).sort({ createdAt: -1 }).limit(5).populate('farm', 'name');
  const totalExpenseResult = await CropSeason.aggregate([
    { $match: { farmer: req.user._id } },
    { $unwind: { path: '$expenses', preserveNullAndEmptyArrays: true } },
    { $group: { _id: null, total: { $sum: '$expenses.amount' } } },
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        activeCrops,
        totalFarms,
        completedHarvests,
        totalExpense: totalExpenseResult[0]?.total || 0,
      },
      recentCrops,
    },
  });
}));

module.exports = router;
