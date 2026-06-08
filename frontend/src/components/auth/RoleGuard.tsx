import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RoleGuard({
  children,
  roles,
}: {
  children: ReactNode;
  roles: ('ARTIST' | 'COLLABORATOR' | 'LISTENER' | 'ADMIN')[];
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
