import { Router } from 'express';
import { signup, signin, verifyOtp, resendOtp } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router;
