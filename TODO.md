# AgriSol — TODO

## ⚠️ Before Testing Email OTP

> One required step before the email OTP flow works:

Open `backend/.env` and fill in your Gmail credentials:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password   # NOT your main password
EMAIL_FROM="AgriSol <your_gmail@gmail.com>"
```

### How to get a Gmail App Password:
1. Enable **2FA** on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select **Mail** → Generate
4. Copy the 16-character password → paste it as `EMAIL_PASS`
5. Restart the backend: `npm run dev`

---

## Pending Tasks

- [ ] Fill in Gmail App Password in `backend/.env`
- [ ] Test full signup → OTP email → verify → dashboard flow
- [ ] Test sign in with unverified account (should resend OTP)
- [ ] Test OTP expiry (code expires after 10 minutes)
- [ ] Test resend OTP cooldown (60s between resends)

---

## Completed

- [x] Email OTP verification system (backend + frontend)
  - `POST /api/v1/auth/signup` — creates account, sends OTP email
  - `POST /api/v1/auth/verify-otp` — verifies code, issues JWT
  - `POST /api/v1/auth/resend-otp` — regenerates & resends OTP
  - `POST /api/v1/auth/signin` — checks `isVerified`, resends OTP if not
- [x] Prisma migration: `isVerified`, `otpHash`, `otpExpiry` fields on `User`
- [x] Beautiful HTML OTP email template
- [x] Frontend `Auth.tsx` updated to email-based flow with resend cooldown & error messages
