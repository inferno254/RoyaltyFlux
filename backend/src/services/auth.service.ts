import { prisma } from '../config/database';
import { hashPassword, verifyPassword, isStrongPassword } from '../utils/password.util';
import { signAccessToken, signRefreshToken, refreshExpiresAt } from '../utils/jwt.util';
import { randomToken, sha256 } from '../utils/crypto.util';
import { ApiError } from '../utils/errors';
import { logger } from '../config/logger';
import { UserRole } from '@prisma/client';
import { RegisterDto, LoginDto } from '../types/api.types';

export class AuthService {
  async register(dto: RegisterDto) {
    if (!isStrongPassword(dto.password)) {
      throw ApiError.badRequest(
        'Password must be 8+ chars with upper, lower, and digit',
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          dto.phone ? { phone: dto.phone } : { id: 'never' },
          dto.walletAddress ? { walletAddress: dto.walletAddress } : { id: 'never' },
        ],
      },
    });
    if (existing) throw ApiError.conflict('User already exists');

    const passwordHash = await hashPassword(dto.password);
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        walletAddress: dto.walletAddress,
        role: (dto.role as UserRole) ?? UserRole.LISTENER,
        artistProfile:
          dto.role === 'ARTIST' && dto.displayName
            ? { create: { displayName: dto.displayName } }
            : undefined,
      },
      include: { artistProfile: true },
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw ApiError.unauthorized('Invalid credentials');
    if (!user.isActive) throw ApiError.forbidden('Account deactivated');

    const valid = await verifyPassword(dto.password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid credentials');

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueTokens(user.id, user.email, user.role);
  }

  async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: sha256(refreshToken) },
      include: { user: true },
    });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    return this.issueTokens(stored.user.id, stored.user.email, stored.user.role);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { userId, token: sha256(refreshToken) },
        data: { revoked: true },
      });
    } else {
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true },
      });
    }
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return; // Don't leak existence
    const token = randomToken();
    await prisma.passwordReset.create({
      data: { userId: user.id, token: sha256(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });
    logger.info({ userId: user.id }, 'Password reset requested (token in real impl would be emailed)');
    return token; // In production, send via email service
  }

  async resetPassword(token: string, newPassword: string) {
    if (!isStrongPassword(newPassword)) throw ApiError.badRequest('Weak password');
    const reset = await prisma.passwordReset.findUnique({ where: { token: sha256(token) } });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
      throw ApiError.badRequest('Invalid or expired token');
    }
    const hash = await hashPassword(newPassword);
    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: hash } }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } }),
      prisma.refreshToken.updateMany({ where: { userId: reset.userId }, data: { revoked: true } }),
    ]);
  }

  async verifyEmail(token: string) {
    // Stub — implement with email verification table if needed
    logger.info({ token }, 'Email verification');
  }

  private async issueTokens(userId: string, email: string, role: string) {
    const accessToken = signAccessToken({ sub: userId, email, role });
    const refreshToken = signRefreshToken({ sub: userId });

    await prisma.refreshToken.create({
      data: {
        userId,
        token: sha256(refreshToken),
        expiresAt: refreshExpiresAt(),
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
