import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import "../Login/Login.css";
import useFormHandler from "../../hooks/useFormHandler";
import { useAuth } from "../../hooks/AuthProvider";
import { Title } from "../../ui/Title";
import { apiClient } from "../../hooks/ApiClient";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/main";

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
      await apiClient.login(values.username, values.password);
      await login(); // refresca el usuario desde /me
      navigate(redirectUrl, { replace: true }); // 👈 redirige donde toque
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
