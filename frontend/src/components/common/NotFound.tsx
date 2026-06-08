import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-6 text-center text-white">
      <h1 className="mb-2 text-6xl font-extrabold text-brand-500">404</h1>
      <p className="mb-6 text-lg text-gray-300">Page not found</p>
      <Link to="/">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
