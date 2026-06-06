import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Music, TrendingUp, Upload, DollarSign, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ['songs'], queryFn: () => (api as any).get('/songs?limit=100').then((r: any) => r) });
  const mySongs = (data as any)?.songs?.filter((s: any) => s.artistId === user?.id) || [];

  const totalEarnings = user?.artistProfile?.totalEarnings || 0;
  const totalStreams = mySongs.reduce((a: number, s: any) => a + (s.totalStreams || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.fullName?.split(' ')[0]}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{ label: 'Total Earnings', val: `${totalEarnings.toLocaleString()} KES`, icon: DollarSign }, { label: 'Total Streams', val: totalStreams.toLocaleString(), icon: TrendingUp }, { label: 'Active Songs', val: mySongs.length, icon: Music }, { label: 'Collaborations', val: mySongs.reduce((a: number, s: any) => a + (s.collaborators?.length || 0), 0), icon: Upload }].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex items-center gap-4">
            <s.icon className="w-10 h-10 text-primary" />
            <div><p className="text-sm text-gray-600">{s.label}</p><p className="text-2xl font-bold">{s.val}</p></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Songs</h2>
        <Link to="/upload" className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> Upload New</Link>
      </div>
      {mySongs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-12 text-center">
          <Music className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">No songs yet</p>
          <Link to="/upload" className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-lg">Upload Your First Song</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mySongs.map((s: any) => (
            <Link key={s.id} to={`/songs/${s.id}`} className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gray-100 overflow-hidden"><img src={s.coverImageUrl} alt={s.title} className="w-full h-full object-cover" /></div>
              <div className="p-3">
                <h3 className="font-bold truncate">{s.title}</h3>
                <p className="text-sm text-gray-600">{(s.totalStreams || 0).toLocaleString()} streams</p>
                <p className="text-sm font-medium text-primary">{(s.totalEarnings || 0).toLocaleString()} KES</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
