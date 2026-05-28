import { Router } from 'express';
import { diagnoseDisease } from '../controllers/diseaseController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/diagnose', authMiddleware, upload.single('file'), diagnoseDisease);

export default router;
