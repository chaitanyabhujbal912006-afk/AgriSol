/**
 * Auth Controller
 * Handles: Registration, Login, OTP, JWT, Refresh, Logout, Password Reset
 */

const crypto = require('crypto');
const User = require('../../models/User');
const { generateOTP, generateTokens, verifyRefreshToken } = require('../../services/authService');
const { sendSMS } = require('../../services/sms/smsService');
const { sendEmail } = require('../../services/notifications/emailService');
const { cache } = require('../../config/redis');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../utils/logger');

// ── Register ──────────────────────────────────
exports.register = catchAsync(async (req, res) => {
  const {
    name, mobile, email, password,
    village, district, state, pincode,
    preferredLanguage, landSize, cropsGrown,
  } = req.body;

  // Check duplicate
  const existingUser = await User.findOne({ mobile });
  if (existingUser) {
    throw new AppError('Mobile number already registered', 409);
  }

  // Create user
  const user = await User.create({
    name,
    mobile,
    email,
    passwordHash: password, // pre-save hook hashes it
    village,
    district,
    state,
    pincode,
    preferredLanguage: preferredLanguage || 'hi',
    landSize,
    cropsGrown,
    role: 'farmer',
  });

  // Generate and send OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES || 10) * 60000);

  user.otp = { code: otp, expiresAt: otpExpiry, attempts: 0 };
  await user.save({ validateBeforeSave: false });

  // Send OTP via SMS
  await sendSMS(mobile, `AgriSol OTP: ${otp}. Valid for 10 minutes. Do not share with anyone.`);

  logger.info(`New farmer registered: ${mobile}`);

  res.status(201).json({
    success: true,
    message: 'Registration successful. OTP sent to your mobile number.',
    data: { userId: user._id, mobile },
  });
});

// ── Verify OTP ────────────────────────────────
exports.verifyOTP = catchAsync(async (req, res) => {
  const { mobile, otp } = req.body;

  const user = await User.findOne({ mobile }).select('+otp');
  if (!user) throw new AppError('User not found', 404);

  if (!user.otp?.code) throw new AppError('No OTP found. Please request a new one.', 400);
  if (new Date() > user.otp.expiresAt) throw new AppError('OTP has expired. Please request a new one.', 400);

  // Increment attempts
  user.otp.attempts += 1;
  if (user.otp.attempts > 5) {
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Too many OTP attempts. Please request a new one.', 429);
  }

  if (user.otp.code !== otp) {
    await user.save({ validateBeforeSave: false });
    throw new AppError(`Invalid OTP. ${5 - user.otp.attempts} attempts remaining.`, 400);
  }

  // Success
  user.isVerified = true;
  user.otp = undefined;
  user.loginCount += 1;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } = await generateTokens(user);

  // Store refresh token
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  // Keep only last 5 refresh tokens
  if (user.refreshTokens.length > 5) user.refreshTokens.shift();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Mobile number verified successfully.',
    data: {
      user: user.toSafeJSON(),
      accessToken,
      refreshToken,
    },
  });
});

// ── Resend OTP ────────────────────────────────
exports.resendOTP = catchAsync(async (req, res) => {
  const { mobile } = req.body;

  // Rate limiting via Redis
  const rateLimitKey = `otp_resend:${mobile}`;
  const count = await cache.get(rateLimitKey);
  if (count && parseInt(count) >= 3) {
    throw new AppError('Too many OTP requests. Please wait 15 minutes.', 429);
  }

  const user = await User.findOne({ mobile });
  if (!user) throw new AppError('User not found', 404);

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60000);

  user.otp = { code: otp, expiresAt: otpExpiry, attempts: 0 };
  await user.save({ validateBeforeSave: false });

  await sendSMS(mobile, `AgriSol OTP: ${otp}. Valid for 10 minutes.`);
  await cache.set(rateLimitKey, (parseInt(count) || 0) + 1, 15 * 60);

  res.json({ success: true, message: 'OTP sent successfully.' });
});

