/**
 * Socket.IO Implementation
 * Real-time chat & live notifications
 */

const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { ChatMessage } = require('../models/index');
const User = require('../models/User');
const logger = require('../utils/logger');

let io;

// Connected users map: userId -> socketId
const connectedUsers = new Map();

const initSocketIO = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ── Auth Middleware ─────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name role district state profileImage');
      if (!user || !user.isActive) return next(new Error('User not found'));

      socket.userId = decoded.id;
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // ── Connection Handler ──────────────────────
  io.on('connection', (socket) => {
    const userId = socket.userId;
    logger.info(`Socket connected: ${userId} (${socket.id})`);

    // Register user
    connectedUsers.set(userId, socket.id);

    // Join user's personal room for direct notifications
    socket.join(`user:${userId}`);

    // Join district/state rooms for area notifications
    if (socket.user.district) socket.join(`district:${socket.user.district}`);
    if (socket.user.state) socket.join(`state:${socket.user.state}`);

    // Notify others that user is online
    socket.broadcast.emit('user:online', { userId });

    // ── Chat Events ─────────────────────────
    socket.on('chat:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      logger.debug(`${userId} joined conversation: ${conversationId}`);
    });

    socket.on('chat:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('chat:message', async (data) => {
      try {
        const { receiverId, content, messageType = 'text', conversationId } = data;

        if (!content || !receiverId) return;

        // Generate conversation ID (sorted user IDs)
        const convId = conversationId || [userId, receiverId].sort().join('_');

        // Save to DB
        const message = await ChatMessage.create({
          conversationId: convId,
          sender: userId,
          receiver: receiverId,
          messageType,
          content,
        });

        await message.populate('sender', 'name profileImage role');

        const messageObj = message.toObject();

        // Send to conversation room
        io.to(`conversation:${convId}`).emit('chat:message', messageObj);

        // Send real-time notification to receiver if not in conversation
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(`user:${receiverId}`).emit('notification:new', {
            type: 'new_message',
            from: { id: userId, name: socket.user.name },
            preview: content.substring(0, 100),
            conversationId: convId,
          });
        }

      } catch (err) {
        logger.error('Chat message error:', err);
        socket.emit('chat:error', { message: 'Failed to send message' });
      }
    });

    // ── Typing Indicator ─────────────────────
    socket.on('chat:typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('chat:typing', {
        userId,
        name: socket.user.name,
        isTyping,
      });
    });

    // ── Mark Messages Read ───────────────────
    socket.on('chat:read', async ({ conversationId }) => {
      try {
        await ChatMessage.updateMany(
          { conversationId, receiver: userId, isRead: false },
          { isRead: true, readAt: new Date() }
        );
        socket.to(`conversation:${conversationId}`).emit('chat:read', { userId, conversationId });
      } catch (err) {
        logger.error('Mark read error:', err);
      }
    });

    // ── Disease Analysis Progress ─────────────
    socket.on('disease:subscribe', (reportId) => {
      socket.join(`disease:${reportId}`);
    });

    // ── Market Price Subscription ────────────
    socket.on('market:subscribe', ({ crops, state }) => {
      crops?.forEach(crop => {
        socket.join(`market:${crop.toLowerCase()}:${state}`);
      });
    });

    // ── Disconnect ───────────────────────────
    socket.on('disconnect', (reason) => {
      connectedUsers.delete(userId);
      socket.broadcast.emit('user:offline', { userId });
      logger.info(`Socket disconnected: ${userId} (${reason})`);
    });

    // ── Error Handler ────────────────────────
    socket.on('error', (err) => {
      logger.error(`Socket error for ${userId}:`, err);
    });
  });

  logger.info('✅ Socket.IO initialized');
  return io;
};

// ── Emit to specific user ─────────────────────
const emitToUser = (userId, event, data) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
};

// ── Emit to district ──────────────────────────
const emitToDistrict = (district, event, data) => {
  if (!io) return;
  io.to(`district:${district}`).emit(event, data);
};

// ── Emit to state ─────────────────────────────
const emitToState = (state, event, data) => {
  if (!io) return;
  io.to(`state:${state}`).emit(event, data);
};

// ── Broadcast disease analysis result ─────────
const emitDiseaseResult = (reportId, result) => {
  if (!io) return;
  io.to(`disease:${reportId}`).emit('disease:result', result);
};

// ── Broadcast market price update ─────────────
const emitMarketUpdate = (cropName, state, priceData) => {
  if (!io) return;
  io.to(`market:${cropName.toLowerCase()}:${state}`).emit('market:update', priceData);
};

// ── Check if user is online ───────────────────
const isUserOnline = (userId) => connectedUsers.has(userId);

// ── Get online user count ─────────────────────
const getOnlineCount = () => connectedUsers.size;

module.exports = {
  initSocketIO,
  getIO: () => io,
  emitToUser,
  emitToDistrict,
  emitToState,
  emitDiseaseResult,
  emitMarketUpdate,
  isUserOnline,
  getOnlineCount,
};
