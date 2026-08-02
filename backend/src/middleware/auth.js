/**
 * Auth Middleware - JWT verification, role-based access control
 */

const User = require('../models/User');
const { verifyAccessToken } = require('../services/authService');
const { cache } = require('../config/redis');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// ── Protect Route (require auth) ──────────────
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) throw new AppError('You are not logged in. Please log in to access this resource.', 401);

  // Check blacklist
  const isBlacklisted = await cache.get(`blacklist:${token}`);
  if (isBlacklisted) throw new AppError('Token has been invalidated. Please log in again.', 401);

  // Verify token
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new AppError('Your session has expired. Please log in again.', 401);
    throw new AppError('Invalid token. Please log in again.', 401);
  }

  // Get fresh user
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('User belonging to this token no longer exists.', 401);
  if (!user.isActive) throw new AppError('Account deactivated.', 403);
  if (user.isBanned) throw new AppError('Account suspended.', 403);

  req.user = user;
  req.token = token;
  next();
});

// ── Role-based Access Control ─────────────────
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

// ── Optional Auth (doesn't fail if no token) ──
exports.optionalAuth = catchAsync(async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user?.isActive && !user.isBanned) req.user = user;
    }
  } catch (err) {
    // Ignore auth errors for optional auth
  }
  next();
});

// ── Verified Mobile Only ───────────────────────
exports.requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return next(new AppError('Please verify your mobile number first.', 403));
  }
  next();
};

// ── Own Resource or Admin ─────────────────────
exports.isOwnerOrAdmin = (paramIdField = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[paramIdField];
    if (req.user.role === 'admin' || req.user._id.toString() === resourceId) {
      return next();
    }
    next(new AppError('You do not have permission to access this resource.', 403));
  };
};
