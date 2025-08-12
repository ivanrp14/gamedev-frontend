import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../../interfaces/User";
import { Title } from "../../ui/Title";
import "./UserProfile.css";
import { useAuth } from "../../../hooks/AuthProvider";
import DefaultProfile from "../../../images/default-profile.png";
import { useTranslation } from "react-i18next";
import { Box } from "../../ui/Box";

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
      } catch (err) {
        console.error(t("userProfile.errorLoadingUserOrCat"), err);
      }
    };

    fetchUserAndCat();
  }, [username, t]);

  if (!user || !currentUser)
    return <p className="loading">{t("userProfile.loadingUser")}</p>;

  const isSameUser = currentUser.username === user.username;

  const formatTimePlayed = (minutes: number) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    return parts.length > 0 ? parts.join(" ") : "0m";
  };

  const getComparisonClass = (diff: number) => {
    if (diff < 0) return "blue"; // currentUser gana
    if (diff > 0) return "red"; // currentUser pierde
    return "yellow"; // empate
  };

  const getComparisonMessage = (
    diff: number,
    statName: string,
    userName: string,
    isTime = false
  ) => {
    if (diff === 0) return t("userProfile.pointsTie", { points: statName });

    if (diff > 0)
      return isTime
        ? t("userProfile.userHasMoreTime", {
            userName,
            time: formatTimePlayed(diff),
            statName,
          })
        : t("userProfile.userHasMorePoints", {
            userName,
            diff,
            statName,
          });

    const positiveDiff = Math.abs(diff);
    return isTime
      ? t("userProfile.youHaveMoreTime", {
          userName,
          time: formatTimePlayed(positiveDiff),
          statName,
        })
      : t("userProfile.youHaveMorePoints", {
          userName,
          diff: positiveDiff,
          statName,
        });
  };

  return (
    <div className="user-profile">
      <img
        src={user.profile_image || DefaultProfile}
        alt={t("userProfile.profilePictureAlt", { username: user.username })}
        className="profile-pic"
      />
      <Title level={1}>{user.username}</Title>
      <p>
        🎮 {t("userProfile.gamesPlayed")}: {user.gamesPlayed.length}
      </p>
      <p>
        🏆 {t("userProfile.totalScore")}: {user.total_score}
      </p>

      <div className="game-list">
        <h2>{t("userProfile.gamesPlayedList")}</h2>
        {user.gamesPlayed.map((game) => {
          const currentUserGame = currentUser.gamesPlayed.find(
            (g) => g.name === game.name
          );

          const currentHighScore = currentUserGame?.high_score ?? 0;
          const currentTotalScore = currentUserGame?.total_score ?? 0;
          const currentTimePlayed = currentUserGame?.timePlayed ?? 0;

          const highScoreDiff = game.high_score - currentHighScore;
          const totalScoreDiff = game.total_score - currentTotalScore;
          const timePlayedDiff = game.timePlayed - currentTimePlayed;

          return (
            <div key={game.name} className="game-item">
              <strong>{game.name}</strong>
              <div className="game-stats">
                <Box
                  label={t("userProfile.highScoreLabel")}
                  value={game.high_score.toString()}
                  color={
                    isSameUser ? "blue" : getComparisonClass(highScoreDiff)
                  }
                  tooltip={
                    !isSameUser
                      ? getComparisonMessage(
                          highScoreDiff,
                          t("userProfile.highScoreLabel"),
                          user.username
                        )
                      : undefined
                  }
                />

                <Box
                  label={t("userProfile.totalScoreLabel")}
                  value={game.total_score.toString()}
                  color={
                    isSameUser ? "blue" : getComparisonClass(totalScoreDiff)
                  }
                  tooltip={
                    !isSameUser
                      ? getComparisonMessage(
                          totalScoreDiff,
                          t("userProfile.totalScoreLabel"),
                          user.username
                        )
                      : undefined
                  }
                />

                <Box
                  label={t("userProfile.timePlayedLabel")}
                  value={formatTimePlayed(game.timePlayed)}
                  color={
                    isSameUser ? "blue" : getComparisonClass(timePlayedDiff)
                  }
                  tooltip={
                    !isSameUser
                      ? getComparisonMessage(
                          timePlayedDiff,
                          t("userProfile.timePlayedLabel"),
                          user.username,
                          true
                        )
                      : undefined
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
