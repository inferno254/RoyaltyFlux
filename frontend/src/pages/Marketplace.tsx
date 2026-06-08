import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSongs } from '../hooks/useSongs';
import { SongCard } from '../components/song/SongCard';
import { Spinner } from '../components/ui/Spinner';
import { Pagination } from '../components/common/Pagination';

export default function Marketplace() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, isLoading } = useSongs({ page, limit: 24 });
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <button onClick={() => navigate('/upload')} className="btn-primary">Mint your song</button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data?.data?.map((s: { id: string }) => <SongCard key={s.id} songId={s.id} />)}
          </div>
          {data?.total && (
            <div className="mt-6 flex justify-center">
              <Pagination page={page} totalPages={Math.ceil(data.total / 24)} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
