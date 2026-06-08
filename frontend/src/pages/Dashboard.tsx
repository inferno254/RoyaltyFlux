import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { artistApi } from '../services/api/artist.api';
import { songApi } from '../services/api/song.api';
import { royaltyApi } from '../services/api/royalty.api';
import { formatKes, formatNumber } from '../lib/format';
import { Music, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats } = useQuery({ queryKey: ['artist-stats'], queryFn: () => artistApi.myStats() });
  const { data: songsData } = useQuery({ queryKey: ['my-songs'], queryFn: () => songApi.list({ limit: 5 }) });
  const { data: earnings } = useQuery({ queryKey: ['my-earnings'], queryFn: () => royaltyApi.myEarnings() });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Welcome back, {user?.email}</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardBody>
            <Music className="mb-2 h-5 w-5 text-brand-500" />
            <p className="text-sm text-gray-400">Songs</p>
            <p className="text-2xl font-bold">{formatNumber(stats?.data?.songCount ?? 0)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Users className="mb-2 h-5 w-5 text-brand-500" />
            <p className="text-sm text-gray-400">Total Streams</p>
            <p className="text-2xl font-bold">{formatNumber(stats?.data?.totalStreams ?? 0)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <DollarSign className="mb-2 h-5 w-5 text-green-500" />
            <p className="text-sm text-gray-400">Total Earnings</p>
            <p className="text-2xl font-bold">{formatKes(earnings?.data?.total ?? 0)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <TrendingUp className="mb-2 h-5 w-5 text-gold-500" />
            <p className="text-sm text-gray-400">Recent (100)</p>
            <p className="text-2xl font-bold">{formatNumber(stats?.data?.recentStreams?.length ?? 0)}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent songs</CardTitle>
        </CardHeader>
        <CardBody>
          {songsData?.data?.length ? (
            <ul className="divide-y divide-gray-800">
              {songsData.data.map((s: { id: string; title: string; status: string }) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <span className="text-white">{s.title}</span>
                  <span className="text-xs text-gray-400">{s.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No songs yet. Upload your first track!</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
