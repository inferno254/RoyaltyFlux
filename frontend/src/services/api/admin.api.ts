import { api } from '../../lib/api';

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  users: (params: { page?: number; limit?: number } = {}) => api.get('/admin/users', { params }),
  deactivate: (id: string) => api.post(`/admin/users/${id}/deactivate`),
  auditLogs: (params: { page?: number; limit?: number } = {}) => api.get('/admin/audit-logs', { params }),
};
