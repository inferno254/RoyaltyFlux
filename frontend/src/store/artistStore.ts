import { create } from 'zustand';

interface ArtistState {
  followingIds: Set<string>;
  follow: (id: string) => void;
  unfollow: (id: string) => void;
  isFollowing: (id: string) => boolean;
}

export const useArtistStore = create<ArtistState>((set, get) => ({
  followingIds: new Set<string>(),
  follow: (id) => {
    const next = new Set(get().followingIds);
    next.add(id);
    set({ followingIds: next });
  },
  unfollow: (id) => {
    const next = new Set(get().followingIds);
    next.delete(id);
    set({ followingIds: next });
  },
  isFollowing: (id) => get().followingIds.has(id),
}));
