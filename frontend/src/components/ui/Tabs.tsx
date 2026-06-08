import { useState, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ tabs, defaultId }: { tabs: Tab[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);
  return (
    <div>
      <div className="flex border-b border-gray-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              'border-b-2 px-4 py-2 text-sm font-medium transition',
              active === t.id
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-gray-400 hover:text-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
