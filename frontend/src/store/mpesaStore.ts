import { create } from 'zustand';

interface MpesaState {
  pendingCheckoutId: string | null;
  setPending: (id: string | null) => void;
}

export const useMpesaStore = create<MpesaState>((set) => ({
  pendingCheckoutId: null,
  setPending: (pendingCheckoutId) => set({ pendingCheckoutId }),
}));
