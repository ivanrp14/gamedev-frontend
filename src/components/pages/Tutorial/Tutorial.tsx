import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Tutorial.css";
import { useAuth } from "../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";
import { apiClient } from "../../hooks/ApiClient";

const Tutorial: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [color, setColor] = useState("#ff0000");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!user) {
      console.error(t("marble.noUserLoggedIn"));
      return;
    }

    try {
      const data = await apiClient.post("/marbles/join", {
        username: user.username,
        color,
      });
      console.log(t("marble.serverResponse"), data);
      navigate("/leave");
    } catch (error: any) {
      console.error(t("marble.requestError"), error?.message || error);
      navigate("/leave");
    }
  };

  return (
    <div className="tutorial-container">
      <h2>{t("marble.tryIt")}</h2>
      <div className="input-container">
        <div className="color-picker">
          <h2>{t("marble.chooseColor")}</h2>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleJoin}>{t("marble.join")}</Button>
    </div>
  );
};

export default Tutorial;
