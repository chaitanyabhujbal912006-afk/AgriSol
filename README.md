# 🌾 AgriSol — Smart Agriculture Platform

AgriSol is an enterprise-grade digital agriculture ecosystem empowering farmers, agronomists, and agricultural researchers with AI-driven soil diagnostics, computer-vision leaf disease analysis, crop yield predictors, market price intelligence, government schemes discovery, growth calendar task schedulers, and real-time IoT telemetry.

---

## 🎨 Design System

AgriSol features a premium **iOS AgTech Glassmorphic Design System**:

- **Dynamic Island Telemetry Banner** — Real-time top bar with live soil moisture, air temperature, and AI model health status
- **iPhone Glass Pill Bottom Navigation Dock** — Frosted glass floating nav with glowing emerald indicators and spring animations
- **iPhone 16 Pro Max Preview Frame Mode** — View the full platform inside a glassmorphic iPhone container
- **Botanical Palette** — Deep Forest Emerald (`#059669`), Vibrant Leaf Green (`#22c55e`), Harvest Amber (`#f59e0b`), and Earthy Soil Tones with dark/light mode support

---

## 📁 Project Structure

```
AgriSol/
├── backend1/                   # 🔌 Primary Node.js + Express API Backend
│   ├── src/
│   │   ├── app.js              # Server entry point
│   │   ├── config/             # MongoDB, Redis, Swagger configuration
│   │   ├── controllers/        # Auth, Soil, Disease, Weather, Market, Community, Calendar
│   │   ├── jobs/               # Scheduled background jobs (node-cron)
│   │   ├── middleware/         # JWT auth, rate limiting, sanitization, error handlers
│   │   ├── models/             # Mongoose schemas (User, Farm, and aggregated index)
│   │   ├── routes/v1/          # All versioned Express routes (/api/v1/*)
│   │   ├── services/           # Cloudinary uploads, Nodemailer, Twilio SMS
│   │   ├── sockets/            # Real-time Socket.IO notification system
│   │   ├── utils/              # Shared utilities and helpers
│   │   └── validators/         # Joi / express-validator schemas
│   ├── ai-service/             # Python AI microservice integration
│   ├── locales/                # i18n translations (English, Hindi, Marathi)
│   ├── logs/                   # Winston rotating log files
│   ├── scripts/                # seed.js, migrate.js, generate-docs.js
│   ├── tests/                  # Jest + Supertest integration tests
│   ├── Dockerfile              # Docker container definition
│   ├── docker-compose.yml      # Multi-service Docker Compose
│   └── package.json
├── frontend/                   # 💻 React 18 + Vite 6 + Tailwind CSS 4 Web App
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layout/     # iPhone AgTech Layout, Dynamic Island, Glass Dock
│   │   │   │   ├── pages/      # 13 core pages (Dashboard, Soil, Disease, Calendar...)
│   │   │   │   └── ui/         # Radix UI + shadcn/ui component library
│   │   │   └── App.tsx         # Application state & router
│   │   ├── styles/             # Global CSS & design tokens
│   │   └── main.tsx            # Entry point
│   └── package.json
└── backend/                    # 🔌 TypeScript + Prisma SQLite microservice (secondary)
```

---

## 🛠️ Technology Stack

### 💻 Frontend

| Category | Technology |
|---|---|
| Framework | React 18 (TypeScript) |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 + custom glassmorphism tokens |
| UI Components | Radix UI + shadcn/ui + MUI |
| Icons | Lucide React |
| Charts | Recharts |
| Animations | Motion (Framer Motion) |
| Forms | React Hook Form |
| Routing | React Router 7 |
| Drag & Drop | React DnD |
| Notifications | Sonner |

### 🔌 Backend (`backend1`)

| Category | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose 8 |
| Caching | Redis + ioredis |
| Queues | Bull Queue |
| Auth | JWT + bcryptjs + OTP (SMS/Email fallback) |
| Real-time | Socket.IO |
| File Uploads | Multer + Cloudinary |
| Email | Nodemailer |
| SMS | Twilio |
| Push Notifications | Firebase Admin SDK |
| Logging | Winston + daily rotate |
| Validation | Joi + express-validator |
| Security | Helmet, express-rate-limit, express-mongo-sanitize, xss-clean, HPP |
| Scheduler | node-cron |
| API Docs | Swagger UI (`/api-docs`) |
| i18n | i18next (English, Hindi, Marathi) |
| Testing | Jest 29 + Supertest |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** (local or Atlas)
- **Redis** (local or Upstash)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/AgriSol.git
cd AgriSol
```

### 2. Primary Backend (`backend1`)

```bash
cd backend1

# Copy example env and fill in your credentials
cp .env.example .env

# Install dependencies
npm install

# Seed demo data (farmers, market prices, schemes, community posts)
npm run seed

# Run tests
npm test

# Start development server
npm run dev
```

> Server runs at **`http://localhost:5000`** · Swagger docs at **`http://localhost:5000/api-docs`**

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

> Frontend opens at **`http://localhost:5173`**

### 4. Docker (optional)

```bash
cd backend1
docker-compose up --build
```

---

## 🔌 API Route Map (`/api/v1`)

