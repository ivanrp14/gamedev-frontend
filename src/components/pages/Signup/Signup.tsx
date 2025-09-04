import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import "../Login/Login.css";
import { useAuth } from "../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";

export const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validaciones frontend
    if (!validateEmail(form.email)) {
      setErrorMessage(t("signup.invalidEmail"));
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage(t("signup.passwordMinLength"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage(t("signup.passwordsDoNotMatch"));
      return;
    }

    setIsLoading(true);

    try {
      // --- REGISTRO ---
      const registerRes = await fetch(
        "https://api.gamedev.study/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username.toLowerCase().trim(),
            fullname: form.fullName,
            email: form.email,
            password: form.password,
          }),
          credentials: "include", // cookies
        }
      );

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        let backendMessage = errorData.message || t("signup.registerError");

        if (errorData.code === "EMAIL_TAKEN") {
          backendMessage = t("signup.emailAlreadyRegistered");
        } else if (errorData.code === "USERNAME_TAKEN") {
          backendMessage = t("signup.usernameAlreadyRegistered");
        }

        throw new Error(backendMessage);
      }

      // --- LOGIN AUTOMÁTICO ---
      const loginData = new URLSearchParams();
      loginData.append("username", form.username);
      loginData.append("password", form.password);

      const loginRes = await fetch("https://api.gamedev.study/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: loginData,
        credentials: "include", // cookies
      });

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        let loginMessage = errorData.message || t("signup.registerFailed");

        if (errorData.code === "INVALID_CREDENTIALS") {
          loginMessage = t("signup.invalidCredentials");
        }

        throw new Error(loginMessage);
      }

      // --- ACTUALIZAR AUTH CONTEXT ---
      await login(); // fetchUser() interno del AuthProvider

      // --- NAVEGACIÓN ---
      navigate("/main", { replace: true });
    } catch (error: any) {
      setErrorMessage(error.message || t("signup.registerFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>{t("signup.createAccount")}</h1>
      <form onSubmit={handleRegister} className="signup-form">
        <div className="form-group1">
          <Input
            label={t("signup.fullName")}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <Input
            label={t("signup.email")}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label={t("signup.username")}
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group2">
          <Input
            label={t("signup.password")}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            label={t("signup.confirmPassword")}
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? t("signup.registering") : t("signup.register")}
          </Button>

          <Button
            className="goto-login-button"
            type="button"
            onClick={() => navigate("/login")}
            variant="secondary"
          >
            {t("signup.goToLogin")}
          </Button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </form>
    </div>
  );
};
