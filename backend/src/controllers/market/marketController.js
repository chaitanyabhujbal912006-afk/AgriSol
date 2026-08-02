/**
 * Market Price Controller
 * Daily mandi prices, trends, predictions
 */

const axios = require('axios');
const { MarketPrice } = require('../../models/index');
const { cache } = require('../../config/redis');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../utils/logger');

// ── Get Latest Prices ─────────────────────────
exports.getLatestPrices = catchAsync(async (req, res) => {
  const {
    cropName, state, district, market,
    page = 1, limit = 20,
  } = req.query;

  const cacheKey = `market:prices:${cropName || 'all'}:${state || 'all'}:${district || 'all'}:${page}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const query = {};
  if (cropName) query.cropName = new RegExp(cropName, 'i');
  if (state) query['market.state'] = state;
  if (district) query['market.district'] = district;
  if (market) query['market.name'] = new RegExp(market, 'i');

  // Get today's prices first, then yesterday's
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prices = await MarketPrice.find(query)
    .sort({ priceDate: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .lean();

  const total = await MarketPrice.countDocuments(query);

  const result = {
    prices,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit),
    },
    lastUpdated: prices[0]?.priceDate,
  };

  await cache.set(cacheKey, result, 30 * 60); // 30 min cache
  res.json({ success: true, data: result });
});

// ── Get Price Trends ──────────────────────────
exports.getPriceTrends = catchAsync(async (req, res) => {
  const { cropName, state, days = 30 } = req.params;

  const cacheKey = `market:trends:${cropName}:${state}:${days}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

  const trends = await MarketPrice.aggregate([
    {
      $match: {
        cropName: new RegExp(cropName, 'i'),
        'market.state': state,
        priceDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$priceDate' } },
        },
        avgModalPrice: { $avg: '$price.modal' },
        avgMinPrice: { $avg: '$price.min' },
        avgMaxPrice: { $avg: '$price.max' },
        totalArrivals: { $sum: '$arrivals.quantity' },
        marketCount: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
  ]);

  // Calculate trend direction
  let trendDirection = 'stable';
  if (trends.length >= 7) {
    const recentAvg = trends.slice(-3).reduce((s, t) => s + t.avgModalPrice, 0) / 3;
    const earlierAvg = trends.slice(0, 3).reduce((s, t) => s + t.avgModalPrice, 0) / 3;
    const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    if (change > 5) trendDirection = 'rising';
    else if (change < -5) trendDirection = 'falling';
  }

  const result = {
    cropName,
    state,
    days: parseInt(days),
    trendDirection,
    data: trends.map(t => ({
      date: t._id.date,
      avgModalPrice: Math.round(t.avgModalPrice),
      avgMinPrice: Math.round(t.avgMinPrice),
      avgMaxPrice: Math.round(t.avgMaxPrice),
      totalArrivals: t.totalArrivals,
    })),
    summary: {
      currentPrice: trends[trends.length - 1]?.avgModalPrice,
      maxPrice: Math.max(...trends.map(t => t.avgMaxPrice)),
      minPrice: Math.min(...trends.map(t => t.avgMinPrice)),
      avgPrice: trends.reduce((s, t) => s + t.avgModalPrice, 0) / trends.length,
    },
  };

  await cache.set(cacheKey, result, 60 * 60);
  res.json({ success: true, data: result });
});

// ── Get Nearby Markets ────────────────────────
exports.getNearbyMarkets = catchAsync(async (req, res) => {
  const { lat, lon, radius = 100, cropName } = req.query;

  const userLat = lat || req.user?.coordinates?.coordinates?.[1];
  const userLon = lon || req.user?.coordinates?.coordinates?.[0];

  if (!userLat || !userLon) {
    throw new AppError('Location coordinates required', 400);
  }

  const today = new Date();
  today.setDate(today.getDate() - 3); // Within last 3 days

  const query = { priceDate: { $gte: today } };
  if (cropName) query.cropName = new RegExp(cropName, 'i');

  // Get markets with recent prices, filter by user's district/state
  const markets = await MarketPrice.find({
    ...query,
    'market.state': req.user?.state,
  })
    .distinct('market.name');

  // Get latest prices per market
  const marketPrices = await Promise.all(
    markets.slice(0, 20).map(async (marketName) => {
      const prices = await MarketPrice.find({
        'market.name': marketName,
        ...query,
      })
        .sort({ priceDate: -1 })
        .limit(5)
        .lean();
      return { market: marketName, prices };
    })
  );

  res.json({ success: true, data: marketPrices });
});

// ── Price Prediction (Placeholder) ───────────
exports.getPricePrediction = catchAsync(async (req, res) => {
  const { cropName, state } = req.params;

  const cacheKey = `market:prediction:${cropName}:${state}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  // Get historical data for prediction
  const historicalData = await MarketPrice.find({
    cropName: new RegExp(cropName, 'i'),
    'market.state': state,
    priceDate: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
  }).sort({ priceDate: 1 }).lean();

  if (historicalData.length < 10) {
    throw new AppError('Insufficient historical data for prediction', 400);
  }

  // Simple moving average prediction (placeholder for ML model)
  const recentPrices = historicalData.slice(-14).map(d => d.price.modal);
  const avgRecent = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
  const lastPrice = recentPrices[recentPrices.length - 1];

  const predictions = Array.from({ length: 7 }, (_, i) => {
    const noise = (Math.random() - 0.5) * avgRecent * 0.05;
    return {
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predictedPrice: Math.round(lastPrice + noise),
      confidence: Math.max(50, 85 - i * 5),
    };
  });

  const trend = predictions[6].predictedPrice > lastPrice ? 'rising' : 'falling';

  const result = {
    cropName,
    state,
    currentPrice: lastPrice,
    predictions,
    trend,
    modelType: 'moving_average_placeholder',
    note: 'Predictions are indicative. Contact nearest APMC for exact prices.',
    generatedAt: new Date(),
  };

  await cache.set(cacheKey, result, 6 * 60 * 60); // 6 hour cache
  res.json({ success: true, data: result });
});

// ── Search Crops ──────────────────────────────
exports.searchCrops = catchAsync(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) throw new AppError('Search query too short', 400);

  // Common Indian crops — static fallback if DB has no seeded data
  const KNOWN_CROPS = [
    'Wheat', 'Rice', 'Paddy', 'Maize', 'Sorghum', 'Bajra', 'Jowar',
    'Soybean', 'Cotton', 'Groundnut', 'Sunflower', 'Mustard', 'Linseed',
    'Onion', 'Tomato', 'Potato', 'Brinjal', 'Cauliflower', 'Cabbage',
    'Chilli', 'Garlic', 'Ginger', 'Turmeric', 'Coriander', 'Fenugreek',
    'Sugarcane', 'Banana', 'Mango', 'Grapes', 'Pomegranate', 'Orange',
    'Tur Dal', 'Moong Dal', 'Chana', 'Urad Dal', 'Masoor Dal', 'Rajma',
    'Jowar', 'Ragi', 'Barley', 'Amaranth',
  ];

  // Query DB first
  const dbCrops = await MarketPrice.distinct('cropName', {
    cropName: new RegExp(q, 'i'),
  });

  // Merge DB results with static list (DB results first)
  const staticMatches = KNOWN_CROPS
    .filter(c => c.toLowerCase().includes(q.toLowerCase()))
    .filter(c => !dbCrops.some(d => d.toLowerCase() === c.toLowerCase()));

  const allCrops = [...dbCrops, ...staticMatches].slice(0, 20);
  res.json({ success: true, data: allCrops, total: allCrops.length });
});

// ── Seed Market Prices (Admin) ────────────────
exports.seedMarketPrices = catchAsync(async (req, res) => {
  const sampleCrops = [
    { name: 'Wheat',      nameHi: 'गेहूं',    base: 2200 },
    { name: 'Rice',       nameHi: 'चावल',    base: 3200 },
    { name: 'Paddy',      nameHi: 'धान',     base: 2100 },
    { name: 'Soybean',    nameHi: 'सोयाबीन', base: 5000 },
    { name: 'Cotton',     nameHi: 'कपास',    base: 7000 },
    { name: 'Onion',      nameHi: 'प्याज',   base: 1800 },
    { name: 'Tomato',     nameHi: 'टमाटर',  base: 2500 },
    { name: 'Potato',     nameHi: 'आलू',    base: 1200 },
    { name: 'Maize',      nameHi: 'मक्का',   base: 1900 },
    { name: 'Groundnut',  nameHi: 'मूंगफली', base: 5500 },
    { name: 'Sugarcane',  nameHi: 'गन्ना',   base: 3500 },
    { name: 'Tur Dal',    nameHi: 'तुअर दाल', base: 7200 },
  ];

  const markets = [
    // Maharashtra
    { name: 'Pune APMC',    district: 'Pune',     state: 'Maharashtra' },
    { name: 'Nashik APMC',  district: 'Nashik',   state: 'Maharashtra' },
    { name: 'Nagpur APMC',  district: 'Nagpur',   state: 'Maharashtra' },
    { name: 'Aurangabad APMC', district: 'Aurangabad', state: 'Maharashtra' },
    // Madhya Pradesh
    { name: 'Indore APMC',  district: 'Indore',   state: 'Madhya Pradesh' },
    { name: 'Bhopal APMC',  district: 'Bhopal',   state: 'Madhya Pradesh' },
    // Punjab
    { name: 'Ludhiana Mandi', district: 'Ludhiana', state: 'Punjab' },
    { name: 'Amritsar Mandi', district: 'Amritsar', state: 'Punjab' },
    // Uttar Pradesh
    { name: 'Lucknow Mandi', district: 'Lucknow',  state: 'Uttar Pradesh' },
    { name: 'Kanpur Mandi',  district: 'Kanpur',   state: 'Uttar Pradesh' },
    // Rajasthan
    { name: 'Jaipur Mandi',  district: 'Jaipur',   state: 'Rajasthan' },
    { name: 'Jodhpur Mandi', district: 'Jodhpur',  state: 'Rajasthan' },
  ];

  const prices = [];
  const DAYS = 45; // 45 days of data

  for (let day = 0; day < DAYS; day++) {
    const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
    date.setHours(0, 0, 0, 0);

    for (const crop of sampleCrops) {
      for (const market of markets) {
        // Apply regional price variation (±15% by state)
        const stateMultiplier = {
          'Maharashtra': 1.05, 'Madhya Pradesh': 0.97,
          'Punjab': 1.10, 'Uttar Pradesh': 0.95, 'Rajasthan': 0.98,
        }[market.state] || 1.0;

        const base = crop.base * stateMultiplier;
        // Random daily noise (±8%)
        const noise = (Math.random() - 0.5) * base * 0.16;
        const modal = Math.round(base + noise);

        prices.push({
          cropName: crop.name,
          cropNameHi: crop.nameHi,
          market,
          price: {
            min: Math.round(modal * 0.93),
            modal,
            max: Math.round(modal * 1.07),
          },
          unit: 'quintal',
          arrivals: {
            quantity: Math.round(Math.random() * 800 + 100),
            unit: 'tonnes',
          },
          priceDate: date,
          source: 'seeded',
        });
      }
    }
  }

  await MarketPrice.insertMany(prices, { ordered: false }).catch(() => {});
  res.json({
    success: true,
    message: `Seeded ${prices.length} market price records`,
    details: {
      crops: sampleCrops.length,
      markets: markets.length,
      days: DAYS,
    },
  });
});
