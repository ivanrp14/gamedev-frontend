import { useEffect } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";

export const AuthRedirector = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Si el usuario no tiene imagen, redirige a elegir avatar
      if (!user.profilePicture) {
        navigate("/choose-avatar");
      }
      // Si ya tiene imagen y está en rutas públicas, redirige a /main
      else if (["/login", "/signup", "/"].includes(window.location.pathname)) {
        navigate("/main");
      }
    }
  }, [user, loading, navigate]);

  return null;
};
