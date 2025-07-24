import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../../interfaces/User";
import { Title } from "../../ui/Title";
import "./UserProfile.css";
import { useAuth } from "../../../hooks/AuthProvider";

export const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [catImageUrl, setCatImageUrl] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserAndCat = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/users/user-profile/${username}`
        );
        const data = await res.json();
        const loadedUser = User.fromApiResponse(data);
        setUser(loadedUser);
        console.log("User loaded:", loadedUser);
        // Solo pedimos imagen de gato si no hay imagen de perfil
        if (!data.profilePicture) {
          const catRes = await fetch(
            "https://api.thecatapi.com/v1/images/search?limit=1"
          );
          const catData = await catRes.json();
          setCatImageUrl(catData[0]?.url);
        }
      } catch (err) {
        console.error("Error loading user or cat image:", err);
      }
    };

    fetchUserAndCat();
  }, [username]);

  if (!user || !currentUser)
    return <p className="loading">Cargando usuario...</p>;

  const isSameUser = currentUser.username === user.username;
  let comparisonMessage = "";

  if (user.total_score > currentUser.total_score) {
    comparisonMessage = `🔥 Este usuario tiene ${user.total_score - currentUser.total_score} puntos más que tú.`;
  } else if (user.total_score < currentUser.total_score) {
    comparisonMessage = `😎 Tienes ${currentUser.total_score - user.total_score} puntos más que él.`;
  } else {
    comparisonMessage = `🤝 Ambos tienen exactamente ${user.total_score} puntos. ¡Empate!`;
  }
  return (
    <div className="user-profile neon-card">
      <img
        src={user.profile_image || catImageUrl || "/default-avatar.png"}
        alt="Profile"
        className="profile-pic"
      />
      <Title level={2}>{user.username}</Title>
      <p>🎮 Juegos jugados: {user.gamesPlayed.length}</p>
      <p>🏆 Total Score: {user.total_score}</p>

      {!isSameUser && (
        <div className="comparison">
          <p>{comparisonMessage}</p>
        </div>
      )}

      <div className="game-list">
        <h3>Juegos jugados:</h3>
        <ul>
          {user.gamesPlayed.map((game) => {
            const currentUserGame = currentUser.gamesPlayed.find(
              (g) => g.name === game.name
            );

            const userScore = game.high_score;
            const currentScore = currentUserGame?.high_score ?? 0;

            const diff = currentScore - userScore;

            let scoreClass = "equal";
            let diffLabel = "";

            if (diff > 0) {
              scoreClass = "win";
              diffLabel = ` (+${diff} puntos)`;
            } else if (diff < 0) {
              scoreClass = "lose";
              diffLabel = ` (${diff} puntos)`;
            }

            return (
              <li key={game.name} className={`game-item ${scoreClass}`}>
                <strong>{game.name}</strong>: {userScore} puntos
                {!isSameUser && currentUserGame && (
                  <span className="comparison-tag">
                    {diff > 0
                      ? `✔️ Le ganas${diffLabel}`
                      : diff < 0
                        ? `❌ Te gana${diffLabel}`
                        : "🤝 Empate"}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
