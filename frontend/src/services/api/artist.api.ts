import { api } from '../../lib/api';

export const artistApi = {
  me: () => api.get('/artists/me'),
  myStats: () => api.get('/artists/me/stats'),
  list: (params: { page?: number; limit?: number } = {}) => api.get('/artists', { params }),
  get: (id: string) => api.get(`/artists/${id}`),
};
