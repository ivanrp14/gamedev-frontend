import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function RedirectToProperPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? (
    <Navigate to="/main" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}
export default RedirectToProperPage;
