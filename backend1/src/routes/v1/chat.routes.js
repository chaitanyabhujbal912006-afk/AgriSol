const express = require('express');
const router = express.Router();
const { ChatMessage } = require('../../models/index');
const { protect } = require('../../middleware/auth');
const catchAsync = require('../../utils/catchAsync');

// Get conversation history
router.get('/conversation/:userId', protect, catchAsync(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const myId = req.user._id.toString();
  const otherId = req.params.userId;
  const conversationId = [myId, otherId].sort().join('_');

  const messages = await ChatMessage.find({ conversationId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('sender', 'name profileImage role');

  res.json({ success: true, data: messages.reverse() });
}));

// Get all my conversations
router.get('/conversations', protect, catchAsync(async (req, res) => {
  const userId = req.user._id.toString();

  const conversations = await ChatMessage.aggregate([
    { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }], isDeleted: false } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' }, messageCount: { $sum: 1 } } },
    { $sort: { 'lastMessage.createdAt': -1 } },
    { $limit: 30 },
  ]);

  res.json({ success: true, data: conversations });
}));

module.exports = router;
