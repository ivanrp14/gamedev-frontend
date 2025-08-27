import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ChooseAvatar.css";
import { apiClient } from "../../hooks/ApiClient";

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
        setLoading(true);
        const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=9");
        const data: any[] = await res.json();

        // Aseguramos que cada objeto tenga id y url
        const formatted: CatImage[] = data.map((img: any, index: number) => ({
          id: img.id || index.toString(),
          url: img.url,
        }));
        setImages(formatted);
      } catch (err) {
        console.error(err);
        setError(t("chooseAvatar.error_fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, [t]);

  const handleSelect = async (url: string) => {
    try {
      await apiClient.patch("/users/avatar", { profile_image: url });
      await refreshUser();
      navigate("/main");
    } catch (err) {
      console.error(err);
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
