import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Plus, X } from 'lucide-react';

interface Collab {
  userId: string;
  shareBps: number;
  email: string;
}

export function CollaboratorSplits({
  collaborators,
  onChange,
}: {
  collaborators: Collab[];
  onChange: (c: Collab[]) => void;
}) {
  const [error, setError] = useState('');

  const total = collaborators.reduce((s, c) => s + c.shareBps, 0);

  const add = () => {
    if (total + 0 > 10_000) return;
    onChange([...collaborators, { userId: '', email: '', shareBps: 0 }]);
  };

  const update = (i: number, patch: Partial<Collab>) => {
    const next = collaborators.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(collaborators.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">Collaborator splits (must total 100%)</p>
      {error && <Alert type="error">{error}</Alert>}
      {collaborators.length === 0 ? (
        <p className="text-sm text-gray-500">Add at least one collaborator (you, if solo).</p>
      ) : (
        collaborators.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder="email"
              value={c.email}
              onChange={(e) => update(i, { email: e.target.value })}
            />
            <Input
              type="number"
              placeholder="%"
              value={c.shareBps / 100}
              onChange={(e) => update(i, { shareBps: Math.round(Number(e.target.value) * 100) })}
            />
            <Button variant="ghost" size="sm" onClick={() => remove(i)}>
              <X size={16} />
            </Button>
          </div>
        ))
      )}
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={add}>
          <Plus size={14} /> Add collaborator
        </Button>
        <p className={`text-sm ${total === 10_000 ? 'text-green-400' : 'text-red-400'}`}>
          Total: {(total / 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
