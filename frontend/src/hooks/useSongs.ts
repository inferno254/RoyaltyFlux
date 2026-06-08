import { useQuery } from '@tanstack/react-query';
import { songApi } from '../services/api/song.api';

export function useSongs(params: { page?: number; limit?: number; q?: string; genre?: string } = {}) {
  return useQuery({
    queryKey: ['songs', params],
    queryFn: () => songApi.list(params),
  });
}

export function useSong(id?: string) {
  return useQuery({
    queryKey: ['song', id],
    queryFn: () => songApi.get(id!),
    enabled: !!id,
  });
}
