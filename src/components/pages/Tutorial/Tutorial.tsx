import React, { useState } from "react";
import "./Tutorial.css";
import { useAuth } from "../../../hooks/AuthProvider"; // Importa el hook useAuth
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";

const Tutorial: React.FC = () => {
  const { user } = useAuth(); // Obtén el usuario logueado desde el contexto
  const [color, setColor] = useState("#ff0000");
  const navigate = useNavigate();
  const handleJoin = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    const username = user.username; // Usa el nombre de usuario del usuario logueado

    console.log("Username:", username);
    console.log("Color:", color);

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
        console.log("Respuesta del servidor:", data);
        navigate("/leave"); // Redirige a la página de Leave
      } else {
        console.error("Error en la petición:", response.statusText);
        navigate("/leave");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  return (
    <div className="tutorial-container">
      <h2>Try It!</h2>
      <div className="input-container">
        <div className="color-picker">
          <h2>Choose your color:</h2>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleJoin}>Join</Button>
    </div>
  );
};

export default Tutorial;
