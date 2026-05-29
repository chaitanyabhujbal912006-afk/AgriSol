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

  const crops = await MarketPrice.distinct('cropName', {
    cropName: new RegExp(q, 'i'),
  });

  res.json({ success: true, data: crops.slice(0, 20) });
});

// ── Seed Market Prices (Admin) ────────────────
exports.seedMarketPrices = catchAsync(async (req, res) => {
  // For demo: seed some sample prices
  const sampleCrops = [
    { name: 'Wheat', nameHi: 'गेहूं' },
    { name: 'Rice', nameHi: 'चावल' },
    { name: 'Soybean', nameHi: 'सोयाबीन' },
    { name: 'Cotton', nameHi: 'कपास' },
    { name: 'Onion', nameHi: 'प्याज' },
    { name: 'Tomato', nameHi: 'टमाटर' },
    { name: 'Potato', nameHi: 'आलू' },
  ];

  const markets = [
    { name: 'Pune APMC', district: 'Pune', state: 'Maharashtra' },
    { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra' },
    { name: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra' },
  ];

  const prices = [];
  for (let day = 0; day < 30; day++) {
    const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
    for (const crop of sampleCrops) {
      for (const market of markets) {
        const basePrice = { Wheat: 2200, Rice: 3200, Soybean: 5000, Cotton: 7000, Onion: 1800, Tomato: 2500, Potato: 1200 }[crop.name];
        const noise = (Math.random() - 0.5) * basePrice * 0.1;
        prices.push({
          cropName: crop.name,
          cropNameHi: crop.nameHi,
          market,
          price: {
            min: Math.round(basePrice + noise - 100),
            modal: Math.round(basePrice + noise),
            max: Math.round(basePrice + noise + 150),
          },
          arrivals: { quantity: Math.round(Math.random() * 500 + 50) },
          priceDate: date,
        });
      }
    }
  }

  await MarketPrice.insertMany(prices, { ordered: false }).catch(() => {});
  res.json({ success: true, message: `Seeded ${prices.length} market price records` });
});
