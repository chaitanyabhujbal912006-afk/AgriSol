import { Router } from 'express';
import { getEvents, createEvent, toggleComplete } from '../controllers/calendarController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/events', authMiddleware, getEvents);
router.post('/events', authMiddleware, createEvent);
router.patch('/events/:eventId/toggle', authMiddleware, toggleComplete);

export default router;
