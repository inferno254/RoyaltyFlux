import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/constants/app';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '+254', password: '', confirmPassword: '', role: 'ARTIST' as const });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
    setLoading(true);
    try { await register({ ...form, phoneNumber: form.phone }); nav('/dashboard'); }
    catch {}
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-lg space-y-4 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold">Create account</h2>
        <p className="text-gray-600">Start earning instant royalties today</p>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input className="w-full border border-gray-300 rounded-lg px-4 py-2" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone (+254)</label>
          <div className="flex"><span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-100 text-gray-600">+254</span><input className="w-full border border-gray-300 rounded-r-lg px-4 py-2" value={form.phone.slice(4)} onChange={(e) => setForm({ ...form, phone: '+254' + e.target.value })} required /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" minLength={8} className="w-full border border-gray-300 rounded-lg px-4 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
          <select className="w-full border border-gray-300 rounded-lg px-4 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>{ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">{loading ? 'Creating...' : 'Create Account'}</button>
        <p className="text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-primary font-medium">Login</Link></p>
      </form>
    </div>
  );
}
