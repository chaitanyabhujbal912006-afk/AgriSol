import { Router } from 'express';
import { recommendCrops } from '../controllers/cropController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/recommend', authMiddleware, recommendCrops);

export default router;
