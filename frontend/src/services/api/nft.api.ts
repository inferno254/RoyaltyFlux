import { api } from '../../lib/api';

export const nftApi = {
  mint: (songId: string, artistAddress: string) => api.post('/nfts/mint', { songId, artistAddress }),
  recordStreams: (songId: string, streamCount: number) => api.post('/nfts/record-streams', { songId, streamCount }),
  info: (tokenId: string) => api.get(`/nfts/${tokenId}`),
};
