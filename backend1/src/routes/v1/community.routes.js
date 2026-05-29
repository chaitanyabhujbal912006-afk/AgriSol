const express = require('express');
const router = express.Router();
const communityController = require('../../controllers/community/communityController');
const { protect, optionalAuth, restrictTo } = require('../../middleware/auth');
const { upload } = require('../../services/uploadService');

router.get('/', optionalAuth, communityController.getPosts);
router.post('/', protect, upload.array('images', 3), communityController.createPost);
router.get('/expert-questions', communityController.getExpertQuestions);
router.get('/:id', optionalAuth, communityController.getPost);
router.delete('/:id', protect, communityController.deletePost);
router.post('/:id/like', protect, communityController.toggleLike);
router.post('/:id/comment', protect, upload.array('images', 2), communityController.addComment);
router.post('/:id/report', protect, communityController.reportPost);

module.exports = router;
