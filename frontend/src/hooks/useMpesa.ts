import { useMutation, useQuery } from '@tanstack/react-query';
import { mpesaApi } from '../services/api/mpesa.api';

export function useStkPush() {
  return useMutation({ mutationFn: mpesaApi.stkPush });
}
export function useMpesaStatus(id?: string) {
  return useQuery({
    queryKey: ['mpesa-status', id],
    queryFn: () => mpesaApi.status(id!),
    enabled: !!id,
    refetchInterval: 5000,
  });
}
