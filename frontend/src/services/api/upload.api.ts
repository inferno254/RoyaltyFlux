import { api } from '../../lib/api';

export const uploadApi = {
  file: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/upload/file', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  json: (data: unknown) => api.post('/upload/json', data),
};
