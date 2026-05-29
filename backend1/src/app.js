/**
 * AgriSol Backend - Main Application Entry Point
 * Smart Agriculture Platform
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

const connectDB = require('./config/database');
const connectRedis = require('./config/redis');
const { initSocketIO } = require('./sockets');
const routes = require('./routes/v1');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

// Initialize Express
const app = express();
const server = http.createServer(app);

// ============================================
// i18n Initialization
// ============================================
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: { loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json') },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr'],
    preload: ['en', 'hi', 'mr'],
    ns: ['common', 'errors', 'notifications'],
    defaultNS: 'common',
    detection: {
      order: ['header', 'querystring'],
      lookupHeader: 'accept-language',
      lookupQuerystring: 'lang',
    },
  });

// ============================================
// Security Middleware
// ============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Auth route stricter limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
app.use('/api/v1/auth/', authLimiter);

// ============================================
// Body Parsing & Sanitization
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

// ============================================
// Logging & i18n
// ============================================
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(requestLogger);
app.use(i18nextMiddleware.handle(i18next));

// ============================================
// API Documentation
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AgriSol API Docs',
}));

// ============================================
// Health Check
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AgriSol Backend',
    version: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌱 AgriSol Backend API is fully active, running, and successfully connected to MongoDB Atlas!',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      api: '/api/v1'
    }
  });
});

// ============================================
// API Routes
// ============================================
app.use('/api/v1', routes);

// ============================================
// Error Handling
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// Socket.IO Initialization
// ============================================
initSocketIO(server);

// ============================================
// Start Server
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Redis is optional — app works without it (no caching)
    try {
      await connectRedis();
    } catch (redisErr) {
      logger.warn('⚠️  Redis unavailable — running without cache. Features still work.');
    }

    server.listen(PORT, () => {
      logger.info(`🌱 AgriSol Backend running on port ${PORT} [${process.env.NODE_ENV}]`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info(`❤️  Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

module.exports = { app, server };
