import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';

type Props = { src: string; title: string; artist: string; coverUrl: string };
export default function AudioPlayerBar({ src, title, artist, coverUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onDur = () => setDur(a.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onDur);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('loadedmetadata', onDur); a.removeEventListener('play', onPlay); a.removeEventListener('pause', onPause); };
  }, [src]);

  const toggle = () => { if (!audioRef.current) return; playing ? audioRef.current.pause() : audioRef.current.play(); };
  const fmt = (s: number) => { if (isNaN(s)) return '0:00'; const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, '0')}`; };
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => { if (!audioRef.current) return; const t = Number(e.target.value); audioRef.current.currentTime = t; setTime(t); };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t z-50">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
        <img src={coverUrl} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
        <div className="hidden sm:block min-w-0"><p className="text-sm font-bold truncate">{title}</p><p className="text-xs text-gray-500 truncate">{artist}</p></div>
        <div className="flex-1 flex items-center gap-3 justify-center">
          <button className="text-gray-400 hover:text-gray-600"><Shuffle className="w-4 h-4" /></button>
          <button className="text-gray-700"><SkipBack className="w-5 h-5" /></button>
          <button onClick={toggle} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90">{playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}</button>
          <button className="text-gray-700"><SkipForward className="w-5 h-5" /></button>
          <button className="text-gray-400 hover:text-gray-600"><Repeat className="w-4 h-4" /></button>
        </div>
        <div className="hidden md:flex items-center gap-2 w-48">
          <span className="text-xs text-gray-500 w-10 text-right">{fmt(time)}</span>
          <input type="range" min={0} max={dur || 100} step={0.1} value={time} onChange={seek} className="flex-1 accent-primary h-1" />
          <span className="text-xs text-gray-500 w-10">{fmt(dur)}</span>
        </div>
      </div>
    </div>
  );
}
