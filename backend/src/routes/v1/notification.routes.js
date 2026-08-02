const express = require('express');
const router = express.Router();
const { Notification } = require('../../models/index');
const { protect } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');

router.get('/', protect, catchAsync(async (req, res) => {
  const { page = 1, limit = 20, unread } = req.query;
  const query = { recipient: req.user._id };
  if (unread === 'true') query.isRead = false;

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
  res.json({ success: true, data: { notifications, unreadCount } });
}));

router.put('/:id/read', protect, catchAsync(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true, readAt: new Date() });
  res.json({ success: true });
}));

router.put('/read-all', protect, catchAsync(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: new Date() });
  res.json({ success: true, message: 'All notifications marked as read.' });
}));

module.exports = router;
