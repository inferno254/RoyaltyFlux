import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Share2, ExternalLink, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import AudioPlayerBar from '@/components/AudioPlayerBar';

export default function SongDetail() {
  const { id } = useParams();
  const { data: song, isLoading } = useQuery({ queryKey: ['song', id], queryFn: () => (api as any).get(`/songs/${id}`).then((r: any) => r), enabled: !!id });
  const [showPlayer, setShowPlayer] = useState(false);

  if (isLoading) return <div className="max-w-7xl mx-auto py-12 text-center">Loading...</div>;
  if (!song) return <div className="max-w-7xl mx-auto py-12 text-center">Song not found.</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 pb-32">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden sticky top-24">
            <img src={song.coverImageUrl} alt={song.title} className="w-full aspect-square object-cover" />
            <div className="p-4"><button onClick={() => setShowPlayer(true)} className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2"><Play className="w-5 h-5" /> Play Song</button></div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div><h1 className="text-4xl font-bold mb-2">{song.title}</h1><Link to={`/artist/${song.artist?.id}`} className="text-primary font-medium hover:underline text-lg">by {song.artist?.artistProfile?.stageName || song.artist?.fullName}</Link></div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
            <h3 className="font-bold mb-3">Royalty Breakdown</h3>
            {song.collaborators?.map((c: any) => (
              <div key={c.id} className="flex justify-between py-2 border-b last:border-0"><div><p className="font-medium">{c.user?.fullName || 'Unknown'}</p><p className="text-xs text-gray-500">{c.role}</p></div><p className="font-bold">{c.percentage}%</p></div>
            ))}
            <div className="flex justify-between py-2 text-gray-600"><span>Artist (remainder)</span><span>{100 - (song.collaborators?.reduce((a: number, c: any) => a + c.percentage, 0) || 0)}%</span></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 text-center"><p className="text-2xl font-bold">{(song.totalStreams || 0).toLocaleString()}</p><p className="text-sm text-gray-600">Streams</p></div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 text-center"><p className="text-2xl font-bold">{(song.totalEarnings || 0).toLocaleString()}</p><p className="text-sm text-gray-600">KES Earned</p></div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 text-center"><p className="text-2xl font-bold">{new Date(song.releaseDate).toLocaleDateString()}</p><p className="text-sm text-gray-600">Released</p></div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex items-center gap-3"><ExternalLink className="w-5 h-5 text-gray-500" /><div><p className="text-sm font-medium">Minted as NFT</p><p className="text-xs text-gray-500">On Avalanche C-Chain</p></div></div>
          <div className="flex gap-3"><button onClick={() => navigator.clipboard.writeText(window.location.href)} className="px-4 py-2 border rounded-lg flex items-center gap-2"><Share2 className="w-4 h-4" /> Copy Link</button></div>
        </div>
      </div>
      {showPlayer && <AudioPlayerBar src={song.audioUrl} title={song.title} artist={song.artist?.fullName} coverUrl={song.coverImageUrl} />}
    </div>
  );
}