### 🔐 Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | System status, version, and uptime |
| `GET` | `/api-docs` | Public | Interactive Swagger documentation |
| `POST` | `/api/v1/auth/register` | Public | Register farmer account + send OTP |
| `POST` | `/api/v1/auth/login` | Public | Authenticate with mobile & password |
| `POST` | `/api/v1/auth/verify-otp` | Public | Validate OTP and issue JWT |
| `POST` | `/api/v1/auth/resend-otp` | Public | Resend verification code |

### 🧑‍🌾 Farmers

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/farmers` | Protected | List farmer profiles |
| `GET` | `/api/v1/farmers/:id` | Protected | Get farmer profile by ID |
| `PUT` | `/api/v1/farmers/:id` | Protected | Update farmer profile |

### 🌱 Crops

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/crops` | Public | Browse crop catalogue |
| `POST` | `/api/v1/crops/recommend` | Protected | AI crop recommendation engine |
| `GET` | `/api/v1/crops/:id` | Public | Get crop details |

### 🌍 Soil Diagnostics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/soil/analyze` | Protected | Upload soil photo for AI classification & NPK report |
| `GET` | `/api/v1/soil/history` | Protected | Retrieve past soil test records |

### 🍃 Disease Detection

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/disease/report` | Protected | Upload leaf image for computer-vision disease diagnosis |
| `GET` | `/api/v1/disease/outbreak-map` | Public | Regional disease outbreak statistics |

### 🌤️ Weather

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/weather` | Public | Current and forecast weather data |

### 📈 Market Prices

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/market/prices` | Public | Live APMC market price trends & crop rate predictions |

### 🏛️ Government Schemes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/schemes` | Public | Filterable central & state government farmer schemes |

### 💬 Community

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/community/posts` | Public | Farmer Q&A, expert advice, and pest alert forum |
| `POST` | `/api/v1/community/posts` | Protected | Create a community post |

### 📅 Growth Calendar

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/calendar/events` | Protected | Retrieve crop growth calendar schedule |
| `POST` | `/api/v1/calendar/events` | Protected | Schedule new crop / irrigation / fertilizer event |
| `PATCH` | `/api/v1/calendar/events/:id/toggle` | Protected | Toggle completion status of a calendar event |

### 🤖 AI Chat

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/chat/message` | Protected | AI agricultural adviser chatbot |

### 🔔 Notifications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | Protected | Get user notification feed |
| `PATCH` | `/api/v1/notifications/:id/read` | Protected | Mark notification as read |

### 📊 Analytics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/analytics/dashboard` | Protected | Aggregated farm analytics |

### 🛡️ Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/users` | Admin | Manage platform users |
| `GET` | `/api/v1/admin/reports` | Admin | Platform-wide reports |

---

## 🧪 Testing

```bash
cd backend1
npm test   # runs Jest with coverage
```

| Test File | Coverage |
|---|---|
| `tests/health.test.js` | Health check, welcome route, and API route mapping |
| `tests/soil.test.js` | Soil analysis submission, classification, and history |
| `tests/disease.test.js` | AI disease report upload and outbreak analytics |
| `tests/calendar.test.js` | Calendar event creation, listing, and task toggles |

---

## 🌐 Internationalisation (i18n)

| Locale | Language |
|---|---|
| `en` | English |
| `hi` | Hindi |
| `mr` | Marathi |

Translation JSON files live in `backend1/locales/`.

---

## 🔑 Environment Variables

Copy `backend1/.env.example` to `backend1/.env` and configure:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `REDIS_URL` | Redis connection URL |
| `CLOUDINARY_*` | Cloudinary API credentials for image uploads |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail SMTP credentials (optional) |
| `TWILIO_*` | Twilio credentials for SMS OTP |
| `FIREBASE_*` | Firebase Admin SDK for push notifications |

> **Dev tip:** Without SMTP or Twilio credentials, OTPs are automatically logged to the backend terminal (`🔑 [AGRISOL OTP CODE]`), so local development works out-of-the-box.

---

## ✅ Frontend Features

| Page | Highlights |
|---|---|
| Dashboard | Recharts telemetry (soil moisture, temperature, NPK radar), task toggles, region switcher |
| Soil Diagnostics | 1-click sample presets, animated CV radar scan, NPK & pH breakdown |
| Disease Detection | Bounding box overlay with confidence score, pathogen database, treatment protocols |
| Yield & Profit Estimator | Acreage calculator — total yield, gross revenue, input costs, net profit |
| Growth Calendar | Interactive event creation modal, completion filters |
| AI Adviser Chatbot | Voice mode audio wave visualiser, category prompt pills |
| Market Prices | APMC live price trends and crop rate predictions |
| Government Schemes | Filterable scheme discovery portal |
| Community Forum | Farmer Q&A, expert advice, pest alert threads |
| Reports | Farmland crop allocation pie chart + instant PDF export |
| Notifications | Alert centre for frost warnings, soil reports, and task reminders |
| Global Search | Command palette with instant autocomplete across crops, tools, and pages |

---

## 📌 Roadmap

- [ ] Deploy frontend to Vercel / Netlify
- [ ] Deploy backend to Render / Railway
- [ ] Live Gmail SMTP + Twilio SMS in production
- [ ] Expand AI disease model coverage
- [ ] Mobile app (React Native)

---

## 📄 License

MIT © AgriSol Contributors
