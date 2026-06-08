import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { songApi } from '../services/api/song.api';
import { nftApi } from '../services/api/nft.api';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useWallet } from '../hooks/useWallet';
import { EmptyState } from '../components/common/EmptyState';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MySongs() {
  const qc = useQueryClient();
  const { address } = useWallet();
  const { data, isLoading } = useQuery({ queryKey: ['my-songs'], queryFn: () => songApi.list({ limit: 100 }) });

  const mint = useMutation({
    mutationFn: ({ id, artist }: { id: string; artist: string }) => nftApi.mint(id, artist),
    onSuccess: () => {
      toast.success('Song minted!');
      qc.invalidateQueries({ queryKey: ['my-songs'] });
    },
    onError: () => toast.error('Minting failed'),
  });

  if (isLoading) return <p>Loading...</p>;
  const songs = data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Songs</h1>
        <Link to="/upload"><Button>Upload new</Button></Link>
      </div>

      {songs.length === 0 ? (
        <EmptyState title="No songs yet" message="Upload your first track to get started." actionLabel="Upload song" actionHref="/upload" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {songs.map((s: { id: string; title: string; status: string; tokenId?: string }) => (
            <Card key={s.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    <Badge variant={s.status === 'MINTED' ? 'success' : s.status === 'FAILED' ? 'danger' : 'warning'}>
                      {s.status}
                    </Badge>
                  </div>
                  {s.status !== 'MINTED' && (
                    <Button
                      size="sm"
                      disabled={!address || mint.isPending}
                      onClick={() => mint.mutate({ id: s.id, artist: address! })}
                    >
                      Mint NFT
                    </Button>
                  )}
                </div>
                {s.tokenId && <p className="mt-2 text-xs text-gray-500">Token ID: {s.tokenId}</p>}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
