import { Spinner } from '../ui/Spinner';

export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <Spinner size="lg" />
    </div>
  );
}
