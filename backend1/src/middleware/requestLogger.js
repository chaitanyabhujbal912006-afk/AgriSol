/**
 * Request Logger Middleware
 */
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?._id,
      userAgent: req.headers['user-agent'],
    };

    if (res.statusCode >= 500) logger.error('Request', logData);
    else if (res.statusCode >= 400) logger.warn('Request', logData);
    else logger.debug('Request', logData);
  });

  next();
};

module.exports = { requestLogger };
