import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Inbox } from 'lucide-react';

interface Props {
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, message, actionLabel, actionHref }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-800 bg-gray-900/30 p-10 text-center">
      <Inbox className="mb-3 h-12 w-12 text-gray-600" />
      <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
      {message && <p className="mb-4 text-sm text-gray-400">{message}</p>}
      {actionLabel && actionHref && (
        <Link to={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
