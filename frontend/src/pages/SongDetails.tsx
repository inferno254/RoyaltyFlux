import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { songApi } from '../services/api/song.api';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card';
import { SongPlayer } from '../components/song/SongPlayer';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { formatNumber, timeAgo, durationToMinSec } from '../lib/format';
import { ipfsUrl } from '../lib/ipfs';

export default function SongDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['song', id], queryFn: () => songApi.get(id!), enabled: !!id });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data?.data) return <p>Song not found</p>;
  const s = data.data;

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={s.ipfsCoverHash ? ipfsUrl(s.ipfsCoverHash) : '/placeholder-cover.jpg'}
            alt={s.title}
            className="h-48 w-48 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{s.title}</h1>
            <Link to={`/artist/${s.artistId}`} className="text-brand-400 hover:underline">
              {s.artist?.artistProfile?.displayName ?? 'Unknown artist'}
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.genre && <Badge>{s.genre}</Badge>}
              <Badge variant="info">{s.status}</Badge>
              {s.durationSec && <Badge variant="default">{durationToMinSec(s.durationSec)}</Badge>}
            </div>
            <p className="mt-4 text-sm text-gray-300">{s.description}</p>
            <p className="mt-2 text-xs text-gray-500">Uploaded {timeAgo(s.createdAt)}</p>
          </div>
        </div>
      </Card>

      {s.ipfsAudioHash && (
        <div className="mt-6">
          <SongPlayer src={ipfsUrl(s.ipfsAudioHash)} title={s.title} />
        </div>
      )}

      {s.collaborators && s.collaborators.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Collaborators & Splits</CardTitle></CardHeader>
          <CardBody>
            <ul className="divide-y divide-gray-800">
              {s.collaborators.map((c: { userId: string; shareBps: number; user: { email?: string } }) => (
                <li key={c.userId} className="flex justify-between py-2 text-sm">
                  <span className="text-gray-300">{c.user.email}</span>
                  <span className="font-mono text-brand-300">{(c.shareBps / 100).toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {s.tokenId && (
        <Card className="mt-6">
          <CardHeader><CardTitle>On-chain info</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-gray-300">Token ID: <span className="font-mono">{s.tokenId}</span></p>
            {s.splitterAddress && (
              <p className="text-sm text-gray-300">Splitter: <span className="font-mono">{s.splitterAddress}</span></p>
            )}
            <p className="text-sm text-gray-300">Total streams (on-chain): <strong>{formatNumber(s.tokenId ? 0 : 0)}</strong></p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
