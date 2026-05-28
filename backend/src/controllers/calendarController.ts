import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';

export async function getEvents(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const events = await prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { eventDate: 'asc' }
    });

    return res.status(200).json({ success: true, events });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createEvent(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { cropName, action, eventDate } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!cropName || !action || !eventDate) {
    return res.status(400).json({ success: false, message: 'Missing event details' });
  }

  try {
    const newEvent = await prisma.calendarEvent.create({
      data: {
        userId,
        cropName,
        action,
        eventDate: new Date(eventDate)
      }
    });

    return res.status(201).json({ success: true, event: newEvent });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function toggleComplete(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { eventId } = req.params;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId }
    });

    if (!event || event.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id: eventId },
      data: { completed: !event.completed }
    });

    return res.status(200).json({ success: true, event: updatedEvent });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
