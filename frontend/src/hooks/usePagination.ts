import { useState } from 'react';

export function usePagination(initial = { page: 1, limit: 20 }) {
  const [state, setState] = useState(initial);
  return {
    ...state,
    next: () => setState((s) => ({ ...s, page: s.page + 1 })),
    prev: () => setState((s) => ({ ...s, page: Math.max(1, s.page - 1) })),
    setPage: (page: number) => setState((s) => ({ ...s, page })),
  };
}
