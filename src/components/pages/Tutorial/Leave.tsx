import React from "react";
import { useTranslation } from "react-i18next";
import "./Tutorial.css";
import { useAuth } from "../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";
import { apiClient } from "../../hooks/ApiClient";

const Leave: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLeave = async () => {
    if (!user) {
      console.error(t("leave.noUserLoggedIn"));
      return;
    }

    try {
      const data = await apiClient.delete(
        `/marbles/leave?username=${encodeURIComponent(user.username)}`
      );
      console.log("Leave response:", data);
      navigate("/main");
    } catch (error) {
      console.error(t("leave.apiConnectionError"), error);
    }
  };

  return (
    <div className="container">
      <h2>{t("leave.thanksForPlaying")}</h2>
      <div className="input-container"></div>
      <Button onClick={handleLeave}>{t("leave.leave")}</Button>
    </div>
  );
};

export default Leave;
