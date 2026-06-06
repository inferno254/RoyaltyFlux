import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Play } from 'lucide-react';
import { api } from '@/lib/api';

export default function ArtistProfile() {
  const { id } = useParams();
  const { data: artist, isLoading } = useQuery({ queryKey: ['artist', id], queryFn: () => (api as any).get(`/artists/${id}`).then((r: any) => r), enabled: !!id });

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (!artist) return <div className="text-center py-12">Artist not found.</div>;

  return (
    <div>
      <div className="h-48 bg-gradient-to-r from-primary to-secondary" />
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end gap-4 -mt-16">
          <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg"><div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-500">{artist.stageName[0]}</div></div>
          <div className="mb-2"><h1 className="text-3xl font-bold">{artist.stageName}</h1><p className="text-gray-600">{artist.genre}</p></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {[{ l: 'Songs', v: artist.songs?.length || 0 }, { l: 'Streams', v: artist.totalStreams }, { l: 'Listeners', v: artist.monthlyListeners }, { l: 'Earnings', v: `${artist.totalEarnings?.toLocaleString()} KES` }].map((s, i) => (<div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 text-center"><p className="text-2xl font-bold">{s.v}</p><p className="text-sm text-gray-600">{s.l}</p></div>))}
        </div>
        <h2 className="text-2xl font-bold mb-4">Songs</h2>
        {artist.songs?.length === 0 ? <p className="text-gray-500 text-center py-8">No songs uploaded yet.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16">
            {artist.songs?.map((s: any) => (
              <a key={s.id} href={`/songs/${s.id}`} className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-100"><img src={s.coverImageUrl} alt="" className="w-full h-full object-cover" /></div>
                <div className="p-3"><h3 className="font-bold">{s.title}</h3><p className="text-sm text-gray-600">{(s.totalStreams || 0).toLocaleString()} streams</p></div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
