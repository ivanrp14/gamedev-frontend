import "./MyStats.css";
import { User } from "../../../interfaces/User";
import { VideoGame } from "../../../interfaces/Videogame";
import { useState } from "react";
import { useAuth } from "../../../hooks/AuthProvider";
import { JSX } from "react";
import { Section } from "../../ui/Section";
import DefaultProfile from "../../../images/default-profile.png";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";

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
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email,
    password: "",
    fullname: user.fullname,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      console.log("Updating user with:", formData);
      // await updateUser(formData);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update user", err);
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
          {t("mystats.logout")}
        </Button>
      </div>

      {editing ? (
        <div className="edit-form">
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
          <div className="edit-actions">
            <Button onClick={handleSave}>{t("mystats.save")}</Button>
            <Button onClick={() => setEditing(false)}>
              {t("mystats.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="info-grid">
            <InfoBox label={t("mystats.fullName")} value={user.fullname} />
            <InfoBox label={t("mystats.email")} value={user.email} />
          </div>
          <Button onClick={() => setEditing(true)} className="edit-button">
            {t("mystats.editProfile")}
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
        <StatCard
          label={t("mystats.totalPlayTime")}
          value={`${totalPlayTime} mins`}
        />
        <StatCard label={t("mystats.totalScore")} value={totalScore} />
        <StatCard
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
          <InfoBox
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

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string | JSX.Element;
}) {
  return (
    <div className="info-box">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat-card">
      <h4>{label}</h4>
      <p>{value}</p>
    </div>
  );
}

export default MyStats;
