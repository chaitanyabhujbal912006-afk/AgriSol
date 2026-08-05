## Vercel Deployment Guide

This document explains how to correctly deploy the AgriSol frontend to Vercel and connect it to a live backend.

---

### Architecture Overview

```
Browser (Vercel CDN)
    │
    │  fetch(`${VITE_API_URL}/auth/signin`)
    ▼
Backend API (Render / Railway / any Node.js host)
    │
    ▼
MongoDB Atlas + Redis
```

All API calls in the frontend read the backend URL from a single environment variable: `VITE_API_URL`.

---

### Step 1: Deploy the Backend

Deploy the `backend/` folder to a cloud service (Render, Railway, or Fly.io). Once deployed, note the backend URL, e.g.:

```
https://agrisol-api.onrender.com
```

---

### Step 2: Set the Vercel Environment Variable

1. Open your Vercel project → **Settings** → **Environment Variables**.
2. Add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://agrisol-api.onrender.com/api/v1` |

3. Apply to **Production**, **Preview**, and **Development** environments.
4. **Redeploy** your Vercel project (Settings → Deployments → Redeploy).

---

### Step 3: Set the Backend CORS Origin

In your backend `.env` (on Render/Railway), set:

```env
FRONTEND_URL=https://your-agrisol-app.vercel.app
```

This allows the backend to accept requests from your Vercel domain.

---

### Local Development (No Changes Needed)

In local development, `frontend/.env.development` contains:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

This is automatically picked up by Vite — you do NOT need to change anything locally.

---

### How It Works

| Environment | `VITE_API_URL` | Source |
|---|---|---|
| Local (`npm run dev`) | `http://localhost:5000/api/v1` | `.env.development` |
| Vercel Production | `https://agrisol-api.onrender.com/api/v1` | Vercel dashboard env var |
| Docker (optional) | Set via Docker `--env` flag | Container runtime |
