import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useNotifications() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => (api as any).get('/notifications').then((r: any) => r),
    refetchInterval: 30000,
  });
  const markRead = useMutation({
    mutationFn: (id: string) => (api as any).patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const unread = (data as any)?.notifications?.filter((n: any) => !n.isRead).length || 0;
  return { notifications: (data as any)?.notifications || [], unreadCount: unread, markRead, isLoading };
}
