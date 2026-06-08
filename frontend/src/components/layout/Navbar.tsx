import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { LogOut, Upload, Music2 } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <Music2 className="text-brand-500" /> RoyaltyFlux
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/explore" className="text-sm text-gray-300 hover:text-white">Explore</Link>
          <Link to="/marketplace" className="text-sm text-gray-300 hover:text-white">Marketplace</Link>
          <Link to="/about" className="text-sm text-gray-300 hover:text-white">About</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/upload">
                <Button size="sm" variant="primary"><Upload size={16} /> Upload</Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" variant="secondary">Dashboard</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout}><LogOut size={16} /></Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button size="sm" variant="ghost">Login</Button></Link>
              <Link to="/register"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
