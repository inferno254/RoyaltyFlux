import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { Song } from '@/types';

type Props = { song: Song };
export default function SongCard({ song }: Props) {
  return (
    <Link to={`/songs/${song.id}`} className="group bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img src={song.coverImageUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-primary ml-0.5" />
          </div>
        </div>
        {song.totalStreams < 100 && <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>}
      </div>
      <div className="p-3">
        <h3 className="font-bold truncate">{song.title}</h3>
        <p className="text-sm text-gray-600 truncate">{song.artist?.artistProfile?.stageName || song.artist?.fullName}</p>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{(song.totalStreams || 0).toLocaleString()} streams</span>
          <span className="text-primary font-medium">{(song.totalEarnings || 0).toLocaleString()} KES</span>
        </div>
      </div>
    </Link>
  );
}
