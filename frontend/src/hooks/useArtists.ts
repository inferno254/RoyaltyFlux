import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../services/api/artist.api';

export function useArtists(params = {}) {
  return useQuery({ queryKey: ['artists', params], queryFn: () => artistApi.list(params) });
}
export function useArtist(id?: string) {
  return useQuery({ queryKey: ['artist', id], queryFn: () => artistApi.get(id!), enabled: !!id });
}
export function useMyArtistStats() {
  return useQuery({ queryKey: ['artist-stats'], queryFn: () => artistApi.myStats() });
}
