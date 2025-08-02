import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import "../Login/Login.css";
import { useAuth } from "../../../hooks/AuthProvider";

export const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
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
      const response = await fetch("https://api.gamedev.study/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          fullname: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t("signup.registerError"));
      }

      const data = await response.json();
      login(data.access_token);
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("signup.registering") : t("signup.register")}
          </Button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};
