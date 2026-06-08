import { api } from '../../lib/api';

export const royaltyApi = {
  myEarnings: () => api.get('/royalties/me/earnings'),
  calculate: (songId: string) => api.get(`/royalties/songs/${songId}/calculate`),
  onChainPending: (splitter: string, account: string) =>
    api.get('/royalties/onchain-pending', { params: { splitter, account } }),
  distributions: (songId: string) => api.get(`/royalties/songs/${songId}/distributions`),
};
