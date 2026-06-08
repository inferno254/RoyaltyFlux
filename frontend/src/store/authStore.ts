import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  role: string | null;
  setUser: (id: string | null, role: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: null,
  setUser: (userId, role) => set({ userId, role }),
  clear: () => set({ userId: null, role: null }),
}));
