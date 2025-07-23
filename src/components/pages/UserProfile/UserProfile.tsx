import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../../interfaces/User";
import { Title } from "../../ui/Title";
import "./UserProfile.css";
import { useAuth } from "../../../hooks/AuthProvider";

export const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`https://api.gamedev.study/users/${username}`);
        const data = await res.json();
        const loadedUser = User.fromApiResponse(data);
        setUser(loadedUser);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    fetchUser();
  }, [username]);

  if (!user || !currentUser)
    return <p className="loading">Cargando usuario...</p>;

  const isSameUser = currentUser.username === user.username;

  return (
    <div className="user-profile neon-card">
      <img src={user.profilePicture} alt="Profile" className="profile-pic" />
      <Title level={2}>{user.username}</Title>
      <p>🎮 Juegos jugados: {user.gamesPlayed.length}</p>
      <p>🏆 Total Score: {user.total_score}</p>

      {!isSameUser && (
        <div className="comparison">
          <p>
            {user.total_score > currentUser.total_score
              ? `🔥 Este usuario tiene ${user.total_score - currentUser.total_score} puntos más que tú.`
              : `😎 Tienes ${currentUser.total_score - user.total_score} puntos más que él.`}
          </p>
        </div>
      )}
    </div>
  );
};
