import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Tutorial.css";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";

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

    const username = user.username;

    console.log(t("marble.username"), username);
    console.log(t("marble.color"), color);

    try {
      const response = await fetch("https://api.gamedev.study/marbles/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          color: color,
          username: username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(t("marble.serverResponse"), data);
        navigate("/leave");
      } else {
        console.error(t("marble.requestError"), response.statusText);
        navigate("/leave");
      }
    } catch (error) {
      console.error(t("marble.apiConnectionError"), error);
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
