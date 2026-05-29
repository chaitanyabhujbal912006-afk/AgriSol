/**
 * Email Service - Stub (configure SMTP in .env for real emails)
 */
const logger = require('../../utils/logger');

const sendEmail = async ({ to, subject, html, text }) => {
  // In development, just log the email
  logger.info(`📧 Email (stub) to ${to}: ${subject}`);
  return { success: true };
};

module.exports = { sendEmail };
