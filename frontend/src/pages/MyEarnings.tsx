import { useQuery } from '@tanstack/react-query';
import { royaltyApi } from '../services/api/royalty.api';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { formatKes, formatNumber } from '../lib/format';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function MyEarnings() {
  const { data, isLoading } = useQuery({ queryKey: ['my-earnings'], queryFn: () => royaltyApi.myEarnings() });

  if (isLoading) return <p>Loading...</p>;
  const total = data?.data?.total ?? 0;
  const payouts = data?.data?.payouts ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Earnings</h1>

      <Card className="mb-6">
        <CardBody>
          <p className="text-sm text-gray-400">Total earned</p>
          <p className="text-4xl font-bold text-green-400">{formatKes(total)}</p>
          <Link to="/withdraw" className="mt-3 inline-block">
            <Button>Withdraw</Button>
          </Link>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payout history</CardTitle></CardHeader>
        <CardBody>
          {payouts.length === 0 ? (
            <p className="text-sm text-gray-400">No payouts yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-500">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p: { id: string; createdAt: string; phone: string; amountKes: string; status: string; mpesaReceipt?: string }) => (
                  <tr key={p.id} className="border-t border-gray-800">
                    <td className="py-2 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="text-gray-300">{p.phone}</td>
                    <td className="text-white">{formatKes(p.amountKes)}</td>
                    <td>
                      <Badge variant={p.status === 'SUCCESS' ? 'success' : p.status === 'FAILED' ? 'danger' : 'warning'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-gray-500">{p.mpesaReceipt ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
