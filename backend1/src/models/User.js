/**
 * User Model - Farmers, Experts, Admins
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
  // ── Identity ──────────────────────────────
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
  },
  mobile: {
    type: String,
    unique: true,
    required: [true, 'Mobile number is required'],
    match: [/^[6-9]\d{9}$/, 'Invalid Indian mobile number'],
  },
  passwordHash: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ['farmer', 'expert', 'admin'],
    default: 'farmer',
  },

  // ── Profile ───────────────────────────────
  profileImage: {
    url: String,
    publicId: String,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },

  // ── Location ──────────────────────────────
  village: { type: String, trim: true },
  taluka: { type: String, trim: true },
  district: { type: String, trim: true, index: true },
  state: { type: String, trim: true, index: true },
  pincode: { type: String, match: [/^\d{6}$/, 'Invalid pincode'] },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },

  // ── Farming Details ───────────────────────
  landSize: {
    value: { type: Number, min: 0 },
    unit: { type: String, enum: ['acres', 'hectares', 'bigha'], default: 'acres' },
  },
  cropsGrown: [{ type: String, trim: true }],
  farmingType: {
    type: String,
    enum: ['organic', 'conventional', 'mixed', 'hydroponic'],
    default: 'conventional',
  },
  soilType: {
    type: String,
    enum: ['clay', 'loam', 'sandy', 'silt', 'black', 'red', 'alluvial'],
  },
  irrigationType: {
    type: String,
    enum: ['rainfed', 'canal', 'borewell', 'drip', 'sprinkler', 'mixed'],
  },

  // ── Language & Preferences ────────────────
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu', 'pa', 'bn'],
    default: 'hi',
  },
  notificationPreferences: {
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    weather: { type: Boolean, default: true },
    market: { type: Boolean, default: true },
    crop: { type: Boolean, default: true },
    schemes: { type: Boolean, default: true },
  },

  // ── Expert Fields ─────────────────────────
  expertProfile: {
    specialization: [String],
    qualifications: String,
    experience: Number, // years
    organization: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedAt: Date,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
  },

  // ── Auth & Security ───────────────────────
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  banReason: String,

  otp: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
  },

  passwordResetToken: String,
  passwordResetExpires: Date,

  fcmTokens: [{ // Firebase push notification tokens
    token: String,
    device: String,
    addedAt: { type: Date, default: Date.now },
  }],

  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    userAgent: String,
    ip: String,
  }],

  lastLogin: Date,
  loginCount: { type: Number, default: 0 },

  // ── Financial Tracking ────────────────────
  financialYear: {
    totalExpense: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    lastUpdated: Date,
  },

  // ── Sustainability ────────────────────────
  carbonFootprint: {
    score: Number,
    lastCalculated: Date,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ── Indexes ───────────────────────────────────
userSchema.index({ coordinates: '2dsphere' });
userSchema.index({ state: 1, district: 1 });
userSchema.index({ cropsGrown: 1 });
userSchema.index({ createdAt: -1 });

// ── Virtuals ──────────────────────────────────
userSchema.virtual('farms', {
  ref: 'Farm',
  localField: '_id',
  foreignField: 'farmer',
});

// ── Methods ───────────────────────────────────
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.otp;
  delete obj.passwordResetToken;
  delete obj.refreshTokens;
  delete obj.fcmTokens;
  return obj;
};

// ── Pre-save hooks ────────────────────────────
userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash') && this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
