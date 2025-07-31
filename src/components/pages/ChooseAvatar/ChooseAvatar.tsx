import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./ChooseAvatar.css";

interface CatImage {
  id: string;
  url: string;
}

const ChooseAvatar: React.FC = () => {
  const [images, setImages] = useState<CatImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshUser } = useAuth();
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
      const response = await fetch("https://api.gamedev.study/users/avatar", {
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

      await refreshUser();
      navigate("/main");
    } catch (error) {
      console.error(error);
      setError("Error al guardar la imagen.");
    }
  };

  return (
    <div className="choose-avatar-container">
      <h1>¡Bienvenido!</h1>
      <p className="choose-avatar-subtitle">
        Aún no has elegido una foto de perfil. Selecciona una imagen para
        continuar:
      </p>

      {loading && <p className="choose-avatar-status">Cargando imágenes...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="avatar-grid">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => handleSelect(img.url)}
            className="avatar-button"
            aria-label="Seleccionar avatar"
          >
            <img src={img.url} alt="Avatar de gato" className="avatar-image" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChooseAvatar;
