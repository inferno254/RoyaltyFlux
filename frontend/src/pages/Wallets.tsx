import { useQuery } from '@tanstack/react-query';
import { Wallet } from 'lucide-react';
import { api } from '@/lib/api';

export default function Wallets() {
  const { data } = useQuery({ queryKey: ['songs'], queryFn: () => (api as any).get('/songs?limit=10').then((r: any) => r) });
  const songs = (data as any)?.songs || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-6">
        <Wallet className="w-12 h-12 text-primary mb-4" />
        <p className="text-lg font-medium mb-2">Connect your wallet</p>
        <p className="text-sm text-gray-500">Connect MetaMask or any Web3 wallet to view your NFTs and earnings on Avalanche.</p>
      </div>
      <h2 className="text-xl font-bold mb-4">Your Songs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((s: any) => (
          <div key={s.id} className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            <img src={s.coverImageUrl} alt="" className="w-full aspect-video object-cover" />
            <div className="p-3"><p className="font-bold truncate">{s.title}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
