import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/User';

interface Props {
  children: ReactNode;
  /** Restrict to one role. Shoppers are sent back to the shop, admins to /admin. */
  role?: Role;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/shop'} replace />;
  return <>{children}</>;
}
