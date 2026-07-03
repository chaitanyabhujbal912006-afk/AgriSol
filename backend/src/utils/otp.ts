import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/** Generate a cryptographically random 6-digit OTP string */
export function generateOTP(): string {
  // Generate a number between 100000 and 999999
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
}

/** Hash an OTP for secure storage in the database */
export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

/** Verify a plaintext OTP against a stored hash */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

/** Return a Date object 10 minutes from now */
export function otpExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
