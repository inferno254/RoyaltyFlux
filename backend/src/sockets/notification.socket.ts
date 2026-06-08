import { Server as SocketServer } from 'socket.io';
import { getIO } from '.';

export class NotificationSocket {
  static push(userId: string, payload: { type: string; title: string; body?: string; data?: unknown }) {
    try {
      const io: SocketServer = getIO();
      io.to(`user:${userId}`).emit('notification', payload);
    } catch (err) {
      // io not initialized (e.g. tests) — silently drop
    }
  }
}
