import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../services/api/artist.api';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { formatNumber } from '../lib/format';
import { shortenAddress } from '../lib/format';

export default function ArtistProfile() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['artist', id], queryFn: () => artistApi.get(id!), enabled: !!id });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data?.data) return <p>Artist not found</p>;

  const a = data.data;
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <div className="flex items-start gap-4">
          <Avatar name={a.displayName} size="xl" src={a.avatarUrl} />
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
              {a.displayName} {a.verified && <Badge variant="info">✓ Verified</Badge>}
            </h1>
            <p className="mt-1 text-sm text-gray-400">{a.bio}</p>
            <div className="mt-3 flex gap-4 text-sm text-gray-300">
              <span>{formatNumber(a.totalStreams)} streams</span>
              {a.user?.walletAddress && (
                <a href={`https://snowtrace.io/address/${a.user.walletAddress}`} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                  {shortenAddress(a.user.walletAddress)}
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-gray-300">Total streams: <strong>{formatNumber(a.totalStreams)}</strong></p>
            <Link to="/explore" className="mt-3 inline-block text-sm text-brand-400 hover:underline">More from {a.displayName} →</Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
