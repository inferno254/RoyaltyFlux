import { create } from 'zustand';

interface RoyaltyState {
  totalEarnings: number;
  pendingPayout: number;
  setEarnings: (total: number, pending: number) => void;
}

export const useRoyaltyStore = create<RoyaltyState>((set) => ({
  totalEarnings: 0,
  pendingPayout: 0,
  setEarnings: (totalEarnings, pendingPayout) => set({ totalEarnings, pendingPayout }),
}));
