import "./MyStats.css";
import { User } from "../../../interfaces/User";
import { VideoGame } from "../../../interfaces/Videogame";
import { useState } from "react";
import { useAuth } from "../../../hooks/AuthProvider";
import { Section } from "../../ui/Section";
import DefaultProfile from "../../../images/default-profile.png";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";
import { Box } from "../../ui/Box";

function MyStats() {
  const { user } = useAuth();
  if (!user) return null;
  const currentUser = user as User;

  return (
    <div className="mystats-container">
      <ProfileSection user={currentUser} />
      <StatisticsSection
        totalPlayTime={currentUser.totalPlayTime()}
        totalScore={currentUser.total_score}
        highestScoringGame={currentUser.highestScoringGame()}
      />
      <GamesSection games={currentUser.gamesPlayed} />
    </div>
  );
}

function ProfileSection({ user }: { user: User }) {
  const { logout, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setError(null);

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No estás autenticado. Vuelve a iniciar sesión.");
      }

      const updateData: Record<string, string> = {};
      if (formData.username && formData.username !== user.username) {
        updateData.username = formData.username;
      }
      if (formData.fullname && formData.fullname !== user.fullname) {
        updateData.fullname = formData.fullname;
      }
      if (formData.email && formData.email !== user.email) {
        updateData.email = formData.email;
      }
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }

      if (Object.keys(updateData).length === 0) {
        setEditing(false);
        return;
      }

      const response = await fetch(
        "https://api.gamedev.study/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ aseguramos que no es null
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error updating profile");
      }

      await refreshUser();
      setEditing(false);
    } catch (err: any) {
      console.error("Failed to update user", err);
      setError(err.message || t("mystats.errorUpdating"));
    }
  };
  const handleDeletePicture = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No estás autenticado. Vuelve a iniciar sesión.");
      }

      const response = await fetch("https://api.gamedev.study/users/avatar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error deleting profile picture");
      }

      await refreshUser();
    } catch (err: any) {
      console.error("Failed to delete profile picture", err);
      setError(err.message || t("mystats.errorDeleting"));
    }
  };
  return (
    <Section className="section">
      <div className="profile-header">
        <img
          src={user.profile_image || DefaultProfile}
          alt={`Profile of ${user.username}`}
          className="profile-picture"
        />
        <h1 className="username">{user.username}</h1>
        <Button onClick={logout} className="logout-button">
          <p>{t("mystats.logout")}</p>
        </Button>
      </div>

      {editing ? (
        <div className="edit-form">
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={t("mystats.username")}
          />
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder={t("mystats.fullName")}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("mystats.email")}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("mystats.newPassword")}
          />
          <Button
            onClick={handleDeletePicture}
            className="delete-picture-button"
          >
            <p>{t("mystats.deleteProfilePicture")}</p>
          </Button>
          <div className="edit-actions">
            <Button onClick={handleSave}>{t("mystats.save")}</Button>
            <Button onClick={() => setEditing(false)}>
              <p>{t("mystats.cancel")}</p>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="info-grid">
            <Box label={t("mystats.username")} value={user.username} />
            <Box label={t("mystats.fullName")} value={user.fullname} />
            <Box label={t("mystats.email")} value={user.email} />
          </div>
          <Button onClick={() => setEditing(true)} className="edit-button">
            <p>{t("mystats.editProfile")}</p>
          </Button>
        </>
      )}
    </Section>
  );
}

function StatisticsSection({
  totalPlayTime,
  totalScore,
  highestScoringGame,
}: {
  totalPlayTime: number;
  totalScore: number;
  highestScoringGame: VideoGame;
}) {
  const { t } = useTranslation();

  return (
    <Section className="section">
      <h1 className="section-title">{t("mystats.statistics")}</h1>
      <div className="statistics-grid">
        <Box
          label={t("mystats.totalPlayTime")}
          value={`${totalPlayTime} mins`}
        />
        <Box label={t("mystats.totalScore")} value={totalScore.toString()} />
        <Box
          label={t("mystats.topGame")}
          value={`${highestScoringGame.name} (${highestScoringGame.high_score} pts)`}
        />
      </div>
    </Section>
  );
}

function GamesSection({ games }: { games: VideoGame[] }) {
  const { t } = useTranslation();

  return (
    <Section className="section">
      <h1 className="section-title">{t("mystats.gamesPlayed")}</h1>
      <div className="games-grid">
        {games.map((game, i) => (
          <Box
            key={i}
            label={game.name}
            value={
              <>
                {t("mystats.maxScore")}: {game.high_score} pts
                <br />
                {t("mystats.timePlayed")}: {game.timePlayed} mins
              </>
            }
          />
        ))}
      </div>
    </Section>
  );
}

export default MyStats;
