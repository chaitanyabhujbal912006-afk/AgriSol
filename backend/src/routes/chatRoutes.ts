import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/message', authMiddleware, handleChatMessage);

export default router;
