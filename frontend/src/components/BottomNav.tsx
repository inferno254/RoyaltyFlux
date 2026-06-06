import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function BottomNav() {
  const { isAuthenticated } = useAuth();
  const loc = useLocation();
  if (!isAuthenticated) return null;

  const items = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/', icon: Search, label: 'Browse' },
    { to: '/upload', icon: PlusSquare, label: 'Upload', highlight: true },
    { to: '/settings', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 md:hidden">
      <div className="flex justify-around items-center h-14">
        {items.map(({ to, icon: Icon, label, highlight }) => (
          <Link key={to} to={to} className={`flex flex-col items-center justify-center flex-1 h-full ${loc.pathname === to ? 'text-primary' : 'text-gray-500'}`}>
            {highlight ? (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center -mt-5 shadow-lg">
                <Icon className="w-5 h-5" />
              </div>
            ) : <Icon className="w-5 h-5" />}
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
