import { prisma } from '../config/database';
import { ApiError } from '../utils/errors';
import { UserRole } from '@prisma/client';

export class UserService {
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { artistProfile: true, songs: true },
    });
    if (!user) throw ApiError.notFound('User not found');
    return this.sanitize(user);
  }

  async update(id: string, data: { phone?: string; walletAddress?: string }) {
    const user = await prisma.user.update({ where: { id }, data });
    return this.sanitize(user);
  }

  async changeRole(id: string, role: UserRole) {
    const user = await prisma.user.update({ where: { id }, data: { role } });
    return this.sanitize(user);
  }

  async deactivate(id: string) {
    await prisma.user.update({ where: { id }, data: { isActive: false } });
    await prisma.refreshToken.updateMany({ where: { userId: id }, data: { revoked: true } });
  }

  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { artistProfile: true },
      }),
      prisma.user.count(),
    ]);
    return { users: users.map((u) => this.sanitize(u)), total };
  }

  private sanitize<T extends { passwordHash?: string | null; refreshTokens?: unknown }>(user: T) {
    const { passwordHash, refreshTokens, ...rest } = user;
    void passwordHash;
    void refreshTokens;
    return rest;
  }
}

export const userService = new UserService();
