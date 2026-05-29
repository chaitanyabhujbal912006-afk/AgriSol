/**
 * Weather Intelligence Controller
 */

const axios = require('axios');
const { WeatherLog } = require('../../models/index');
const { cache } = require('../../config/redis');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../utils/logger');

const WEATHER_BASE = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

// ── Fetch from OpenWeatherMap ─────────────────
const fetchWeatherFromAPI = async (lat, lon) => {
  const [current, forecast] = await Promise.all([
    axios.get(`${WEATHER_BASE}/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric' },
      timeout: 10000,
    }),
    axios.get(`${WEATHER_BASE}/forecast`, {
      params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 40 },
      timeout: 10000,
    }),
  ]);

  return { current: current.data, forecast: forecast.data };
};

// ── Parse weather data ────────────────────────
const parseWeatherData = (current, forecastData) => {
  const currentWeather = {
    temperature: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    humidity: current.main.humidity,
    pressure: current.main.pressure,
    windSpeed: current.wind?.speed || 0,
    windDirection: current.wind?.deg || 0,
    visibility: (current.visibility || 10000) / 1000, // km
    condition: current.weather[0]?.description,
    conditionCode: current.weather[0]?.id,
    icon: `https://openweathermap.org/img/wn/${current.weather[0]?.icon}@2x.png`,
    rainfall: current.rain?.['1h'] || 0,
    uvIndex: current.uvi || 0,
  };

  // Group forecast by day
  const dailyMap = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date: new Date(item.dt * 1000),
        temps: [],
        humidity: [],
        rainfall: 0,
        conditions: [],
        icons: [],
        windSpeeds: [],
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].humidity.push(item.main.humidity);
    dailyMap[date].rainfall += item.rain?.['3h'] || 0;
    dailyMap[date].conditions.push(item.weather[0]?.description);
    dailyMap[date].icons.push(item.weather[0]?.icon);
    dailyMap[date].windSpeeds.push(item.wind?.speed || 0);
  });

  const forecast = Object.values(dailyMap).slice(0, 7).map(day => ({
    date: day.date,
    tempMin: Math.round(Math.min(...day.temps)),
    tempMax: Math.round(Math.max(...day.temps)),
    humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
    rainfall: Math.round(day.rainfall * 10) / 10,
    condition: day.conditions[Math.floor(day.conditions.length / 2)],
    icon: `https://openweathermap.org/img/wn/${day.icons[Math.floor(day.icons.length / 2)]}@2x.png`,
    windSpeed: Math.round(day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length),
    farmingSuggestion: getFarmingSuggestion(day),
  }));

  return { current: currentWeather, forecast };
};

// ── Farming Suggestions based on weather ─────
const getFarmingSuggestion = (dayData) => {
  const rainfall = dayData.rainfall;
  const tempMax = Math.max(...dayData.temps);
  const tempMin = Math.min(...dayData.temps);
  const humidity = dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length;

  if (rainfall > 20) return 'Heavy rain expected. Avoid spraying pesticides. Check for waterlogging.';
  if (rainfall > 5) return 'Light rain expected. Hold irrigation. Good time for transplanting.';
  if (tempMax > 40) return 'Extreme heat. Irrigate early morning or evening. Protect seedlings.';
  if (tempMin < 10) return 'Cold night. Cover sensitive crops. Delay sowing of heat-loving crops.';
  if (humidity > 80) return 'High humidity. Watch for fungal diseases. Ensure good air circulation.';
  if (humidity < 30) return 'Low humidity. Increase irrigation frequency. Mulch soil to retain moisture.';
  return 'Favorable conditions for farming activities.';
};

