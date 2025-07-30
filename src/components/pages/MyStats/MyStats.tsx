import "./MyStats.css";
import { User } from "../../../interfaces/User";
import { VideoGame } from "../../../interfaces/Videogame";
import { useState } from "react";

import { useAuth } from "../../../hooks/AuthProvider";
import { JSX } from "react";
import { Section } from "../../ui/Section";
import DefaultProfile from "../../../images/default-profile.png";

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
      // Aquí deberías llamar a tu API
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
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      {editing ? (
        <div className="edit-form">
          <input
            type="text"
            name="firstName"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="First Name"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
          />
          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="info-grid">
            <InfoBox label="Full Name" value={user.fullname} />
            <InfoBox label="Email" value={user.email} />
          </div>
          <button onClick={() => setEditing(true)} className="edit-button">
            Edit Profile
          </button>
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
  return (
    <Section className="section">
      <h1 className="section-title">Statistics</h1>
      <div className="statistics-grid">
        <StatCard label="Total Play Time" value={`${totalPlayTime} mins`} />
        <StatCard label="Total Score" value={totalScore} />
        <StatCard
          label="Top Game"
          value={`${highestScoringGame.name} (${highestScoringGame.high_score} pts)`}
        />
      </div>
    </Section>
  );
}

function GamesSection({ games }: { games: VideoGame[] }) {
  return (
    <Section className="section">
      <h1 className="section-title">Games Played</h1>
      <div className="games-grid">
        {games.map((game, i) => (
          <InfoBox
            key={i}
            label={game.name}
            value={
              <>
                Max Score: {game.high_score} pts
                <br />
                Time: {game.timePlayed} mins
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
