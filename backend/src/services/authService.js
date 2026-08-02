/**
 * Auth Service - Token generation, OTP utilities
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateOTP = (length = parseInt(process.env.OTP_LENGTH) || 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

const generateTokens = async (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    mobile: user.mobile,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
    issuer: 'agrisol',
    audience: 'agrisol-app',
  });

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'agrisol',
    audience: 'agrisol-app',
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const generateSecureToken = () => crypto.randomBytes(32).toString('hex');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = {
  generateOTP,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  generateSecureToken,
  hashToken,
};
