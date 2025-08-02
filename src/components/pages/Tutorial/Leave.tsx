import React from "react";
import { useTranslation } from "react-i18next";
import "./Tutorial.css";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";

const Leave: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLeave = async () => {
    if (!user) {
      console.error(t("leave.noUserLoggedIn"));
      return;
    }

    const username = user.username;
    console.log("Username:", username);
    try {
      const response = await fetch("https://api.gamedev.study/marbles/leave", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data);
        navigate("/main");
      } else {
        console.error(t("leave.requestError"), response.statusText);
      }
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
