import { api } from '../../lib/api';

export const songApi = {
  list: (params: Record<string, unknown> = {}) => api.get('/songs', { params }),
  get: (id: string) => api.get(`/songs/${id}`),
  create: (data: Record<string, unknown>) => api.post('/songs', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/songs/${id}`, data),
  remove: (id: string) => api.delete(`/songs/${id}`),
  uploadAudio: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/songs/${id}/audio`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadCover: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/songs/${id}/cover`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  buildMetadata: (id: string) => api.post(`/songs/${id}/build-metadata`),
};
