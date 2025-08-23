import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Llamamos a /auth/me para verificar si la cookie de sesión funciona
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      credentials: "include", // <--- Esto envía las cookies HTTP-only
    })
      .then((res) => {
        if (!res.ok) throw new Error("No session");
        return res.json();
      })
      .then(() => {
        login().then(() => navigate("/main", { replace: true }));
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [login, navigate]);

  return <p>Autenticando…</p>;
}

export default OAuthCallback;
