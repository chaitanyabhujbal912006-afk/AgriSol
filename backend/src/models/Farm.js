/**
 * Farm & Crop Models
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// ── Farm Schema ───────────────────────────────
const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: { type: String, required: true, trim: true },
  location: {
    village: String,
    taluka: String,
    district: String,
    state: String,
    pincode: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number], // [lng, lat]
    },
  },
  totalArea: {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['acres', 'hectares', 'bigha'], default: 'acres' },
  },
  soilType: {
    type: String,
    enum: ['clay', 'loam', 'sandy', 'silt', 'black', 'red', 'alluvial'],
  },
  irrigationSource: {
    type: String,
    enum: ['rainfed', 'canal', 'borewell', 'drip', 'sprinkler', 'mixed'],
  },
  soilHealth: {
    ph: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    organicCarbon: Number,
    lastTestDate: Date,
  },
  images: [{
    url: String,
    publicId: String,
    capturedAt: Date,
    type: { type: String, enum: ['satellite', 'field', 'soil', 'crop'] },
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

farmSchema.index({ 'location.coordinates': '2dsphere' });
farmSchema.index({ farmer: 1, isActive: 1 });

// ── Crop Season Schema ─────────────────────────
const cropSeasonSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
    index: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  cropName: { type: String, required: true, trim: true, index: true },
  cropVariety: String,
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'perennial'],
    required: true,
  },
  year: { type: Number, required: true },
  area: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['acres', 'hectares', 'bigha'], default: 'acres' },
  },

  // ── Timeline ──────────────────────────────
  sowingDate: { type: Date, required: true },
  expectedHarvestDate: Date,
  actualHarvestDate: Date,

  status: {
    type: String,
    enum: ['planned', 'sowing', 'growing', 'flowering', 'harvesting', 'completed', 'failed'],
    default: 'planned',
  },

  // ── Schedules ─────────────────────────────
  irrigationSchedule: [{
    scheduledDate: Date,
    completedDate: Date,
    method: String,
    waterUsed: Number, // liters
    notes: String,
    status: { type: String, enum: ['pending', 'completed', 'skipped'], default: 'pending' },
  }],

  fertilizerSchedule: [{
    scheduledDate: Date,
    completedDate: Date,
    fertilizerName: String,
    quantity: Number,
    unit: String,
    growthStage: String,
    notes: String,
    cost: Number,
    status: { type: String, enum: ['pending', 'completed', 'skipped'], default: 'pending' },
  }],

  pesticideSchedule: [{
    scheduledDate: Date,
    completedDate: Date,
    pesticideName: String,
    targetPest: String,
    quantity: Number,
    unit: String,
    notes: String,
    cost: Number,
    status: { type: String, enum: ['pending', 'completed', 'skipped'], default: 'pending' },
  }],

  // ── Financial Tracking ────────────────────
  expenses: [{
    category: {
      type: String,
      enum: ['seed', 'fertilizer', 'pesticide', 'irrigation', 'labor', 'equipment', 'transport', 'other'],
    },
    description: String,
    amount: Number,
    date: Date,
    receipt: String, // image URL
  }],

  // ── Yield ─────────────────────────────────
  expectedYield: {
    value: Number,
    unit: { type: String, enum: ['kg', 'quintal', 'ton'] },
  },
  actualYield: {
    value: Number,
    unit: { type: String, enum: ['kg', 'quintal', 'ton'] },
  },
  sellingPrice: {
    value: Number,
    unit: String, // per kg, per quintal
    soldTo: String,
    saleDate: Date,
  },

  // ── Growth Stages ─────────────────────────
  growthStages: [{
    stage: String,
    date: Date,
    notes: String,
    images: [String],
  }],

  notes: String,
}, { timestamps: true });

cropSeasonSchema.index({ farmer: 1, cropName: 1, season: 1, year: 1 });
cropSeasonSchema.index({ farm: 1, status: 1 });

// Virtual: total expense
cropSeasonSchema.virtual('totalExpense').get(function () {
  return this.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
});

// Virtual: profit
cropSeasonSchema.virtual('profit').get(function () {
  const revenue = (this.actualYield?.value || 0) * (this.sellingPrice?.value || 0);
  return revenue - this.totalExpense;
});

cropSeasonSchema.plugin(mongoosePaginate);

const Farm = mongoose.model('Farm', farmSchema);
const CropSeason = mongoose.model('CropSeason', cropSeasonSchema);

module.exports = { Farm, CropSeason };
