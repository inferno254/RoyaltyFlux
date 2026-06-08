import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}
export interface ApiFailure {
  success: false;
  error: string;
  details?: unknown;
}
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): { data: T[]; meta: Pagination } {
  return {
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export function handleControllerError(err: unknown): never {
  if (err instanceof ZodError) throw err;
  if (err instanceof Prisma.PrismaClientKnownRequestError) throw err;
  throw err;
}
