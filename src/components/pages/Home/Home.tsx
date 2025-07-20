import React from "react";
import { Container } from "../../ui/Container";
import { Title } from "../../ui/Title";
import { Button } from "../../ui/Button";
import { Section } from "../../ui/Section";
import { FaGoogle, FaGithub, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Home.css";

export const Home: React.FC = () => {
  const handleLogin = () => {};
  const handleSignup = () => {};
  const handleGoogleOAuth = () => {};
  const handleGithubOAuth = () => {};

  return (
    <main>
      <Container className="home-container">
        <Section>
          <Title level={1}>GameDev UPC</Title>
          <p className="home-subtitle">
            Asociación de estudiantes de la EPSEVG apasionados por crear mundos
            interactivos.
          </p>
        </Section>

        <Section>
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
        </Section>
      </Container>
    </main>
  );
};
