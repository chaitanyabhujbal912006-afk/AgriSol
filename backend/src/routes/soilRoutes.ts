import { Router } from 'express';
import { analyzeSoil, getSoilHistory } from '../controllers/soilController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/analyze', authMiddleware, upload.single('file'), analyzeSoil);
router.get('/history', authMiddleware, getSoilHistory);

export default router;
