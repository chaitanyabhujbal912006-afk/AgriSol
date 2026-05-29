/**
 * Auth Validation Schemas
 */
const Joi = require('joi');

const mobileSchema = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .required()
  .messages({
    'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number',
    'any.required': 'Mobile number is required',
  });

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
  mobile: mobileSchema,
  email: Joi.string().email().lowercase().optional(),
  password: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
  }),
  village: Joi.string().max(100).optional(),
  taluka: Joi.string().max(100).optional(),
  district: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  pincode: Joi.string().pattern(/^\d{6}$/).optional(),
  preferredLanguage: Joi.string().valid('en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu').default('hi'),
  landSize: Joi.object({
    value: Joi.number().min(0),
    unit: Joi.string().valid('acres', 'hectares', 'bigha'),
  }).optional(),
  cropsGrown: Joi.array().items(Joi.string()).optional(),
  role: Joi.string().valid('farmer', 'expert').default('farmer'),
});

const loginSchema = Joi.object({
  mobile: mobileSchema,
  password: Joi.string().required(),
});

const verifyOTPSchema = Joi.object({
  mobile: mobileSchema,
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
  }),
});

const resetPasswordSchema = Joi.object({
  mobile: mobileSchema,
  otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  newPassword: Joi.string().min(8).max(128).required(),
});

module.exports = { registerSchema, loginSchema, verifyOTPSchema, resetPasswordSchema };
