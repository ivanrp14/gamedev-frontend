import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./ChooseAvatar.css"; // crea este archivo para estilos

interface CatImage {
  id: string;
  url: string;
}

const ChooseAvatar: React.FC = () => {
  const [images, setImages] = useState<CatImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(
          "https://api.thecatapi.com/v1/images/search?limit=9"
        );
        const data = await res.json();
        setImages(data);
      } catch (err) {
        setError("No se pudieron cargar las imágenes.");
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  const handleSelect = async (url: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("https://api.gamedev.study/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_image: url }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la imagen.");
      }

      // Vuelve a autenticar para actualizar el user con imagen
      const data = await response.json();
      login(token!); // refresca el contexto con fetchUser

      navigate("/main");
    } catch (error) {
      console.error(error);
      setError("Error al guardar la imagen.");
    }
  };

  return (
    <div className="choose-avatar-container">
      <h2>Elige tu avatar de gato 😺</h2>

      {loading && <p>Cargando imágenes...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="avatar-grid">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="Cat avatar"
            onClick={() => handleSelect(img.url)}
            className="avatar-image"
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseAvatar;
