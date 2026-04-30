import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Still checking if user is logged in
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin only page but user is not admin
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // All good → show the page
  return <>{children}</>;
};

export default ProtectedRoute;