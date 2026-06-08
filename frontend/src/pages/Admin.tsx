import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api/admin.api';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { formatNumber } from '../lib/format';
import { Spinner } from '../components/ui/Spinner';

export default function Admin() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: () => adminApi.stats() });
  const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.users({ limit: 20 }) });

  if (isLoading) return <Spinner size="lg" />;
  const s = data?.data ?? { users: 0, songs: 0, streams: 0, distributions: 0, payouts: 0 };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin</h1>
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        {(['users', 'songs', 'streams', 'distributions', 'payouts'] as const).map((k) => (
          <Card key={k}>
            <CardBody>
              <p className="text-sm text-gray-400 capitalize">{k}</p>
              <p className="text-2xl font-bold">{formatNumber(s[k])}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Recent users</CardTitle></CardHeader>
        <CardBody>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500">
              <tr><th>Email</th><th>Role</th><th>Joined</th><th>Active</th></tr>
            </thead>
            <tbody>
              {users?.data?.map((u: { id: string; email: string; role: string; isActive: boolean; createdAt: string }) => (
                <tr key={u.id} className="border-t border-gray-800">
                  <td className="py-2 text-white">{u.email}</td>
                  <td className="text-gray-300">{u.role}</td>
                  <td className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>{u.isActive ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
