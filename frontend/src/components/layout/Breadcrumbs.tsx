import { Link, useLocation } from 'react-router-dom';

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <nav className="mb-4 text-sm text-gray-400">
      <Link to="/" className="hover:text-white">Home</Link>
      {parts.map((p, i) => (
        <span key={i}>
          {' / '}
          <span className="text-white">{decodeURIComponent(p)}</span>
        </span>
      ))}
    </nav>
  );
}
