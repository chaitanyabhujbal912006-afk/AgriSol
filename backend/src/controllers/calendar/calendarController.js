/**
 * Calendar Controller
 * Handles user custom calendar events
 */

const { CalendarEvent } = require('../../models/index');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');

exports.getEvents = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const events = await CalendarEvent.find({ farmer: userId }).sort({ eventDate: 1 });

  res.status(200).json({
    success: true,
    events
  });
});

exports.createEvent = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { cropName, action, eventDate } = req.body;

  if (!cropName || !action || !eventDate) {
    throw new AppError('Missing event details', 400);
  }

  const newEvent = await CalendarEvent.create({
    farmer: userId,
    cropName,
    action,
    eventDate: new Date(eventDate)
  });

  res.status(201).json({
    success: true,
    event: newEvent
  });
});

exports.toggleComplete = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { eventId } = req.params;

  const event = await CalendarEvent.findOne({ _id: eventId, farmer: userId });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  event.completed = !event.completed;
  await event.save();

  res.status(200).json({
    success: true,
    event
  });
});
