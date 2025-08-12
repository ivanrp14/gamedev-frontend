import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(
          "https://api.thecatapi.com/v1/images/search?limit=9"
        );
        const data = await res.json();
        setImages(data);
      } catch (err) {
        setError(t("chooseAvatar.error_fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, [t]);

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
        throw new Error();
      }

      // ✅ Primero refrescas y esperas
      await refreshUser();

      // ✅ Luego navegas
      navigate("/main");
    } catch (error) {
      console.error(error);
      setError(t("chooseAvatar.error_save"));
    }
  };

  return (
    <div className="choose-avatar-container">
      <h1>{t("chooseAvatar.title")}</h1>
      <p className="choose-avatar-subtitle">{t("chooseAvatar.subtitle")}</p>

      {loading && (
        <p className="choose-avatar-status">{t("chooseAvatar.loading")}</p>
      )}
      {error && <p className="error-message">{error}</p>}

      <div className="avatar-grid">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => handleSelect(img.url)}
            className="avatar-button"
            aria-label={t("chooseAvatar.select_aria")}
          >
            <img
              src={img.url}
              alt={t("chooseAvatar.alt")}
              className="avatar-image"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChooseAvatar;
