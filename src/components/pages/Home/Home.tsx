import React from "react";
import { Title } from "../../ui/Title";
import { FaGoogle, FaGithub, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../hooks/ApiClient";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (isAuthenticated) {
    navigate("/main");
    return null;
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
    window.location.href = apiClient.googleOAuthUrl();
  };

  const handleGithubOAuth = () => {
    if (isAuthenticated) {
      navigate("/main");
      return;
    }
    window.location.href = apiClient.githubOAuthUrl();
  };

  return (
    <main>
      <div className="home-container">
        <Title level={1}>{t("home.title")}</Title>
        <h3 className="home-subtitle">{t("home.subtitle")}</h3>

        <div className="button-group">
          <Button className="primary-button" onClick={handleLogin}>
            <FaSignInAlt className="btn-icon" />
            <p>
              {isAuthenticated ? t("home.go_to_dashboard") : t("home.login")}
            </p>
          </Button>
          <Button className="primary-button" onClick={handleSignup}>
            <FaUserPlus className="btn-icon" />
            <p>{t("home.signup")}</p>
          </Button>
          <Button className="oauth-button google" onClick={handleGoogleOAuth}>
            <FaGoogle className="btn-icon" />
            <p>{t("home.google")}</p>
          </Button>
          <Button className="oauth-button github" onClick={handleGithubOAuth}>
            <FaGithub className="btn-icon" />
            <p>{t("home.github")}</p>
          </Button>
        </div>
      </div>
    </main>
  );
};
