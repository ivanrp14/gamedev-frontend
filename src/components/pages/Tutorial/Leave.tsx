import React, { useState } from "react";
import "./Tutorial.css";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";
const Leave: React.FC = () => {
  const { user } = useAuth(); // Obtén el usuario logueado desde el contexto
  const navigate = useNavigate();

  const handleLeave = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    const username = user.username; // Usa el nombre de usuario del usuario logueado
    console.log("Username:", username);
    try {
      const response = await fetch("https://api.gamedev.study/marbles/leave", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        navigate("/main"); // Redirige a la página de Home
      } else {
        console.error("Error en la petición:", response.statusText);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  return (
    <div className="container">
      <h2>Thanks For Playing</h2>
      <div className="input-container"></div>

      <Button onClick={handleLeave}>Leave</Button>
    </div>
  );
};

export default Leave;
