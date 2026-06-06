import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); nav('/dashboard'); }
    catch { /* toast handled by interceptor */ }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center text-white p-12">
        <div className="max-w-md">
          <Flame className="w-16 h-16 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Constant Royalty Flow</h1>
          <p className="text-lg opacity-90">Artists get paid instantly. No middlemen. No 6-month delays.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-md space-y-4">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-gray-600">Login to manage your royalties</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
          <p className="text-center text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-primary font-medium">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
