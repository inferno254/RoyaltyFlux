import { useState } from 'react';
import { useSongs } from '../hooks/useSongs';
import { SongCard } from '../components/song/SongCard';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { Pagination } from '../components/common/Pagination';

export default function Explore() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { data, isLoading } = useSongs({ page, limit: 20, q: q || undefined });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-3xl font-bold">Explore</h1>
      <Input placeholder="Search songs..." value={q} onChange={(e) => setQ(e.target.value)} className="mb-6" />
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((s: { id: string }) => <SongCard key={s.id} songId={s.id} />)}
          </div>
          {data?.total && (
            <div className="mt-6 flex justify-center">
              <Pagination
                page={page}
                totalPages={Math.ceil(data.total / 20)}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
