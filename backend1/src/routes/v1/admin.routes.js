const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { CommunityPost, DiseaseReport } = require('../../models/index');
const { protect, restrictTo } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');

// All admin routes require admin role
router.use(protect, restrictTo('admin'));

// Dashboard stats
router.get('/dashboard', catchAsync(async (req, res) => {
  const [totalFarmers, totalExperts, pendingExperts, totalPosts, totalDiseaseReports, reportedPosts] = await Promise.all([
    User.countDocuments({ role: 'farmer', isActive: true }),
    User.countDocuments({ role: 'expert', isActive: true }),
    User.countDocuments({ role: 'expert', 'expertProfile.verificationStatus': 'pending' }),
    CommunityPost.countDocuments({ isDeleted: false }),
    DiseaseReport.countDocuments(),
    CommunityPost.countDocuments({ isReported: true, isModerated: false }),
  ]);

  // New users this week
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({ createdAt: { $gte: weekAgo } });

  res.json({
    success: true,
    data: {
      totalFarmers, totalExperts, pendingExperts,
      totalPosts, totalDiseaseReports, reportedPosts,
      newUsersThisWeek: newUsers,
    },
  });
}));

// User management
router.get('/users', catchAsync(async (req, res) => {
  const { role, page = 1, limit = 20, search, state } = req.query;
  const query = {};
  if (role) query.role = role;
  if (state) query.state = state;
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { mobile: new RegExp(search, 'i') }];

  const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
  const total = await User.countDocuments(query);
  res.json({ success: true, data: { users: users.map(u => u.toSafeJSON()), total } });
}));

router.put('/users/:id/ban', catchAsync(async (req, res) => {
  const { reason } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true, banReason: reason }, { new: true });
  res.json({ success: true, message: 'User banned.', data: user.toSafeJSON() });
}));

router.put('/users/:id/unban', catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false, banReason: null }, { new: true });
  res.json({ success: true, message: 'User unbanned.', data: user.toSafeJSON() });
}));

// Expert verification
router.get('/experts/pending', catchAsync(async (req, res) => {
  const experts = await User.find({ role: 'expert', 'expertProfile.verificationStatus': 'pending' });
  res.json({ success: true, data: experts.map(u => u.toSafeJSON()) });
}));

router.put('/experts/:id/verify', catchAsync(async (req, res) => {
  const { status } = req.body; // 'verified' or 'rejected'
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 'expertProfile.verificationStatus': status, 'expertProfile.verifiedAt': new Date() },
    { new: true }
  );
  res.json({ success: true, data: user.toSafeJSON() });
}));

// Content moderation
router.get('/reported-posts', catchAsync(async (req, res) => {
  const posts = await CommunityPost.find({ isReported: true, isModerated: false })
    .populate('author', 'name mobile').sort({ reportCount: -1 });
  res.json({ success: true, data: posts });
}));

router.put('/posts/:id/moderate', catchAsync(async (req, res) => {
  const { action } = req.body; // 'approve' or 'remove'
  const update = action === 'remove'
    ? { isDeleted: true, isModerated: true }
    : { isReported: false, reportCount: 0, isModerated: true };

  const post = await CommunityPost.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json({ success: true, data: post });
}));

module.exports = router;
