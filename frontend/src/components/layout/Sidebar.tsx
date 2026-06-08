import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Home, Music, DollarSign, Upload, Settings, ShieldCheck, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const items = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/my-songs', label: 'My Songs', icon: Music },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { user } = useAuth();
  const adminItem = { to: '/admin', label: 'Admin', icon: ShieldCheck };
  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-800 bg-gray-950 p-3 md:block">
      <nav className="space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-brand-600/20 text-brand-300'
                  : 'text-gray-300 hover:bg-gray-900 hover:text-white',
              )
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
        {user?.role === 'ADMIN' && (
          <NavLink
            to={adminItem.to}
            className={({ isActive }) =>
              cn(
                'mt-4 flex items-center gap-3 rounded-md border border-gray-800 px-3 py-2 text-sm transition',
                isActive ? 'bg-yellow-600/20 text-yellow-300' : 'text-gray-300 hover:bg-gray-900',
              )
            }
          >
            <BarChart3 size={16} /> {adminItem.label}
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
