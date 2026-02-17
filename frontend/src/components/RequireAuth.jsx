
import { useAuth } from "../context/useAuthHook";
import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({ children, role, roles, redirectTo = "/auth" }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const allowedRoles = roles || (role ? [role] : null);
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If role mismatch, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
