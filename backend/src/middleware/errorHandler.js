/**
 * Error Handling Middleware
 */

const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// ── 404 Not Found ─────────────────────────────
const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

// ── Global Error Handler ──────────────────────
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  if (error.statusCode >= 500) {
    logger.error({
      message: error.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user?._id,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error = new AppError(`Duplicate field value: ${field} '${value}' already exists`, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new AppError(`Validation failed: ${messages.join('. ')}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired. Please log in again.', 401);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large. Maximum size is 10MB.', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new AppError('Too many files. Maximum 5 files allowed.', 400);
  }

  // Axios errors (external API calls)
  if (err.isAxiosError) {
    error = new AppError('External service unavailable. Please try again.', 503);
  }

  // Send response
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: err,
      stack: err.stack,
    });
  } else {
    res.status(error.statusCode).json({
      success: false,
      message: error.isOperational ? error.message : 'Something went wrong. Please try again.',
      ...(error.statusCode === 422 && { errors: error.errors }),
    });
  }
};

module.exports = { notFound, errorHandler };
