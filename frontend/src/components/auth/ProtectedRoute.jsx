import { Navigate } from "react-router-dom";
import { authService } from "@/services/authService";

export function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
