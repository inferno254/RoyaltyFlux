import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-songs', label: 'Songs' },
  { to: '/earnings', label: 'Earnings' },
  { to: '/settings', label: 'Settings' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} className="text-white">
        <Menu size={24} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-gray-950 p-4">
          <div className="mb-6 flex justify-end">
            <button onClick={() => setOpen(false)}><X size={24} className="text-white" /></button>
          </div>
          <nav className="space-y-2">
            {items.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block rounded-md bg-gray-900 px-4 py-3 text-white"
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
