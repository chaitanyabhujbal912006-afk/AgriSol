/**
 * Community & Expert Support Controller
 */

const { CommunityPost } = require('../../models/index');
const { uploadToCloudinary } = require('../../services/uploadService');
const { sendNotification } = require('../../services/notifications/notificationService');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

// ── Get Posts ─────────────────────────────────
exports.getPosts = catchAsync(async (req, res) => {
  const {
    page = 1, limit = 10,
    category, cropTag, tag,
    sort = 'latest', q,
  } = req.query;

  const query = { isDeleted: false };
  if (category) query.category = category;
  if (cropTag) query.cropTags = cropTag;
  if (tag) query.tags = tag;
  if (q) {
    query.$or = [
      { title: new RegExp(q, 'i') },
      { content: new RegExp(q, 'i') },
      { tags: new RegExp(q, 'i') },
    ];
  }

  const sortOptions = {
    latest: { isPinned: -1, createdAt: -1 },
    popular: { isPinned: -1, 'likes.length': -1, views: -1 },
    unanswered: { isExpertAnswered: 1, createdAt: -1 },
  };

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 50),
    sort: sortOptions[sort] || sortOptions.latest,
    populate: [
      { path: 'author', select: 'name profileImage role district state expertProfile.specialization' },
    ],
    select: '-comments',
  };

  const result = await CommunityPost.paginate(query, options);

  // Add like count & comment count
  result.docs = result.docs.map(post => {
    const obj = post.toObject();
    obj.likeCount = post.likes?.length || 0;
    obj.isLikedByMe = req.user ? post.likes.some(l => l.user?.toString() === req.user._id.toString()) : false;
    return obj;
  });

  res.json({ success: true, data: result });
});

// ── Create Post ───────────────────────────────
exports.createPost = catchAsync(async (req, res) => {
  const { title, content, category, tags, cropTags } = req.body;

  let images = [];
  if (req.files?.length) {
    images = await Promise.all(
      req.files.map(async file => {
        const result = await uploadToCloudinary(file.buffer, {
          folder: `agrisol/community/${req.user._id}`,
        });
        return { url: result.secure_url, publicId: result.public_id };
      })
    );
  }

  const post = await CommunityPost.create({
    author: req.user._id,
    title,
    content,
    category: category || 'discussion',
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    cropTags: cropTags ? (Array.isArray(cropTags) ? cropTags : cropTags.split(',')) : [],
    images,
    location: { district: req.user.district, state: req.user.state },
    language: req.user.preferredLanguage || 'hi',
  });

  await post.populate('author', 'name profileImage role district');

  res.status(201).json({ success: true, data: post });
});

// ── Get Post Detail ───────────────────────────
exports.getPost = catchAsync(async (req, res) => {
  const post = await CommunityPost.findOne({
    _id: req.params.id,
    isDeleted: false,
  })
    .populate('author', 'name profileImage role district state expertProfile')
    .populate('comments.author', 'name profileImage role expertProfile.specialization')
    .populate('expertAnswer.expert', 'name profileImage expertProfile');

  if (!post) throw new AppError('Post not found', 404);

  // Increment views (async)
  CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

  const obj = post.toObject();
  obj.likeCount = post.likes?.length || 0;
  obj.commentCount = post.comments?.filter(c => !c.isDeleted).length || 0;
  obj.isLikedByMe = req.user ? post.likes.some(l => l.user?.toString() === req.user?._id?.toString()) : false;

  res.json({ success: true, data: obj });
});

// ── Like / Unlike Post ────────────────────────
exports.toggleLike = catchAsync(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post || post.isDeleted) throw new AppError('Post not found', 404);

  const userIdx = post.likes.findIndex(l => l.user?.toString() === req.user._id.toString());
  let action;

  if (userIdx > -1) {
    post.likes.splice(userIdx, 1);
    action = 'unliked';
  } else {
    post.likes.push({ user: req.user._id });
    action = 'liked';

    // Notify post author (if not self)
    if (post.author.toString() !== req.user._id.toString()) {
      sendNotification(post.author, {
        type: 'community_reply',
        title: 'New Like',
        body: `${req.user.name} liked your post`,
        data: { postId: post._id },
      }).catch(() => {});
    }
  }

  await post.save();
  res.json({ success: true, action, likeCount: post.likes.length });
});

// ── Add Comment ───────────────────────────────
exports.addComment = catchAsync(async (req, res) => {
  const { content } = req.body;

  const post = await CommunityPost.findById(req.params.id);
  if (!post || post.isDeleted) throw new AppError('Post not found', 404);

  let images = [];
  if (req.files?.length) {
    images = await Promise.all(
      req.files.map(async file => {
        const result = await uploadToCloudinary(file.buffer, { folder: 'agrisol/community/comments' });
        return { url: result.secure_url };
      })
    );
  }

  const comment = {
    author: req.user._id,
    content,
    images,
    isExpertAnswer: req.user.role === 'expert',
    createdAt: new Date(),
  };

  post.comments.push(comment);

  // Mark as expert answered if expert replies
  if (req.user.role === 'expert' && !post.isExpertAnswered) {
    post.isExpertAnswered = true;
    post.expertAnswer = {
      expert: req.user._id,
      content,
      answeredAt: new Date(),
    };
  }

  await post.save();

  // Notify post author
  if (post.author.toString() !== req.user._id.toString()) {
    const notifTitle = req.user.role === 'expert' ? '🌱 Expert Reply' : 'New Reply';
    sendNotification(post.author, {
      type: 'community_reply',
      title: notifTitle,
      body: `${req.user.name}: ${content.substring(0, 100)}`,
      data: { postId: post._id },
    }).catch(() => {});
  }

  await post.populate('comments.author', 'name profileImage role expertProfile.specialization');

  const addedComment = post.comments[post.comments.length - 1];
  res.status(201).json({ success: true, data: addedComment });
});

// ── Delete Post ───────────────────────────────
exports.deletePost = catchAsync(async (req, res) => {
  const post = await CommunityPost.findOne({
    _id: req.params.id,
    $or: [{ author: req.user._id }, { author: req.user.role === 'admin' }],
  });

  if (!post) throw new AppError('Post not found or unauthorized', 404);

  post.isDeleted = true;
  await post.save();

  res.json({ success: true, message: 'Post deleted.' });
});

// ── Report Post ───────────────────────────────
exports.reportPost = catchAsync(async (req, res) => {
  const { reason } = req.body;

  const post = await CommunityPost.findByIdAndUpdate(
    req.params.id,
    {
      $push: { reports: { reportedBy: req.user._id, reason, reportedAt: new Date() } },
      $inc: { reportCount: 1 },
      isReported: true,
    },
    { new: true }
  );

  if (!post) throw new AppError('Post not found', 404);

  res.json({ success: true, message: 'Post reported. Our team will review it.' });
});

// ── Get Expert Questions ──────────────────────
exports.getExpertQuestions = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, answered } = req.query;

  const query = {
    category: 'question',
    isDeleted: false,
  };

  if (answered === 'false') query.isExpertAnswered = false;
  if (answered === 'true') query.isExpertAnswered = true;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { isExpertAnswered: 1, createdAt: -1 },
    populate: [{ path: 'author', select: 'name district state' }],
  };

  const result = await CommunityPost.paginate(query, options);
  res.json({ success: true, data: result });
});
