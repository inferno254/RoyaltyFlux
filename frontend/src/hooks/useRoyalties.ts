import { useQuery } from '@tanstack/react-query';
import { royaltyApi } from '../services/api/royalty.api';

export function useMyEarnings() {
  return useQuery({ queryKey: ['my-earnings'], queryFn: () => royaltyApi.myEarnings() });
}
export function useRoyaltyDistribution(songId?: string) {
  return useQuery({
    queryKey: ['royalty-dist', songId],
    queryFn: () => royaltyApi.calculate(songId!),
    enabled: !!songId,
  });
}
