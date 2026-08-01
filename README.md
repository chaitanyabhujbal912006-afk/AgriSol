# 🌾 AgriSol: Smart Agriculture Platform

AgriSol is an enterprise-grade digital agriculture ecosystem empowering farmers, agronomists, and agricultural researchers with AI-driven soil diagnostics, computer-vision leaf disease analysis, crop yield predictors, market price intelligence, government schemes, growth calendar task schedulers, and real-time IoT telemetry.

---

## 🎨 UI Aesthetics & iPhone AgTech Design System

AgriSol features a state-of-the-art **iOS AgTech Glassmorphic Design System**:
- **Dynamic Island Telemetry Banner**: Real-time top bar displaying live soil moisture (68%), air temperature (28°C), and AI diagnostic model health.
- **iPhone Glass Pill Bottom Navigation Dock**: Floating frosted glass bottom navigation bar with glowing emerald indicators, spring active tabs, and responsive layout.
- **iPhone 16 Pro Max Preview Frame Mode**: Header button allowing users to view the entire platform inside a glassmorphic iPhone container complete with camera cutout, volume buttons, side key accents, and home indicator.
- **Botanical Palette**: Deep Forest Emerald (`#059669`), Vibrant Leaf Green (`#22c55e`), Sun-drenched Harvest Amber (`#f59e0b`), and Earthy Soil Tones with dark/light mode support.

---

## 📁 Project Workspace Structure

```
AgriSol/
├── backend1/                  # 🔌 Production Node.js + Express API Backend (Primary)
│   ├── src/
│   │   ├── config/            # Database (MongoDB), Redis, and Swagger configurations
│   │   ├── controllers/       # Auth, Soil, Disease, Weather, Market, Community, Calendar
│   │   ├── middleware/        # JWT Protect, Rate Limiting, Mongo Sanitize, Error Handlers
│   │   ├── models/            # Mongoose Schemas (User, Farm, DiseaseReport, MarketPrice, etc.)
│   │   ├── routes/v1/         # Versioned Express routes (/api/v1/*)
│   │   ├── services/          # Cloudinary uploads, Nodemailer, Twilio SMS
│   │   ├── sockets/           # Real-time Socket.IO notification system
│   │   └── app.js             # Main server entry point
│   ├── tests/                 # 🧪 Automated Jest Integration Test Suite
│   ├── scripts/               # 🌾 Seeders (`seed.js`) & Migration scripts
│   ├── locales/               # Multilingual i18n translations (English, Hindi, Marathi)
│   └── package.json           # Server dependencies & scripts
├── frontend/                  # 💻 React 18 + Vite 6 + Tailwind CSS 4 Web App
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layout/    # iPhone AgTech Layout with Dynamic Island & Glass Dock
│   │   │   │   ├── pages/     # 13 Core Pages (Dashboard, Soil, Disease, Calendar, etc.)
│   │   │   │   └── ui/        # Custom Radix UI & Shadcn components
│   │   │   └── App.tsx        # Application state & router
│   │   └── main.tsx           # Entry point
│   └── package.json
└── backend/                   # 🔌 TypeScript + Prisma SQLite Microservice Backend
```

---

## 🛠️ Full Technology Stack

### 💻 Client (Frontend)
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + Custom Glassmorphism design tokens
- **UI Components**: Radix UI + Lucide Icons + Recharts Telemetry Charts + Framer Motion animations

### 🔌 Server (Backend `backend1`)
- **Runtime**: Node.js 18+ & Express.js
- **Database**: MongoDB (Mongoose 8) with indexed geospatial & telemetry models
- **Testing**: Jest 29 + Supertest integration test suite
- **Authentication**: JWT + bcryptjs + OTP SMS/Email fallback
- **Real-time Engine**: Socket.IO
- **API Documentation**: Swagger UI (`/api-docs`)
- **Security**: Helmet, Rate Limiting, Mongo Sanitize, HPP CORS headers
- **Caching & Queues**: Redis & Bull Queue

---

## 🚀 Quick Start Guide

### 1. Running the Primary Backend (`backend1`)

```bash
cd backend1

# Install dependencies
npm install

# Run database seeder (seeds demo farmers, market prices, schemes, community posts)
npm run seed

# Run automated test suite (Jest)
npm test

# Start backend server
npm run dev
```

*The backend server runs on **`http://localhost:5000`** with interactive API docs at **`http://localhost:5000/api-docs`**.*

### 2. Running the Frontend (`frontend`)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

*The frontend opens at **`http://localhost:5173`**.*

---

## 🧪 Automated Testing Suite

The primary backend comes with a complete **Jest + Supertest integration test suite**:

```bash
cd backend1
npm test
```

### Test Coverage Highlights:
- `tests/health.test.js` — Health check `/health`, welcome route `/`, and API `/api/v1` route mapping verification.
- `tests/soil.test.js` — Soil analysis submission, classification, and history logs.
- `tests/disease.test.js` — AI disease report upload and outbreak analytics fallback.
- `tests/calendar.test.js` — Growth calendar event creation, listing, and task toggles.

---

## 🔌 API Route Map (`/api/v1`)

| Namespace | Method | Access | Description |
|---|---|---|---|
| `/health` | `GET` | Public | System status, version, and server health check |
| `/api-docs` | `GET` | Public | Interactive Swagger API documentation |
| `/api/v1/auth/register` | `POST` | Public | Register new farmer account and send OTP |
| `/api/v1/auth/login` | `POST` | Public | Authenticate user with mobile and password |
| `/api/v1/auth/verify-otp` | `POST` | Public | Validate OTP and issue JWT access token |
| `/api/v1/soil/analyze` | `POST` | Protected | Upload soil photo for AI classification & NPK balance report |
| `/api/v1/soil/history` | `GET` | Protected | Retrieve past soil test records |
| `/api/v1/disease/report` | `POST` | Protected | Upload leaf image for computer vision disease diagnosis |
| `/api/v1/disease/outbreak-map` | `GET` | Public | Regional disease outbreak statistics map |
| `/api/v1/calendar/events` | `GET` | Protected | Retrieve user's crop growth calendar schedule |
| `/api/v1/calendar/events` | `POST` | Protected | Schedule new crop task / irrigation / fertilizer event |
| `/api/v1/calendar/events/:id/toggle` | `PATCH` | Protected | Toggle completion status of calendar event |
| `/api/v1/market/prices` | `GET` | Public | Live APMC market price trends and crop rate predictions |
| `/api/v1/schemes` | `GET` | Public | Filterable list of central and state government farmer schemes |
| `/api/v1/community/posts` | `GET` | Public | Farmer community Q&A, expert advice, and pest alert forum |