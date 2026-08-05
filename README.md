# 🌾 AgriSol — Enterprise AI AgTech Ecosystem

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/chaitanyabhujbal912006-afk/AgriSol)
[![React 18](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

AgriSol is an end-to-end, enterprise-grade digital agriculture platform designed to empower farmers, agronomists, and agricultural enterprises. Driven by AI-powered soil chemistry diagnostics, computer-vision leaf disease detection, real-time APMC Mandi market intelligence, dynamic growth schedulers, and government subsidy discovery, AgriSol bridges precision science with actionable farm operations.

---

## ⚡ Quick Demo & Instant Trial Mode

Experience AgriSol live without manual signup. On the authentication page, use the **Instant 1-Click Trial Access** presets:

- 👨‍🌾 **Demo Farmer Profile**: *Ramesh Sharma* — 5.5 Acre Durum Wheat & Nashik Red Onion farmer in Nashik, MH with automated drip irrigation telemetry.
- 👨‍🔬 **ICAR Agronomist Profile**: *Dr. Suresh Patil* — Ph.D. in Plant Pathology (IARI Delhi), Senior ICAR Scientist & Abiotic Stress Management Expert.

---

## 🌟 Key Platform Modules

### 🧪 AI Soil & NPK Chemistry Diagnostics
- **Computer-Vision Radar Scan**: Upload field photos or use sample presets (Alluvial, Red Clay, Black Loam).
- **ICAR-Standard NPK Breakdown**: Quantifies Nitrogen (N), Phosphorus (P), Potassium (K), Organic Carbon %, and pH balance.
- **Agronomic Remediation**: Generates tailored fertilizer application recommendations to optimize yield while preventing soil acidification.

### 🍃 AI Leaf Disease Identification
- **Pathogen Detection**: Identifies fungal, bacterial, and viral infections (*Phytophthora infestans*, *Bipolaris oryzae*, *Xanthomonas*) with bounding-box visual confidence overlays.
- **Treatment Protocols**: Provides chemical dosages (*Mancozeb 75% WP @ 2g/L*, *Azoxystrobin 23% SC*) alongside organic biological controls (*Neem oil 10,000 PPM*, *Trichoderma viride*).

### 📈 APMC Mandi Intelligence & MSP Tracker
- **1,000+ APMC Mandi Rates**: Daily minimum, modal, and maximum commodity prices across major markets (Pune, Nashik, Indore, Nagpur, Ludhiana, Jaipur, Kanpur, Latur).
- **AI 3-Day Forecast**: Predictive price trend charts powered by historical arrival volumes.
- **Government MSP Benchmarks**: Official 2024–25 Minimum Support Prices for guaranteed floor rate comparison.

### 💰 Crop Yield & Net Profit Estimator
- Interactive financial calculator forecasting total harvest tonnage, gross market value, input fertilizer costs, and net farm profit based on acreage and regional soil health.

### 📅 Growth Calendar & Telemetry Scheduler
- Interactive farm task manager tracking sowing, drip irrigation cycles, fertilizer top-dressing, and harvest timelines with automated completion metrics.

### 🏛️ Government Schemes & Subsidies Portal
- Filterable repository for central and state agriculture programs (PM-KISAN, PMFBY Crop Insurance, Kisan Credit Card, PMKSY 55% Drip Irrigation Subsidy) with direct application links.

### 👥 Agronomist Community & AI Advisory Chatbot
- Q&A forum with verified Agronomist answer highlights, regional crop tagging, and an AI chat assistant with voice wave visualizers.

---

## 🎨 Design System

AgriSol is crafted with a state-of-the-art **iOS AgTech Glassmorphic Design System**:

- **Dynamic Island Telemetry Banner**: Floating top status bar displaying real-time soil moisture, ambient temperature, and AI diagnostic model connectivity.
- **Frosted Glass Navigation Dock**: Responsive bottom navigation dock with glowing emerald indicators and smooth micro-interactions.
- **iPhone 16 Pro Max Preview Mode**: Option to inspect the entire application within an interactive 3D-styled glass mobile container.
- **Curated Botanical Palette**: Deep Forest Emerald (`#059669`), Vibrant Leaf Green (`#22c55e`), Harvest Amber (`#f59e0b`), and Earthy Soil Tones with full dark/light theme support.

---

## 📁 Repository Structure

```
AgriSol/
├── backend/                    # 🔌 Node.js + Express API Backend (TypeScript / ES6)
│   ├── src/
│   │   ├── app.js              # Server entry point & middleware stack
│   │   ├── config/             # Database, Redis, and Swagger configs
│   │   ├── controllers/        # Auth, Soil, Disease, Weather, Market, Community, Calendar
│   │   ├── middleware/         # JWT verification, rate limiting, xss security, errors
│   │   ├── models/             # Mongoose schemas (User, Farm, MarketPrice, Scheme, Post)
│   │   ├── routes/v1/          # Versioned REST endpoints (/api/v1/*)
│   │   ├── services/           # Nodemailer, Twilio, Cloudinary & AI integrations
│   │   ├── sockets/            # Socket.IO real-time alert broadcasts
│   │   └── utils/              # AppError class, logger, async handler wrappers
│   ├── scripts/                # Database seed & migration tools
│   ├── tests/                  # Jest & Supertest API integration suites
│   └── Dockerfile              # Backend container build specification
├── frontend/                   # 💻 React 18 + Vite 6 + Tailwind CSS 4 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layout/     # Dynamic Island, Glass Dock, Navigation headers
│   │   │   │   ├── pages/      # 16 Core UI modules (Dashboard, Soil, Disease, Mandi...)
│   │   │   │   └── ui/         # Radix UI & shadcn design components
│   │   │   └── App.tsx         # Main router & state management
│   │   ├── styles/             # Tailwind 4 CSS variables & design tokens
│   │   └── main.tsx            # React application entry point
│   ├── vercel.json             # Vercel SPA routing rules
│   ├── Dockerfile              # Multi-stage Nginx production container build
│   └── package.json
└── TODO.md                     # Roadmap and completed release milestones
```

---

## 🛠️ Technology Stack

### 💻 Frontend
| Layer | Tech |
|---|---|
| Framework | **React 18.3** (TypeScript) |
| Build Tool | **Vite 6.3** |
| Styling | **Tailwind CSS 4.1** + Custom Glassmorphism System |
| UI Components | **Radix UI** primitives + **shadcn/ui** |
| Data Visualisation | **Recharts 2.15** (Line, Area, Radar, Pie Charts) |
| Icons | **Lucide React** |
| Motion | **Framer Motion / Motion 12** |

### 🔌 Backend
| Layer | Tech |
|---|---|
| Runtime | **Node.js 20+** |
| Web Framework | **Express.js 4** |
| Database | **MongoDB / Mongoose 8** |
| Caching | **Redis / ioredis** |
| Authentication | **JWT** + **bcryptjs** + **OTP engine** |
| API Docs | **Swagger UI** (`/api-docs`) |
| Real-time Alerts | **Socket.IO** |
| Logging | **Winston** daily rotating logs |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher (`node -v`)
- **npm**: v9.0 or higher

### 1. Clone & Install

```bash
git clone https://github.com/chaitanyabhujbal912006-afk/AgriSol.git
cd AgriSol
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed      # Seeds demo farmers, market prices, and ICAR experts
npm run dev       # Starts server at http://localhost:5000
```
> **Console OTP Mode**: In local development, SMS/Email OTP codes automatically print directly to the backend terminal (`🔑 [AGRISOL OTP CODE]`).

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev       # Starts Vite dev server at http://localhost:5173
```

---

## 🌐 Production Deployment

### Deploying Frontend on Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build` | Output Directory: `dist`.
4. The included `frontend/vercel.json` automatically handles SPA routes.

### Deploying Frontend via Docker
```bash
cd frontend
docker build -t agrisol-frontend .
docker run -p 80:80 agrisol-frontend
```

### Deploying Backend on Render / Railway
1. Create a Web Service on Render or Railway pointing to the `backend` directory.
2. Set Environment Variables as listed in `backend/.env.example`.
3. Start Command: `npm start`.

---

## 🔌 API Reference (`/api/v1`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | System status & uptime | Public |
| `POST` | `/api/v1/auth/signup` | Register farmer user & generate OTP | Public |
| `POST` | `/api/v1/auth/signin` | Authenticate credentials & return JWT | Public |
| `POST` | `/api/v1/auth/verify-otp` | Verify 6-digit code | Public |
| `POST` | `/api/v1/soil/analyze` | AI soil photo analysis & NPK report | Protected |
| `POST` | `/api/v1/crops/recommend` | Soil & climate crop recommendation engine | Protected |
| `POST` | `/api/v1/diseases/diagnose` | Computer-vision leaf pathogen detection | Protected |
| `GET` | `/api/v1/market/prices` | APMC market prices & trend forecasts | Public |
| `GET` | `/api/v1/schemes` | Central & state government subsidies | Public |
| `GET` | `/api/v1/calendar/events` | Retrieve growth schedule tasks | Protected |
| `POST` | `/api/v1/chatbot/message` | AI Agronomist advice assistant | Protected |

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for details.

---

<p align="center">
  <b>AgriSol</b> — Elevating Precision Agriculture for Every Farmer. 🌾
</p>
