import { useQuery } from '@tanstack/react-query';
import { userApi } from '../services/api/user.api';

export function useUser() {
  return useQuery({ queryKey: ['me'], queryFn: () => userApi.me() });
}
