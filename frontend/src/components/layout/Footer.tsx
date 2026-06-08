import { Link } from 'react-router-dom';
import { APP_NAME } from '../../lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 px-4 py-8 text-sm text-gray-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <p className="mb-2 text-base font-bold text-white">{APP_NAME}</p>
          <p>Constant royalty flow for East African artists.</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">Product</h4>
          <ul className="space-y-1">
            <li><Link to="/explore" className="hover:text-white">Explore</Link></li>
            <li><Link to="/marketplace" className="hover:text-white">Marketplace</Link></li>
            <li><Link to="/upload" className="hover:text-white">Upload</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">Company</h4>
          <ul className="space-y-1">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">Built in</h4>
          <p>Ongata Rongai, Kajiado County, Kenya 🇰🇪</p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-4 text-center text-xs">
        © {new Date().getFullYear()} {APP_NAME}. MIT License.
      </div>
    </footer>
  );
}
