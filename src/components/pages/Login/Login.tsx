import React from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import "../Login/Login.css";
import useFormHandler from "../../../hooks/useFormHandler";
import { useAuth } from "../../../hooks/AuthProvider";
import { Navigate } from "react-router-dom";

export const Login: React.FC = () => {
  const { isAuthenticated, login, loading } = useAuth();

  const {
    values,
    errorMessage,
    isLoading,
    setErrorMessage,
    setIsLoading,
    handleChange,
  } = useFormHandler({
    username: "",
    password: "",
  });

  if (loading) return <p>Cargando sesión...</p>;
  if (isAuthenticated) return <Navigate to="/main" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!values.username || !values.password) {
      setErrorMessage("Usuario y contraseña requeridos.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", values.username);
      formData.append("password", values.password);

      const res = await fetch("https://api.gamedev.study/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Login fallido");
      }

      const data = await res.json();
      login(data.access_token);
      localStorage.setItem("access_token", data.access_token);
    } catch (err: any) {
      setErrorMessage(err.message || "Algo salió mal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label="Nombre de Usuario"
          name="username"
          value={values.username}
          onChange={(e) => handleChange("username", e.target.value)}
          required
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </Button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};
