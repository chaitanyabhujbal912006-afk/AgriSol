/**
 * AgriSol - All Supporting Models
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// ── Disease Report ─────────────────────────────
const diseaseReportSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  cropSeason: { type: mongoose.Schema.Types.ObjectId, ref: 'CropSeason' },

  cropName: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    publicId: String,
    uploadedAt: { type: Date, default: Date.now },
  }],

  // AI Detection Results
  aiAnalysis: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    modelVersion: String,
    processedAt: Date,
    detections: [{
      diseaseName: String,
      diseaseNameHi: String, // Hindi
      diseaseNameMr: String, // Marathi
      confidence: { type: Number, min: 0, max: 100 },
      severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      affectedArea: String, // % estimate
      description: String,
      remedies: [String],
      recommendedPesticides: [{
        name: String,
        dosage: String,
        applicationMethod: String,
        safetyPeriod: String,
        cost: String,
      }],
      organicRemedies: [String],
      preventionTips: [String],
      referenceImages: [String],
    }],
    rawResponse: mongoose.Schema.Types.Mixed,
    errorMessage: String,
  },

  // Expert Review
  expertReview: {
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    diagnosis: String,
    recommendations: String,
    reviewedAt: Date,
  },

  location: {
    district: String,
    state: String,
    coordinates: { type: { type: String }, coordinates: [Number] },
  },

  farmerFeedback: {
    isHelpful: Boolean,
    comment: String,
    feedbackAt: Date,
  },

  status: {
    type: String,
    enum: ['submitted', 'analyzing', 'completed', 'reviewed'],
    default: 'submitted',
  },
}, { timestamps: true });

diseaseReportSchema.index({ farmer: 1, createdAt: -1 });
diseaseReportSchema.index({ 'location.state': 1, 'location.district': 1 });
diseaseReportSchema.index({ cropName: 1, 'aiAnalysis.status': 1 });

// ── Market Price ───────────────────────────────
const marketPriceSchema = new mongoose.Schema({
  cropName: { type: String, required: true, index: true },
  cropNameHi: String,
  variety: String,
  grade: { type: String, enum: ['A', 'B', 'C', 'FAQ'] },

  market: {
    name: { type: String, required: true },
    district: { type: String, index: true },
    state: { type: String, index: true },
    apmc: String, // APMC market code
  },

  price: {
    min: Number,
    max: Number,
    modal: { type: Number, required: true }, // Most common price
    unit: { type: String, default: 'quintal' },
  },

  arrivals: {
    quantity: Number,
    unit: { type: String, default: 'tonnes' },
  },

  priceDate: { type: Date, required: true, index: true },
  source: { type: String, default: 'agmarknet' },

  // AI prediction
  prediction: {
    nextWeekPrice: Number,
    trend: { type: String, enum: ['rising', 'falling', 'stable'] },
    confidence: Number,
    generatedAt: Date,
  },
}, { timestamps: true });

marketPriceSchema.index({ cropName: 1, 'market.state': 1, priceDate: -1 });
marketPriceSchema.index({ priceDate: -1 });

// ── Government Scheme ──────────────────────────
const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHi: String,
  titleMr: String,

  description: { type: String, required: true },
  descriptionHi: String,
  descriptionMr: String,

  category: {
    type: String,
    enum: ['subsidy', 'loan', 'insurance', 'training', 'infrastructure', 'market', 'other'],
    required: true,
  },

  targetBeneficiaries: {
    crops: [String],
    states: [String],
    districts: [String],
    farmerCategory: [{ type: String, enum: ['small', 'marginal', 'large', 'all'] }],
    landSizeMin: Number, // acres
    landSizeMax: Number,
  },

  benefits: {
    type: String,
    amount: Number,
    currency: { type: String, default: 'INR' },
    description: String,
  },

  eligibility: [String],
  requiredDocuments: [String],
  applicationProcess: String,
  applicationUrl: String,
  helplineNumber: String,

  deadline: Date,
  launchDate: Date,

  ministry: String,
  department: String,
  scheme_code: String,

  isActive: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false },

  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 },

  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ url: String, publicId: String }],
}, { timestamps: true });

schemeSchema.index({ 'targetBeneficiaries.states': 1, isActive: 1 });
schemeSchema.index({ category: 1, isActive: 1 });

// ── Community Post ─────────────────────────────
const communityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  title: { type: String, trim: true },
  content: { type: String, required: true },

  category: {
    type: String,
    enum: ['question', 'discussion', 'tip', 'success_story', 'alert', 'expert_advice'],
    default: 'discussion',
  },

  tags: [{ type: String, trim: true, lowercase: true }],
  cropTags: [String],

  images: [{
    url: String,
    publicId: String,
  }],

  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likedAt: { type: Date, default: Date.now },
  }],

  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    images: [{ url: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isExpertAnswer: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    isDeleted: { type: Boolean, default: false },
  }],

  isExpertAnswered: { type: Boolean, default: false, index: true },
  expertAnswer: {
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    answeredAt: Date,
  },

  views: { type: Number, default: 0 },
  isReported: { type: Boolean, default: false },
  reportCount: { type: Number, default: 0 },
  reports: [{
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    reportedAt: Date,
  }],

  isPinned: { type: Boolean, default: false },
  isModerated: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },

  location: { district: String, state: String },
  language: { type: String, default: 'hi' },
}, { timestamps: true });

communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ cropTags: 1 });
communityPostSchema.index({ category: 1, isDeleted: 1 });

// ── Chat Message ───────────────────────────────
const chatMessageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isGroupMessage: { type: Boolean, default: false },
  groupId: String,

  messageType: {
    type: String,
    enum: ['text', 'image', 'voice', 'file', 'location'],
    default: 'text',
  },

  content: String,
  mediaUrl: String,
  mediaPublicId: String,

  isRead: { type: Boolean, default: false },
  readAt: Date,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });

chatMessageSchema.index({ conversationId: 1, createdAt: -1 });

// ── Notification ───────────────────────────────
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  type: {
    type: String,
    enum: [
      'weather_alert', 'crop_reminder', 'market_price', 'scheme_alert',
      'community_reply', 'expert_answer', 'disease_result', 'system',
      'pest_outbreak', 'irrigation_reminder', 'fertilizer_reminder',
    ],
    required: true,
  },

  title: { type: String, required: true },
  titleHi: String,
  titleMr: String,

  body: { type: String, required: true },
  bodyHi: String,
  bodyMr: String,

  data: mongoose.Schema.Types.Mixed, // Extra payload

  channels: {
    push: { sent: Boolean, sentAt: Date, error: String },
    sms: { sent: Boolean, sentAt: Date, error: String, messageId: String },
    email: { sent: Boolean, sentAt: Date, error: String },
  },

  isRead: { type: Boolean, default: false, index: true },
  readAt: Date,

  actionUrl: String,
  imageUrl: String,

  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  expiresAt: Date,
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// ── Weather Log ────────────────────────────────
const weatherLogSchema = new mongoose.Schema({
  location: {
    district: { type: String, index: true },
    state: { type: String, index: true },
    coordinates: {
      lat: Number,
      lon: Number,
    },
  },
  current: {
    temperature: Number,
    feelsLike: Number,
    humidity: Number,
    pressure: Number,
    windSpeed: Number,
    windDirection: Number,
    visibility: Number,
    uvIndex: Number,
    condition: String,
    conditionCode: Number,
    icon: String,
    rainfall: Number, // mm in last hour
  },
  forecast: [{
    date: Date,
    tempMin: Number,
    tempMax: Number,
    humidity: Number,
    rainfall: Number,
    condition: String,
    icon: String,
    windSpeed: Number,
    farmingSuggestion: String,
  }],
  alerts: [{
    type: String,
    severity: String,
    description: String,
    startTime: Date,
    endTime: Date,
  }],
  source: { type: String, default: 'openweathermap' },
  fetchedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

weatherLogSchema.index({ 'location.district': 1, fetchedAt: -1 });

// ── Soil Analysis ──────────────────────────────
const soilAnalysisSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  imageUrl: String,
  classifiedType: String,
  confidence: Number,
  pH: Number,
  nitrogen: String,
  phosphorus: String,
  potassium: String,
}, { timestamps: true });

soilAnalysisSchema.index({ farmer: 1, createdAt: -1 });

// ── Calendar Event ─────────────────────────────
const calendarEventSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cropName: { type: String, required: true },
  action: { type: String, required: true },
  completed: { type: Boolean, default: false },
  eventDate: { type: Date, required: true },
}, { timestamps: true });

calendarEventSchema.index({ farmer: 1, eventDate: 1 });

// Export all models
module.exports = {
  DiseaseReport: mongoose.model('DiseaseReport', diseaseReportSchema),
  MarketPrice: mongoose.model('MarketPrice', marketPriceSchema),
  GovernmentScheme: mongoose.model('GovernmentScheme', schemeSchema),
  CommunityPost: mongoose.model('CommunityPost', communityPostSchema),
  ChatMessage: mongoose.model('ChatMessage', chatMessageSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  WeatherLog: mongoose.model('WeatherLog', weatherLogSchema),
  SoilAnalysis: mongoose.model('SoilAnalysis', soilAnalysisSchema),
  CalendarEvent: mongoose.model('CalendarEvent', calendarEventSchema),
};
