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

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}
