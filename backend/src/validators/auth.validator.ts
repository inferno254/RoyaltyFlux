import { z } from 'zod';
import { EMAIL_REGEX, PHONE_REGEX, WALLET_REGEX } from '../utils/constants';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().regex(EMAIL_REGEX, 'Invalid email'),
    password: z.string().min(8).max(128),
    phone: z.string().regex(PHONE_REGEX).optional(),
    walletAddress: z.string().regex(WALLET_REGEX).optional(),
    role: z.enum(['ARTIST', 'COLLABORATOR', 'LISTENER']).default('LISTENER'),
    displayName: z.string().min(2).max(80).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().regex(EMAIL_REGEX),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string().min(10) }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().regex(EMAIL_REGEX) }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    password: z.string().min(8).max(128),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({ token: z.string().min(10) }),
});
