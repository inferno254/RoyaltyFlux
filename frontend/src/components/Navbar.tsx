import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const active = (p: string) => loc.pathname === p;

  const links = [
    { to: '/', label: 'Home' },
    ...(isAuthenticated ? [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/upload', label: 'Upload' },
      { to: '/earnings', label: 'Earnings' },
      { to: '/settings', label: 'Settings' },
    ] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary"><Flame className="w-6 h-6" /> RoyaltyFlux</Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (<Link key={l.to} to={l.to} className={`font-medium transition-colors ${active(l.to) ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>{l.label}</Link>))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pl-1 pr-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold"><User className="w-4 h-4" /></div>
                  <span className="text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                  <button onClick={logout} className="text-xs text-red-500 ml-1"><LogOut className="w-3 h-3" /></button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90">Get Started</Link>
              </div>
            )}
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}><Menu className="w-6 h-6" /></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 px-4 py-3 space-y-2 relative">
          {links.map((l) => (<Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`block py-2 font-medium ${active(l.to) ? 'text-primary' : 'text-gray-600'}`}>{l.label}</Link>))}
          <div className="pt-2 border-t">
            {isAuthenticated ? <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left text-red-500 font-medium py-2">Logout</button> : <div className="flex gap-3"><Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 font-medium text-gray-700 border rounded-lg">Login</Link><Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2 font-medium bg-primary text-white rounded-lg">Get Started</Link></div>}
          </div>
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
        </div>
      )}
    </nav>
  );
}
