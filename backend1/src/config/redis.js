/**
 * Redis Connection Configuration
 */

const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        // Stop retrying after 5 attempts — server works without Redis
        reconnectStrategy: (retries) => {
          if (retries >= 5) {
            logger.warn('Redis: max retries reached, giving up. Running without cache.');
            return false; // stop retrying
          }
          return Math.min(retries * 100, 500);
        },
        connectTimeout: 3000,
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB) || 0,
    });

    redisClient.on('error', (err) => {
      // Only log once, not every retry
      if (!redisClient._errorLogged) {
        logger.warn('Redis unavailable — running without cache.');
        redisClient._errorLogged = true;
      }
    });
    redisClient.on('connect', () => logger.info('✅ Redis Connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn('Redis not available — running without cache.');
    return null;
  }
};

const getRedisClient = () => redisClient;

// Cache helpers
const cache = {
  async get(key) {
    if (!redisClient?.isOpen) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.error('Cache get error:', err);
      return null;
    }
  },

  async set(key, value, ttlSeconds = 3600) {
    if (!redisClient?.isOpen) return false;
    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (err) {
      logger.error('Cache set error:', err);
      return false;
    }
  },

  async del(key) {
    if (!redisClient?.isOpen) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (err) {
      logger.error('Cache del error:', err);
      return false;
    }
  },

  async delPattern(pattern) {
    if (!redisClient?.isOpen) return false;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) await redisClient.del(keys);
      return true;
    } catch (err) {
      logger.error('Cache delPattern error:', err);
      return false;
    }
  },
};

module.exports = connectRedis;
module.exports.getRedisClient = getRedisClient;
module.exports.cache = cache;
