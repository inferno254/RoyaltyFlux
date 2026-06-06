import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (d: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({} as any);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setIsLoading(false);
    (async () => {
      try { const data = await api.get('/auth/me'); setUser(data as any); }
      catch { localStorage.removeItem('token'); setUser(null); }
      finally { setIsLoading(false); }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = (await api.post('/auth/login', { email, password })) as any;
    localStorage.setItem('token', token);
    setUser(user);
  };
  const register = async (data: any) => {
    const { user, token } = (await api.post('/auth/register', data)) as any;
    localStorage.setItem('token', token);
    setUser(user);
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const fetchProfile = async () => { try { const data = await api.get('/auth/me'); setUser(data as any); } catch { logout(); } };

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, fetchProfile }}>{children}</AuthContext.Provider>;
}
