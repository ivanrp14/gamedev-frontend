import React from "react";
import { Title } from "../../ui/Title";
import { FaGoogle, FaGithub, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthProvider";
import { Button } from "../../ui/Button";
export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    navigate("/main");
    return null; // Evita renderizar el resto del componente
  }
  const handleLogin = () => {
    if (isAuthenticated) {
      navigate("/main");
      return;
    }
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleGoogleOAuth = () => {
    if (isAuthenticated) {
      navigate("/main");
      return;
    }
    window.location.href = "https://api.gamedev.study/auth/google/login";
  };

  const handleGithubOAuth = () => {
    if (isAuthenticated) {
      navigate("/main");
      return;
    }
    window.location.href = "https://api.gamedev.study/auth/github/login";
  };

  return (
    <main>
      <div className="home-container">
        <Title level={1}>GameDev</Title>
        <p className="home-subtitle">Asociación de estudiantes de la EPSEVG.</p>

        <div className="button-group">
          <Button className="primary-button" onClick={handleLogin}>
            <FaSignInAlt className="btn-icon" />
            {isAuthenticated ? "Go to Dashboard" : "Login"}
          </Button>
          <Button className="primary-button" onClick={handleSignup}>
            <FaUserPlus className="btn-icon" /> Sign Up
          </Button>
          <Button className="oauth-button google" onClick={handleGoogleOAuth}>
            <FaGoogle className="btn-icon" /> Google
          </Button>
          <Button className="oauth-button github" onClick={handleGithubOAuth}>
            <FaGithub className="btn-icon" /> GitHub
          </Button>
        </div>
      </div>
    </main>
  );
};
