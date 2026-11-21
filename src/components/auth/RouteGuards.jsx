import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export function RequireRole({ roles, children }) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!roles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
