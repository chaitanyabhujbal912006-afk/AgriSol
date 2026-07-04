# 🌾 AgriSol: AI-Powered Agricultural Platform

AgriSol is a comprehensive digital agriculture ecosystem designed to support farmers and agronomists with AI-driven insights, soil analysis, crop recommendations, disease diagnosis, and smart growth calendars. 

---

## 📁 Project Folder Structure

This workspace is organized as a clean, modular full-stack application. It is fully custom-coded, typesafe, and uses local SQLite databases to guarantee instant out-of-the-box operations.

```
AgriSol/
├── backend/                   # 🔌 Node.js + Express + TypeScript Backend
│   ├── prisma/                # Database Migrations & Prisma SQLite Schema
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/            # DB client configurations & Mailer setup
│   │   ├── controllers/       # Business logic (Auth, Soil, Crops, Chatbot, Calendar)
│   │   ├── middleware/        # JWT Authentication & File upload helpers
│   │   ├── routes/            # Express routers
│   │   ├── utils/             # Helper utilities (OTP generation/validation)
│   │   └── index.ts           # Backend startup script
│   ├── .env                   # Local backend settings & Mail credentials
│   ├── package.json           # Backend dependency list
│   └── tsconfig.json          # TypeScript server compiler options
├── frontend/                  # 💻 React + Vite + Tailwind CSS 4 Frontend Folder
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layout/    # Dynamic sidebar and dashboard wraps
│   │   │   │   ├── pages/     # 13 Core pages (Dashboard, Prediction, Chatbot, Auth, etc.)
│   │   │   │   ├── shared/    # Shared components (Image handlers)
│   │   │   │   └── ui/        # Customized Radix UI & Shadcn components
│   │   │   ├── data/          # Media datasets & constant values
│   │   │   └── App.tsx        # Main router & state orchestrator
│   │   ├── styles/            # Tailwind CSS 4 setup and global variables
│   │   │   ├── default_theme.css
│   │   │   ├── globals.css
│   │   │   └── index.css
│   │   └── main.tsx           # Client entry point
│   ├── package.json           # Frontend dependency list
│   └── vite.config.ts         # Vite configurations
└── backend1/                  # ⚠️ Deprecated / Backup JavaScript Backend
```

---

## 🛠️ Full-Stack Technology Stack

### 💻 Client (Frontend)
* **Framework**: React 18 (TypeScript)
* **Build System**: Vite 6
* **Styling**: Tailwind CSS 4 (using curated CSS HSL theme tokens)
* **UI Elements**: Radix UI + Lucide Icons + Recharts (for dynamic analytics)

### 🔌 Server (Backend)
* **Runtime & Framework**: Node.js + Express + TypeScript
* **Database**: Local SQLite (zero-config, self-contained SQL file)
* **ORM**: Prisma (highly modern, typesafe database queries)
* **Security & Auth**: JSON Web Tokens (JWT) + `bcryptjs` (password hashing) + OTP (Email verification flow)
* **Mail Server**: Nodemailer (sends OTP verification emails)
* **File Uploads**: `multer` (stores crop/soil images securely)

---

## 🔒 Email OTP Verification Setup

To ensure secure signup and account verification, AgriSol utilizes an email-based One-Time Password (OTP) verification flow. 

### Configuration Steps:
1. Open the backend configuration file `backend/.env`.
2. Fill in the following variables with your Gmail credentials (or any SMTP server setup):
   ```env
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password   # NOT your main Google account password
   EMAIL_FROM="AgriSol <your_gmail@gmail.com>"
   ```
3. **How to generate a Gmail App Password:**
   * Enable **2-Factor Authentication (2FA)** on your Google account.
   * Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   * Select **Mail** → Generate.
   * Copy the 16-character password generated and paste it as `EMAIL_PASS`.

---

## 🚀 Quick Start Guide

Follow these steps to run both the frontend and backend servers on your local computer.

### 🔌 Running the Backend
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install all development and server dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Initialize the database and run migration routines:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot up and be live on **`http://localhost:5000`**.*

### 💻 Running the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install all client dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   *The frontend website will open instantly at **`http://localhost:5173`**.*

---

## 🔌 API Route Map Reference

| Endpoints Namespace | HTTP Method | Protected | Description |
|---|---|---|---|
| `/api/v1/auth/signup` | `POST` | No | Registers user, hashes password, generates OTP & sends validation email |
| `/api/v1/auth/signin` | `POST` | No | Authenticates user credentials. Resends OTP if account is unverified |
| `/api/v1/auth/verify-otp` | `POST` | No | Verifies 6-digit OTP code against expiry and issues user session JWT |
| `/api/v1/auth/resend-otp` | `POST` | No | Cooldown-protected route to refresh and resend verification code |
| `/api/v1/soil/analyze` | `POST` | Yes | Uploads soil photos (multipart/form-data) for classification |
| `/api/v1/soil/history` | `GET` | Yes | Retrieves user's soil analysis history logs |
| `/api/v1/crops/recommend` | `POST` | Yes | Computes optimal crops from soil nutrient factors (N, P, K, pH, rainfall, temperature, humidity) |
| `/api/v1/diseases/diagnose` | `POST` | Yes | Uploads plant leaf photos (multipart/form-data) to diagnose infections |
| `/api/v1/calendar/events` | `GET` | Yes | Retrieves current user's growth calendar and task events |
| `/api/v1/calendar/events` | `POST` | Yes | Creates new planting schedule appointment / task event |
| `/api/v1/calendar/events/:eventId/toggle` | `PATCH` | Yes | Toggles the completion status of a growth calendar task |
| `/api/v1/chatbot/message` | `POST` | Yes | Sends text inquiry to AI virtual farmer assistant |