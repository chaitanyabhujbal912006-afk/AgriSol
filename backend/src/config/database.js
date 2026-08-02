/**
 * MongoDB Connection Configuration
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Disable command buffering so operations fail fast instead of hanging when DB is offline
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000, // 3s fast timeout instead of 10s
      socketTimeoutMS: 30000,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
