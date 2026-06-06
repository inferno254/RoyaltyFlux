import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import Protected from '@/components/Protected';
import Guest from '@/components/Guest';
import PageLoader from '@/components/PageLoader';

const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UploadSong = lazy(() => import('@/pages/UploadSong'));
const SongDetail = lazy(() => import('@/pages/SongDetail'));
const Earnings = lazy(() => import('@/pages/Earnings'));
const Settings = lazy(() => import('@/pages/Settings'));
const ArtistProfile = lazy(() => import('@/pages/ArtistProfile'));
const Admin = lazy(() => import('@/pages/Admin'));
const Wallets = lazy(() => import('@/pages/Wallets'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Guest><Login /></Guest> },
  { path: '/register', element: <Guest><Register /></Guest> },
  { path: '/songs/:id', element: <SongDetail /> },
  { path: '/artist/:id', element: <ArtistProfile /> },
  { path: '/dashboard', element: <Protected><Dashboard /></Protected> },
  { path: '/upload', element: <Protected><UploadSong /></Protected> },
  { path: '/earnings', element: <Protected><Earnings /></Protected> },
  { path: '/settings', element: <Protected><Settings /></Protected> },
  { path: '/admin', element: <Protected><Admin /></Protected> },
  { path: '/wallets', element: <Protected><Wallets /></Protected> },
  { path: '*', element: <NotFound /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} fallbackElement={<PageLoader />} />;
}