// ── Login with Password ───────────────────────
exports.login = catchAsync(async (req, res) => {
  const { mobile, password } = req.body;

  const user = await User.findOne({ mobile }).select('+passwordHash');
  if (!user || !user.passwordHash) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!await user.comparePassword(password)) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isVerified) throw new AppError('Please verify your mobile number first', 403);
  if (user.isBanned) throw new AppError(`Account suspended: ${user.banReason}`, 403);
  if (!user.isActive) throw new AppError('Account deactivated', 403);

  user.loginCount += 1;
  user.lastLogin = new Date();

  const { accessToken, refreshToken } = await generateTokens(user);

  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  if (user.refreshTokens.length > 5) user.refreshTokens.shift();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Login successful',
    data: { user: user.toSafeJSON(), accessToken, refreshToken },
  });
});

// ── Login via OTP ─────────────────────────────
exports.loginWithOTP = catchAsync(async (req, res) => {
  const { mobile } = req.body;

  const user = await User.findOne({ mobile });
  if (!user) throw new AppError('Mobile number not registered', 404);
  if (user.isBanned) throw new AppError('Account suspended', 403);

  const otp = generateOTP();
  user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60000), attempts: 0 };
  await user.save({ validateBeforeSave: false });

  await sendSMS(mobile, `AgriSol Login OTP: ${otp}. Valid for 10 minutes.`);

  res.json({ success: true, message: 'OTP sent to your registered mobile number.' });
});

// ── Refresh Token ─────────────────────────────
exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 400);

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('User not found', 404);

  const storedToken = user.refreshTokens.find(t => t.token === refreshToken);
  if (!storedToken || new Date() > storedToken.expiresAt) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Rotate refresh token
  user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);
  user.refreshTokens.push({
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    data: { accessToken, refreshToken: newRefreshToken },
  });
});

// ── Logout ────────────────────────────────────
exports.logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const user = req.user;

  if (refreshToken) {
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    await user.save({ validateBeforeSave: false });
  }

  // Blacklist access token in Redis
  await cache.set(`blacklist:${req.token}`, '1', 15 * 60);

  res.json({ success: true, message: 'Logged out successfully.' });
});

// ── Forgot Password ───────────────────────────
exports.forgotPassword = catchAsync(async (req, res) => {
  const { mobile } = req.body;

  const user = await User.findOne({ mobile });
  if (!user) throw new AppError('User not found', 404);

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 15 * 60000); // 15 min
  await user.save({ validateBeforeSave: false });

  // Send OTP style reset
  const otp = generateOTP();
  user.otp = { code: otp, expiresAt: new Date(Date.now() + 15 * 60000), attempts: 0 };
  await user.save({ validateBeforeSave: false });

  await sendSMS(mobile, `AgriSol Password Reset OTP: ${otp}. Valid 15 minutes.`);

  res.json({ success: true, message: 'Password reset OTP sent to your mobile.' });
});

// ── Reset Password ────────────────────────────
exports.resetPassword = catchAsync(async (req, res) => {
  const { mobile, otp, newPassword } = req.body;

  const user = await User.findOne({ mobile }).select('+otp');
  if (!user) throw new AppError('User not found', 404);
  if (!user.otp?.code || new Date() > user.otp.expiresAt) {
    throw new AppError('OTP expired or invalid', 400);
  }
  if (user.otp.code !== otp) throw new AppError('Invalid OTP', 400);

  user.passwordHash = newPassword; // pre-save will hash
  user.otp = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // Invalidate all sessions
  await user.save();

  res.json({ success: true, message: 'Password reset successfully.' });
});

// ── Get Me ────────────────────────────────────
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate('farms');
  res.json({ success: true, data: user.toSafeJSON() });
});

// ── Update FCM Token ──────────────────────────
exports.updateFCMToken = catchAsync(async (req, res) => {
  const { token, device } = req.body;
  const user = req.user;

  // Remove old token for same device, add new
  user.fcmTokens = user.fcmTokens.filter(t => t.device !== device);
  user.fcmTokens.push({ token, device, addedAt: new Date() });
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'FCM token updated.' });
});
