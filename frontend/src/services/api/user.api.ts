import { api } from '../../lib/api';

export const userApi = {
  me: () => api.get('/users/me'),
  update: (data: Record<string, unknown>) => api.patch('/users/me', data),
  list: (params: { page?: number; limit?: number } = {}) => api.get('/users', { params }),
  get: (id: string) => api.get(`/users/${id}`),
};
