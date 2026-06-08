import { useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export function SongPlayer({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) ref.current.pause();
    else ref.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3">
      <button onClick={toggle} className="rounded-full bg-brand-600 p-3 text-white hover:bg-brand-500">
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{title}</p>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (ref.current) ref.current.currentTime = v;
            setProgress(v);
          }}
          className="w-full accent-brand-500"
        />
        <p className="text-xs text-gray-500">
          {Math.floor(progress)}s / {Math.floor(duration)}s
        </p>
      </div>
      <Volume2 className="text-gray-500" size={18} />
      <audio
        ref={ref}
        src={src}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
