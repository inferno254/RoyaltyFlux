import { create } from 'zustand';

interface WalletState {
  address: string | null;
  chainId: number | null;
  setWallet: (address: string | null, chainId: number | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  setWallet: (address, chainId) => set({ address, chainId }),
}));
