import { createContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';
import { getToken, getUser, setToken, setUser, clearAuth } from '../lib/auth';

export interface User {
  id: string;
  email: string;
  role: 'ARTIST' | 'COLLABORATOR' | 'LISTENER' | 'ADMIN';
  walletAddress: string | null;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(getUser<User>());
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      api
        .get('/users/me')
        .then((data) => {
          setUserState(data.data as User);
          setUser(data.data);
        })
        .catch(() => clearAuth());
    }
  }, [token, user]);

  const login: AuthContextValue['login'] = async (email, password) => {
    setLoading(true);
    try {
      const data = (await api.post('/auth/login', { email, password })).data as {
        accessToken: string;
        refreshToken: string;
        user: User;
      };
      setTokenState(data.accessToken);
      setToken(data.accessToken);
      setUserState(data.user);
      setUser(data.user);
      localStorage.setItem('refreshToken', data.refreshToken);
    } finally {
      setLoading(false);
    }
  };

  const register: AuthContextValue['register'] = async (payload) => {
    setLoading(true);
    try {
      const data = (await api.post('/auth/register', payload)).data as {
        accessToken: string;
        refreshToken: string;
        user: User;
      };
      setTokenState(data.accessToken);
      setToken(data.accessToken);
      setUserState(data.user);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout: AuthContextValue['logout'] = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignore
    }
    clearAuth();
    setUserState(null);
    setTokenState(null);
  };

  const refresh: AuthContextValue['refresh'] = async () => {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) throw new Error('no refresh token');
    const data = (await api.post('/auth/refresh', { refreshToken: rt })).data as {
      accessToken: string;
      refreshToken: string;
    };
    setTokenState(data.accessToken);
    setToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
