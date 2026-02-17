
import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    // If role mismatch, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
