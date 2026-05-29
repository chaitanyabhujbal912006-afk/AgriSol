# 🌱 AgriSol Backend

**Smart Agriculture Platform Backend** — Production-ready REST API powering the AgriSol app for Indian farmers.

---

## 🏗️ Architecture Overview

```
agrisol-backend/
├── src/
│   ├── app.js                    # Express app entry point
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   ├── redis.js              # Redis + cache helpers
│   │   └── swagger.js            # OpenAPI config
│   ├── controllers/
│   │   ├── auth/                 # Registration, Login, OTP, JWT
│   │   ├── farmer/               # Profile, Dashboard
│   │   ├── crop/                 # Farm & Crop season CRUD
│   │   ├── disease/              # AI Disease Detection
│   │   ├── weather/              # Weather intelligence
│   │   ├── market/               # Market prices & trends
│   │   ├── community/            # Posts, Comments, Expert Q&A
│   │   ├── notifications/        # Notification management
│   │   └── admin/                # User management, moderation
│   ├── models/
│   │   ├── User.js               # Farmer/Expert/Admin schema
│   │   ├── Farm.js               # Farm + CropSeason schemas
│   │   └── index.js              # DiseaseReport, Market, Notification, etc.
│   ├── middleware/
│   │   ├── auth.js               # JWT protect, RBAC
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── validate.js           # Joi validation middleware
│   │   └── requestLogger.js      # Request logging
│   ├── routes/v1/                # All API route definitions
│   ├── services/
│   │   ├── authService.js        # JWT & OTP generation
│   │   ├── uploadService.js      # Cloudinary + Multer
│   │   ├── notifications/        # Push, SMS, Email
│   │   └── sms/                  # Twilio SMS
│   ├── jobs/
│   │   ├── diseaseDetectionQueue.js  # Bull queue for AI processing
│   │   └── cronJobs.js           # Scheduled tasks
│   ├── sockets/
│   │   └── index.js              # Socket.IO real-time events
│   ├── validators/               # Joi schemas
│   └── utils/
│       ├── AppError.js           # Custom error class
│       ├── catchAsync.js         # Async error wrapper
│       └── logger.js             # Winston logger
├── ai-service/
│   └── main.py                   # FastAPI AI placeholder service
├── scripts/
│   └── seed.js                   # Database seeder
├── locales/                      # i18n translations (en/hi/mr)
├── docker-compose.yml            # Full stack dev environment
├── Dockerfile                    # Production Docker image
└── .github/workflows/ci-cd.yml   # CI/CD pipeline
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB 7+
- Redis 7+
- Docker & Docker Compose (optional)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/agrisol-backend.git
cd agrisol-backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Start with Docker (Recommended)
```bash
# Start all services (API + MongoDB + Redis)
docker compose up -d

# With admin tools (Mongo Express, Redis Commander)
docker compose --profile tools up -d

# With AI service
docker compose --profile tools --profile ai up -d
```

### 4. Start without Docker
```bash
# Seed database
node scripts/seed.js

# Start development server
npm run dev
```

---

## 🔐 API Authentication Flow

```
1. POST /api/v1/auth/register  → Send OTP to mobile
2. POST /api/v1/auth/verify-otp → Get Access + Refresh tokens
3. Use Bearer {accessToken} in Authorization header
4. POST /api/v1/auth/refresh when access token expires (15min)
5. POST /api/v1/auth/logout to invalidate tokens
```

---

## 📡 API Endpoints

| Module | Method | Endpoint | Auth |
|--------|--------|----------|------|
| **Auth** | POST | `/api/v1/auth/register` | No |
| | POST | `/api/v1/auth/login` | No |
| | POST | `/api/v1/auth/verify-otp` | No |
| | POST | `/api/v1/auth/refresh` | No |
| | POST | `/api/v1/auth/logout` | ✅ |
| | GET | `/api/v1/auth/me` | ✅ |
| **Farmer** | GET | `/api/v1/farmers/profile` | ✅ |
| | PUT | `/api/v1/farmers/profile` | ✅ |
| | GET | `/api/v1/farmers/dashboard` | ✅ |
| **Crops** | GET | `/api/v1/crops/farms` | ✅ |
| | POST | `/api/v1/crops/farms` | ✅ |
| | GET | `/api/v1/crops/seasons` | ✅ |
| | POST | `/api/v1/crops/seasons` | ✅ |
| | POST | `/api/v1/crops/seasons/:id/expenses` | ✅ |
| **Disease** | POST | `/api/v1/disease/report` | ✅ |
| | GET | `/api/v1/disease/report/:id` | ✅ |
| | GET | `/api/v1/disease/my-reports` | ✅ |
| | GET | `/api/v1/disease/outbreak-map` | No |
| **Weather** | GET | `/api/v1/weather/current` | No |
| | GET | `/api/v1/weather/forecast` | No |
| | GET | `/api/v1/weather/farming-calendar` | ✅ |
| **Market** | GET | `/api/v1/market/prices` | No |
| | GET | `/api/v1/market/trends/:crop/:state` | No |
| | GET | `/api/v1/market/predict/:crop/:state` | No |
| **Schemes** | GET | `/api/v1/schemes` | No |
| | GET | `/api/v1/schemes/personalized` | ✅ |
| | POST | `/api/v1/schemes` | ✅ Admin |
| **Community** | GET | `/api/v1/community` | No |
| | POST | `/api/v1/community` | ✅ |
| | POST | `/api/v1/community/:id/like` | ✅ |
| | POST | `/api/v1/community/:id/comment` | ✅ |
| **Chat** | GET | `/api/v1/chat/conversation/:userId` | ✅ |
| | GET | `/api/v1/chat/conversations` | ✅ |
| **Notifications** | GET | `/api/v1/notifications` | ✅ |
| | PUT | `/api/v1/notifications/read-all` | ✅ |
| **Analytics** | GET | `/api/v1/analytics/financial` | ✅ |
| | GET | `/api/v1/analytics/disease-history` | ✅ |
| **Admin** | GET | `/api/v1/admin/dashboard` | ✅ Admin |
| | GET | `/api/v1/admin/users` | ✅ Admin |
| | PUT | `/api/v1/admin/users/:id/ban` | ✅ Admin |
| | GET | `/api/v1/admin/reported-posts` | ✅ Admin |

📚 Full docs at: `http://localhost:5000/api-docs`

