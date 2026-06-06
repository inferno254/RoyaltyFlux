import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Music } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import { GENRES } from '@/constants/app';
import type { Genre } from '@/types';

export default function Home() {
  const [genre, setGenre] = useState<Genre | ''>('');
  const { data } = useQuery({ queryKey: ['songs', genre], queryFn: () => (api as any).get(`/songs?limit=24${genre ? `&genre=${genre}` : ''}`).then((r: any) => r) });
  const songs = (data as any)?.songs || [];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Constant Royalty Flow</h1>
          <p className="text-xl opacity-90 mb-8">Artists get paid instantly. No middlemen. No 6-month delays. Pure royalty flow.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="bg-white text-primary font-bold py-3 px-6 rounded-lg">Start Uploading</Link>
            <Link to="/register" className="border border-white font-bold py-3 px-6 rounded-lg">Browse Music</Link>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[{ icon: TrendingUp, l: '50M+ KES', d: 'Paid to artists' }, { icon: Music, l: '10K+', d: 'Songs minted' }, { icon: Users, l: '25K+', d: 'Artists onboarded' }].map((s, i) => (
            <div key={i}><s.icon className="w-8 h-8 mx-auto text-primary mb-2" /><p className="font-bold text-lg">{s.l}</p><p className="text-gray-600 text-sm">{s.d}</p></div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold mb-4">Browse</h2>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setGenre('')} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${!genre ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>All</button>
          {GENRES.map((g) => <button key={g.value} onClick={() => setGenre(g.value)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${genre === g.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{g.label}</button>)}
        </div>
        {songs.length === 0 ? (
          <div className="text-center py-16 text-gray-500"><Music className="w-16 h-16 mx-auto mb-4 opacity-30" /><p className="text-lg">No songs yet. Be the first to upload!</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {songs.map((s: any) => (
              <Link key={s.id} to={`/songs/${s.id}`} className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img src={s.coverImageUrl} alt={s.title} className="w-full h-full object-cover" />
                  {s.totalStreams < 100 && <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>}
                </div>
                <div className="p-3">
                  <h3 className="font-bold truncate">{s.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{s.artist?.artistProfile?.stageName || s.artist?.fullName}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500"><span>{(s.totalStreams || 0).toLocaleString()} streams</span><span className="text-primary font-medium">{(s.totalEarnings || 0).toLocaleString()} KES</span></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
