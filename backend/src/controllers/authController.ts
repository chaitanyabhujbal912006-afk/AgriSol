import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { sendOtpEmail } from '../config/mailer';
import { generateOTP, hashOTP, verifyOTP, otpExpiry } from '../utils/otp';

const JWT_SECRET = process.env.JWT_SECRET || 'agrisol_ultra_secure_jwt_secret_token_key_2026';

/** Helper to issue a signed JWT for a verified user */
function issueToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * POST /api/v1/auth/signup
 * Creates account, generates OTP, sends verification email.
 * Does NOT return a JWT until the email is verified.
 */
export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing && existing.isVerified) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const hashed = await hashOTP(otp);
    const expiry = otpExpiry();

    if (existing) {
      // Re-use the existing unverified account — refresh OTP
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, otpHash: hashed, otpExpiry: expiry }
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'farmer',
          isVerified: false,
          otpHash: hashed,
          otpExpiry: expiry,
        }
      });
    }

    await sendOtpEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: `Verification code sent to ${email}. Please check your inbox.`
    });
  } catch (error: any) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create account. Please try again.' });
  }
}

/**
 * POST /api/v1/auth/verify-otp
 * Verifies the 6-digit OTP and returns a JWT on success.
 */
export async function verifyOtp(req: Request, res: Response) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (user.isVerified) {
      // Already verified — just issue token
      const token = issueToken(user);
      return res.status(200).json({
        success: true,
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    }

    if (!user.otpHash || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const isValid = await verifyOTP(otp, user.otpHash);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // Mark verified and clear OTP fields
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isVerified: true, otpHash: null, otpExpiry: null }
    });

    const token = issueToken(updatedUser);

    return res.status(200).json({
      success: true,
      token,
      user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error.message);
    return res.status(500).json({ success: false, message: 'Verification failed. Please try again.' });
  }
}

/**
 * POST /api/v1/auth/resend-otp
 * Regenerates and resends the OTP for a given email.
 */
export async function resendOtp(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'This account is already verified' });
    }

    const otp = generateOTP();
    const hashed = await hashOTP(otp);
    const expiry = otpExpiry();

    await prisma.user.update({
      where: { email },
      data: { otpHash: hashed, otpExpiry: expiry }
    });

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: `A new verification code has been sent to ${email}`
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to resend OTP. Please try again.' });
  }
}

/**
 * POST /api/v1/auth/signin
 * Signs in a verified user and returns a JWT.
 */
export async function signin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      // Resend OTP so user can complete verification
      const otp = generateOTP();
      const hashed = await hashOTP(otp);
      const expiry = otpExpiry();
      await prisma.user.update({
        where: { email },
        data: { otpHash: hashed, otpExpiry: expiry }
      });
      await sendOtpEmail(email, otp);

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        message: 'Email not verified. A new verification code has been sent to your email.'
      });
    }

    const token = issueToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error: any) {
    console.error('Signin error:', error.message);
    return res.status(500).json({ success: false, message: 'Sign in failed. Please try again.' });
  }
}
