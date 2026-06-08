import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../config/logger';
import { env } from '../config/env';

let io: SocketServer | null = null;

export function getIO(): SocketServer {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(`user:${userId}`).emit(event, payload);
}

export function initSocket(server: HttpServer) {
  io = new SocketServer(server, {
    cors: { origin: env.CORS_ORIGINS.split(',').map((s) => s.trim()), credentials: true },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) socket.join(`user:${userId}`);
    logger.debug({ socketId: socket.id, userId }, 'Socket connected');
    socket.on('disconnect', () => logger.debug({ socketId: socket.id }, 'Socket disconnected'));
  });
}
