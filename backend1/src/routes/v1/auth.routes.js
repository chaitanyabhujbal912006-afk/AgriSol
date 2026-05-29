/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & Authorization
 */

const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');
const { protect } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resetPasswordSchema,
} = require('../../validators/auth.validator');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new farmer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, mobile, password]
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 minLength: 8
 *               village:
 *                 type: string
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *               preferredLanguage:
 *                 type: string
 *                 enum: [en, hi, mr]
 *     responses:
 *       201:
 *         description: Registration successful, OTP sent
 *       409:
 *         description: Mobile already registered
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify mobile OTP
 *     tags: [Auth]
 */
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Resend OTP to mobile
 *     tags: [Auth]
 */
router.post('/resend-otp', authController.resendOTP);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with mobile and password
 *     tags: [Auth]
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/v1/auth/login-otp:
 *   post:
 *     summary: Request OTP login
 *     tags: [Auth]
 */
router.post('/login-otp', authController.loginWithOTP);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout (invalidate tokens)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', protect, authController.logout);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, authController.getMe);

/**
 * @swagger
 * /api/v1/auth/fcm-token:
 *   put:
 *     summary: Update FCM push token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.put('/fcm-token', protect, authController.updateFCMToken);

module.exports = router;
