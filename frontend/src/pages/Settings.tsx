import { useState, useEffect } from 'react';
import { User, Lock, Wallet } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'profile' | 'security' | 'mpesa';

export default function Settings() {
  const { user, fetchProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [name, setName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [mpesa, setMpesa] = useState(user?.mpesaNumber || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setName(user?.fullName || ''); setPhone(user?.phoneNumber || ''); setMpesa(user?.mpesaNumber || ''); }, [user]);

  const save = async () => {
    setSaving(true);
    try { await api.put('/auth/profile', { fullName: name, phoneNumber: phone, mpesaNumber: mpesa }); toast.success('Profile updated'); fetchProfile(); }
    catch {}
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="flex gap-4 mb-6 border-b overflow-x-auto">
        {[{ k: 'profile', l: 'Profile', i: User }, { k: 'security', l: 'Security', i: Lock }, { k: 'mpesa', l: 'M-Pesa', i: Wallet }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k as Tab)} className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap ${tab === t.k ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}><t.i className="w-4 h-4" />{t.l}</button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 max-w-xl space-y-4">
        {(tab === 'profile' || tab === 'mpesa') && (
          <>
            {tab === 'profile' && <><label className="block text-sm font-medium mb-1">Full Name</label><input className="w-full border border-gray-300 rounded-lg px-4 py-2" value={name} onChange={(e) => setName(e.target.value)} /></>}
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <div className="flex"><span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-100 text-gray-600">+254</span><input className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2" value={phone?.slice(4) || ''} onChange={(e) => setPhone('+254' + e.target.value)} /></div>
            {tab === 'mpesa' && <><label className="block text-sm font-medium mb-1">M-Pesa Number</label><input className="w-full border border-gray-300 rounded-lg px-4 py-2" value={mpesa || ''} onChange={(e) => setMpesa(e.target.value)} /><p className="text-sm text-gray-500">Number linked to your M-Pesa for payouts</p></>}
            <button onClick={save} disabled={saving} className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          </>
        )}
        {tab === 'security' && <p className="text-gray-600">Password change and 2FA coming soon.</p>}
      </div>
    </div>
  );
}