// ── Get Current Weather ───────────────────────
exports.getCurrentWeather = catchAsync(async (req, res) => {
  const { lat, lon, district } = req.query;

  // Use user's location if not provided
  const latitude = lat || req.user?.coordinates?.coordinates?.[1] || 20.5937;
  const longitude = lon || req.user?.coordinates?.coordinates?.[0] || 78.9629;

  const cacheKey = `weather:current:${parseFloat(latitude).toFixed(2)}:${parseFloat(longitude).toFixed(2)}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  let weatherData;
  try {
    const { current, forecast } = await fetchWeatherFromAPI(latitude, longitude);
    weatherData = parseWeatherData(current, forecast);

    // Check for alerts
    weatherData.alerts = getWeatherAlerts(weatherData);

    // Cache for 30 minutes
    await cache.set(cacheKey, weatherData, 30 * 60);

    // Save to DB (async, don't await)
    WeatherLog.create({
      location: { coordinates: { lat: latitude, lon: longitude } },
      current: weatherData.current,
      forecast: weatherData.forecast,
      alerts: weatherData.alerts,
    }).catch(err => logger.error('Weather log save error:', err));

  } catch (error) {
    logger.error('Weather API error:', error.message);
    // Return cached or mock data
    weatherData = getMockWeatherData();
  }

  res.json({ success: true, data: weatherData });
});

// ── Get Weather by Location ───────────────────
exports.getWeatherByLocation = catchAsync(async (req, res) => {
  const { city, state } = req.params;

  const cacheKey = `weather:location:${city}:${state}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  try {
    // Get coordinates from city name
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct`,
      {
        params: { q: `${city},${state},IN`, limit: 1, appid: API_KEY },
        timeout: 5000,
      }
    );

    if (!geoResponse.data.length) throw new AppError('Location not found', 404);

    const { lat, lon } = geoResponse.data[0];
    const { current, forecast } = await fetchWeatherFromAPI(lat, lon);
    const weatherData = parseWeatherData(current, forecast);
    weatherData.alerts = getWeatherAlerts(weatherData);

    await cache.set(cacheKey, weatherData, 30 * 60);
    res.json({ success: true, data: weatherData });

  } catch (error) {
    if (error.isOperational) throw error;
    throw new AppError('Weather data unavailable for this location', 503);
  }
});

// ── Get 7-day Forecast ────────────────────────
exports.getForecast = catchAsync(async (req, res) => {
  const { lat, lon } = req.query;

  const latitude = lat || 20.5937;
  const longitude = lon || 78.9629;

  const cacheKey = `weather:forecast:${parseFloat(latitude).toFixed(2)}:${parseFloat(longitude).toFixed(2)}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const { current, forecast } = await fetchWeatherFromAPI(latitude, longitude);
  const weatherData = parseWeatherData(current, forecast);

  await cache.set(cacheKey, weatherData.forecast, 60 * 60); // 1 hour
  res.json({ success: true, data: weatherData.forecast });
});

// ── Weather Alerts ────────────────────────────
const getWeatherAlerts = (weatherData) => {
  const alerts = [];
  const { current, forecast } = weatherData;

  if (current.rainfall > 10) {
    alerts.push({
      type: 'heavy_rain',
      severity: 'high',
      description: 'Heavy rainfall in current hour. Avoid field operations.',
    });
  }

  const nextDay = forecast[1];
  if (nextDay?.rainfall > 30) {
    alerts.push({
      type: 'heavy_rain_forecast',
      severity: 'medium',
      description: `Heavy rain forecasted tomorrow (${nextDay.rainfall}mm). Plan accordingly.`,
    });
  }

  if (current.temperature > 42) {
    alerts.push({
      type: 'heat_wave',
      severity: 'high',
      description: 'Extreme heat alert. Protect crops and livestock.',
    });
  }

  return alerts;
};

// ── Mock Weather Data ─────────────────────────
const getMockWeatherData = () => ({
  current: {
    temperature: 28,
    feelsLike: 31,
    humidity: 65,
    pressure: 1013,
    windSpeed: 12,
    condition: 'Partly cloudy',
    rainfall: 0,
    icon: 'https://openweathermap.org/img/wn/02d@2x.png',
  },
  forecast: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
    tempMin: 22 + Math.floor(Math.random() * 3),
    tempMax: 30 + Math.floor(Math.random() * 5),
    humidity: 60 + Math.floor(Math.random() * 20),
    rainfall: Math.random() > 0.7 ? Math.random() * 20 : 0,
    condition: 'Partly cloudy',
    farmingSuggestion: 'Favorable conditions for farming activities.',
  })),
  alerts: [],
  source: 'mock',
});

// ── Get Farming Calendar ──────────────────────
exports.getFarmingCalendar = catchAsync(async (req, res) => {
  const { lat, lon, crops } = req.query;
  const cropList = crops ? crops.split(',') : req.user?.cropsGrown || [];

  const cacheKey = `farming:calendar:${lat}:${lon}:${cropList.join(',')}`;
  const cached = await cache.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, cached: true });

  const { current, forecast } = await fetchWeatherFromAPI(lat || 20.59, lon || 78.96);
  const weather = parseWeatherData(current, forecast);

  const calendar = {
    week: forecast,
    recommendations: generateFarmingRecommendations(weather, cropList),
    bestDaysForSpraying: forecast.filter(d => d.windSpeed < 15 && d.rainfall < 2).slice(0, 3),
    bestDaysForIrrigation: forecast.filter(d => d.rainfall < 5 && d.humidity < 70).slice(0, 3),
  };

  await cache.set(cacheKey, calendar, 3 * 60 * 60);
  res.json({ success: true, data: calendar });
});

const generateFarmingRecommendations = (weather, crops) => {
  const recs = [];
  const { current } = weather;

  if (current.humidity > 75) {
    recs.push({ type: 'disease_alert', priority: 'high', message: 'High humidity. Monitor for fungal diseases on all crops.' });
  }
  if (current.temperature > 35) {
    recs.push({ type: 'irrigation', priority: 'high', message: 'Water stress conditions. Irrigate early morning.' });
  }
  recs.push({ type: 'general', priority: 'low', message: 'Good time to check soil moisture levels.' });

  return recs;
};
