import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">Page not found.</p>
        <Link to="/" className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-lg">Go Home</Link>
      </div>
    </div>
  );
}
