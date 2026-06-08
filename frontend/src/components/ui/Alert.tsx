import { ReactNode } from 'react';

export function Alert({ type = 'info', children }: { type?: 'info' | 'success' | 'warning' | 'error'; children: ReactNode }) {
  const map = {
    info: 'bg-blue-900/30 border-blue-800 text-blue-200',
    success: 'bg-green-900/30 border-green-800 text-green-200',
    warning: 'bg-yellow-900/30 border-yellow-800 text-yellow-200',
    error: 'bg-red-900/30 border-red-800 text-red-200',
  };
  return <div className={`rounded-md border p-3 text-sm ${map[type]}`}>{children}</div>;
}
