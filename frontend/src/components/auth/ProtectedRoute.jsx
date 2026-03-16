import { Navigate } from "react-router-dom";
import { authService } from "@/services/authService";

export function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
