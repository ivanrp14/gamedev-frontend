import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mientras carga la sesión, muestra un loader (o null si prefieres)
  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  if (!isAuthenticated) {
    // Guardamos la ruta actual (incluyendo query params) para redirigir después del login
    const redirectParam = encodeURIComponent(
      location.pathname + location.search
    );
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  return <>{children}</>;
};
