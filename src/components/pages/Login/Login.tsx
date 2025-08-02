import React from "react";
import { useTranslation } from "react-i18next"; // Importamos hook i18n
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import "../Login/Login.css";
import useFormHandler from "../../../hooks/useFormHandler";
import { useAuth } from "../../../hooks/AuthProvider";
import { Title } from "../../ui/Title";

export const Login: React.FC = () => {
  const { t } = useTranslation();

  const { login, loading } = useAuth();
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

  if (loading) return <p>{t("login.loadingSession")}</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!values.username || !values.password) {
      setErrorMessage(t("login.usernamePasswordRequired"));
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
        throw new Error(error.detail || t("login.loginFailed"));
      }

      const data = await res.json();
      await login(data.access_token);
      localStorage.setItem("access_token", data.access_token);
      // ✅ redirige inmediatamente
    } catch (err: any) {
      setErrorMessage(err.message || t("login.somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Title>{t("login.loginTitle")}</Title>
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label={t("login.usernameLabel")}
          name="username"
          value={values.username}
          onChange={(e) => handleChange("username", e.target.value)}
          required
        />
        <Input
          label={t("login.passwordLabel")}
          name="password"
          type="password"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? t("login.loading") : t("login.loginButton")}
        </Button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};
