import { Users, Music, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return <div className="text-center py-12">Access denied.</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[{ l: 'Total Users', v: '—', i: Users }, { l: 'Total Songs', v: '—', i: Music }, { l: 'Revenue Today', v: '— KES', i: DollarSign }, { l: 'System Status', v: 'OK', i: AlertCircle }].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex items-center gap-4">
            <s.i className="w-10 h-10 text-primary" />
            <div><p className="text-sm text-gray-600">{s.l}</p><p className="text-2xl font-bold">{s.v}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <p className="text-gray-600">Song verification queue, user management, and transaction monitoring coming soon.</p>
      </div>
    </div>
  );
}
