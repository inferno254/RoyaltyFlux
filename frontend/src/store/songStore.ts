import { create } from 'zustand';

interface SongState {
  currentSongId: string | null;
  isPlaying: boolean;
  play: (id: string) => void;
  pause: () => void;
  toggle: () => void;
}

export const useSongStore = create<SongState>((set) => ({
  currentSongId: null,
  isPlaying: false,
  play: (id) => set({ currentSongId: id, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
}));
