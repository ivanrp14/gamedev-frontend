import React from "react";
import { Title } from "../../ui/Title";
import { FaGoogle, FaGithub, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleGoogleOAuth = () => {
    window.location.href = "https://api.gamedev.study/auth/google/login";
  };

  const handleGithubOAuth = () => {
    window.location.href = "https://api.gamedev.study/auth/github/login";
  };

  return (
    <main>
      <div className="home-container">
        <Title level={1}>GameDev UPC</Title>
        <p className="home-subtitle">
          Asociación de estudiantes de la EPSEVG apasionados por crear mundos
          interactivos.
        </p>

        <div className="button-group">
          <button className="primary-button" onClick={handleLogin}>
            <FaSignInAlt className="btn-icon" /> Login
          </button>
          <button className="primary-button" onClick={handleSignup}>
            <FaUserPlus className="btn-icon" /> Sign Up
          </button>
          <button className="oauth-button google" onClick={handleGoogleOAuth}>
            <FaGoogle className="btn-icon" /> Google
          </button>
          <button className="oauth-button github" onClick={handleGithubOAuth}>
            <FaGithub className="btn-icon" /> GitHub
          </button>
        </div>
      </div>
    </main>
  );
};