---

## 🔌 WebSocket Events

### Client → Server
```js
socket.emit('chat:join', conversationId)
socket.emit('chat:message', { receiverId, content, conversationId })
socket.emit('chat:typing', { conversationId, isTyping })
socket.emit('chat:read', { conversationId })
socket.emit('disease:subscribe', reportId)
socket.emit('market:subscribe', { crops: ['Wheat'], state: 'Maharashtra' })
```

### Server → Client
```js
socket.on('chat:message', (message) => {})
socket.on('chat:typing', ({ userId, isTyping }) => {})
socket.on('notification:new', (notification) => {})
socket.on('disease:result', ({ status, detections }) => {})
socket.on('market:update', (priceData) => {})
socket.on('user:online', ({ userId }) => {})
```

---

## 🤖 AI Service Integration

The disease detection uses an async queue pattern:

```
1. Farmer uploads image → POST /api/v1/disease/report
2. Images stored in Cloudinary
3. Job added to Bull queue
4. WebSocket emits progress: { status: 'processing' }
5. Worker calls AI service (FastAPI)
6. Results saved to MongoDB
7. WebSocket emits result: { status: 'completed', detections: [...] }
8. Push notification sent to farmer
```

**To connect real ML model:** Update `ai-service/main.py` to load your TensorFlow/PyTorch model.

---

## 📦 Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 20 + Express.js |
| Database | MongoDB 7 + Mongoose |
| Cache | Redis 7 |
| Auth | JWT + OTP (Twilio) |
| Real-time | Socket.IO |
| Queue | Bull (Redis-backed) |
| Storage | Cloudinary |
| Push | Firebase Admin SDK |
| AI Service | FastAPI (Python) |
| Scheduler | node-cron |
| i18n | i18next (en/hi/mr) |
| Logging | Winston + Daily Rotate |
| Docs | Swagger / OpenAPI 3 |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## 🧪 Test Credentials (after seeding)

| Role | Mobile | Password |
|------|--------|----------|
| Admin | 9000000001 | Admin@123 |
| Expert | 9000000002 | Expert@123 |
| Farmer | 9876543210 | Farmer@123 |

---

## 🌐 Environment Variables

See `.env.example` for all required variables.

Key variables:
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Min 32 chars, keep secret!
- `OPENWEATHER_API_KEY` — From openweathermap.org
- `CLOUDINARY_*` — From cloudinary.com dashboard
- `TWILIO_*` — From twilio.com console
- `FIREBASE_*` — From Firebase console (for push notifications)
- `AI_SERVICE_URL` — URL of the AI disease detection service

---

## 🏭 Production Deployment

```bash
# Build production image
docker build --target production -t agrisol-backend:latest .

# Deploy with docker compose
NODE_ENV=production docker compose up -d

# Or use the CI/CD pipeline (GitHub Actions)
# Push to main branch triggers automatic deployment
```

---

## 🔮 Future Enhancements (Roadmap)

- [ ] Satellite imagery integration (Sentinel Hub API)
- [ ] IoT sensor data ingestion (MQTT broker)
- [ ] Voice assistant API (multilingual NLP)
- [ ] Offline sync with CRDTs for rural areas
- [ ] Carbon footprint calculator
- [ ] AI yield prediction (satellite + weather ML model)
- [ ] Blockchain-based supply chain tracking
- [ ] UPI payment integration for market transactions

---

Built with ❤️ for Indian farmers 🇮🇳
