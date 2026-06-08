import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { songApi } from '../../services/api/song.api';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Play } from 'lucide-react';
import { ipfsUrl } from '../../lib/ipfs';
import { Spinner } from '../ui/Spinner';

export function SongCard({ songId }: { songId: string }) {
  const { data, isLoading } = useQuery({ queryKey: ['song', songId], queryFn: () => songApi.get(songId) });
  if (isLoading) return <Card><CardBody><Spinner size="sm" /></CardBody></Card>;
  const s = data?.data;
  if (!s) return null;

  return (
    <Link to={`/song/${s.id}`}>
      <Card className="transition hover:border-brand-500">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-gray-800">
          {s.ipfsCoverHash ? (
            <img src={ipfsUrl(s.ipfsCoverHash)} alt={s.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl text-gray-600">♪</div>
          )}
          <div className="absolute bottom-2 right-2 rounded-full bg-brand-600 p-2 opacity-0 transition group-hover:opacity-100">
            <Play size={14} />
          </div>
        </div>
        <CardBody>
          <h3 className="truncate font-semibold text-white">{s.title}</h3>
          <p className="truncate text-sm text-gray-400">{s.artist?.artistProfile?.displayName ?? 'Unknown'}</p>
          <div className="mt-1 flex gap-1">
            {s.genre && <Badge>{s.genre}</Badge>}
            {s.status === 'MINTED' && <Badge variant="success">NFT</Badge>}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
