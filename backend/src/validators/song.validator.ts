import { z } from 'zod';

export const songUploadSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    genre: z.string().max(50).optional(),
    releaseDate: z.string().datetime().optional(),
    collaborators: z
      .array(
        z.object({
          userId: z.string().uuid(),
          shareBps: z.number().int().min(0).max(10_000),
        }),
      )
      .min(1, 'At least one collaborator required'),
  }).refine(
    (data) => data.collaborators.reduce((s, c) => s + c.shareBps, 0) === 10_000,
    { message: 'Collaborator shares must sum to 100% (10000 bps)', path: ['collaborators'] },
  ),
});

export const songUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    genre: z.string().max(50).optional(),
    releaseDate: z.string().datetime().optional(),
  }),
});

export const songIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const songQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['DRAFT', 'PROCESSING', 'MINTED', 'FAILED']).optional(),
    genre: z.string().optional(),
    artistId: z.string().uuid().optional(),
    q: z.string().optional(),
  }),
});
