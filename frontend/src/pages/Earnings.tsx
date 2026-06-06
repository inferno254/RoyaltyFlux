import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Wallet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

type Period = '7d' | '30d' | '90d' | '1y' | 'all';

export default function Earnings() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('30d');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);

  const { data } = useQuery({ queryKey: ['my-songs', period], queryFn: () => (api as any).get(`/songs?artistId=${user?.id}`).then((r: any) => r) });
  const songs = (data as any)?.songs || [];

  const total = songs.reduce((a: number, s: any) => a + (s.totalEarnings || 0), 0);
  const streams = songs.reduce((a: number, s: any) => a + (s.totalStreams || 0), 0);
  const chartData = songs.slice(0, 10).map((s: any) => ({ name: s.title.length > 12 ? s.title.slice(0, 12) + '…' : s.title, earnings: s.totalEarnings || 0 }));

  const exportCSV = () => {
    const rows = ['Song,Streams,Rate,Total Earnings'];
    songs.forEach((s: any) => rows.push(`${s.title},${s.totalStreams || 0},$0.004,${s.totalEarnings || 0}`));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'royaltyflux-earnings.csv'; a.click();
  };

  const withdraw = async () => {
    setPaying(true);
    try {
      await (api as any).post('/mpesa/pay', { amountKes: Number(amount), phoneNumber: (user as any)?.phoneNumber });
      alert('STK Push sent. Check your phone.');
      setShowWithdraw(false);
      setAmount('');
    } catch {
      // error handled by interceptor
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Earnings</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 mb-6 flex justify-between items-center">
        <div><p className="text-sm text-gray-600">Available Balance</p><p className="text-3xl font-bold">{(user?.artistProfile?.totalEarnings || 0).toLocaleString()} KES</p></div>
        <button onClick={() => setShowWithdraw(!showWithdraw)} className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2"><Wallet className="w-4 h-4" /> Withdraw</button>
      </div>
      {showWithdraw && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 mb-6 flex gap-3 items-end">
          <div className="flex-1"><label className="block text-sm font-medium mb-1">Amount (KES)</label><input type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2" value={amount} onChange={e => setAmount(e.target.value)} min={1} max={user?.artistProfile?.totalEarnings || undefined} /></div>
          <button onClick={withdraw} disabled={paying} className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-lg">{paying ? 'Processing...' : 'Send to M-Pesa'}</button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">{(['7d', '30d', '90d', '1y', 'all'] as Period[]).map((p) => <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-full text-sm font-medium ${period === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{p === '1y' ? '1Y' : p.toUpperCase()}</button>)}</div>
        <button onClick={exportCSV} className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2"><Download className="w-4 h-4" /> CSV</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5"><p className="text-sm text-gray-600">Total Earnings</p><p className="text-4xl font-bold">{(total || 0).toLocaleString()} <span className="text-lg text-gray-500">KES</span></p></div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5"><p className="text-sm text-gray-600">Total Streams</p><p className="text-4xl font-bold">{(streams || 0).toLocaleString()}</p></div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5"><p className="text-sm text-gray-600">Per Stream Rate</p><p className="text-4xl font-bold">$0.004</p></div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">Earnings by Song</h2>
        <ResponsiveContainer width="100%" height={300}><LineChart data={chartData}><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="earnings" stroke="#FF6B35" strokeWidth={2} /></LineChart></ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b"><th className="pb-2 font-medium">Song</th><th className="pb-2 font-medium">Streams</th><th className="pb-2 font-medium text-right">Earnings (KES)</th></tr></thead>
          <tbody>{songs.map((s: any) => (<tr key={s.id} className="border-b last:border-0"><td className="py-3 font-medium">{s.title}</td><td className="py-3">{(s.totalStreams || 0).toLocaleString()}</td><td className="py-3 font-bold text-right">{(s.totalEarnings || 0).toLocaleString()}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}