import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../../interfaces/User";
import { Title } from "../../ui/Title";
import "./UserProfile.css";
import { useAuth } from "../../../hooks/AuthProvider";
import DefaultProfile from "../../../images/default-profile.png";
import { useTranslation } from "react-i18next";

export const UserProfile = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserAndCat = async () => {
      try {
        const res = await fetch(
          `https://api.gamedev.study/users/user-profile/${username}`
        );
        const data = await res.json();
        const loadedUser = User.fromApiResponse(data);
        setUser(loadedUser);
        console.log(t("userProfile.userLoaded"), loadedUser);
      } catch (err) {
        console.error(t("userProfile.errorLoadingUserOrCat"), err);
      }
    };

    fetchUserAndCat();
  }, [username, t]);

  if (!user || !currentUser)
    return <p className="loading">{t("userProfile.loadingUser")}</p>;

  const isSameUser = currentUser.username === user.username;
  let comparisonMessage = "";

  if (user.total_score > currentUser.total_score) {
    const diff = user.total_score - currentUser.total_score;
    comparisonMessage = t("userProfile.userHasMorePoints", { diff });
  } else if (user.total_score < currentUser.total_score) {
    const diff = currentUser.total_score - user.total_score;
    comparisonMessage = t("userProfile.youHaveMorePoints", { diff });
  } else {
    comparisonMessage = t("userProfile.pointsTie", {
      points: user.total_score,
    });
  }

  return (
    <div className="user-profile neon-card">
      <img
        src={user.profile_image || DefaultProfile}
        alt={t("userProfile.profilePictureAlt", { username: user.username })}
        className="profile-pic"
      />
      <Title level={2}>{user.username}</Title>
      <p>
        🎮 {t("userProfile.gamesPlayed")}: {user.gamesPlayed.length}
      </p>
      <p>
        🏆 {t("userProfile.totalScore")}: {user.total_score}
      </p>

      {!isSameUser && (
        <div className="comparison">
          <p>{comparisonMessage}</p>
        </div>
      )}

      <div className="game-list">
        <h3>{t("userProfile.gamesPlayedList")}:</h3>
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
              diffLabel = ` (+${diff} ${t("userProfile.points")})`;
            } else if (diff < 0) {
              scoreClass = "lose";
              diffLabel = ` (${diff} ${t("userProfile.points")})`;
            }

            return (
              <li key={game.name} className={`game-item ${scoreClass}`}>
                <strong>{game.name}</strong>: {userScore}{" "}
                {t("userProfile.points")}
                {!isSameUser && currentUserGame && (
                  <span className="comparison-tag">
                    {diff > 0
                      ? `✔️ ${t("userProfile.youBeatThem")}${diffLabel}`
                      : diff < 0
                        ? `❌ ${t("userProfile.theyBeatYou")}${diffLabel}`
                        : "🤝 " + t("userProfile.tie")}
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
