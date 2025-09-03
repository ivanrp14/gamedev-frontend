import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../../images/default-profile.png";
import { useTranslation } from "react-i18next";
import PodiumChart from "../../Charts/ScoreChart";
import PodiumChartSkeleton from "../../Charts/PoidumChartSkeleton";
import { apiClient } from "../../hooks/ApiClient";

// Función para mostrar tiempo relativo (ejemplo: hace 2 horas)
function timeSince(date: Date, t: any) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return t("main.years_ago", { count: interval });

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return t("main.months_ago", { count: interval });

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return t("main.days_ago", { count: interval });

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return t("main.hours_ago", { count: interval });

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return t("main.minutes_ago", { count: interval });

  return t("main.just_now");
}

// Tipos de datos desde la API
interface Game {
  id: number;
  name: string;
}

interface RecentSession {
  username: string;
  score: number;
  profile_image?: string;
  played_at: string;
  highscore?: boolean;
}

interface HighScoreItem {
  username: string;
  high_score: number;
  profile_image?: string;
}

interface TotalScoreItem {
  username: string;
  total_score: number;
  profile_image?: string;
}

// Clase para tipar los datos del usuario
class UserLeaderboard {
  username: string;
  score: number;
  profilePicture?: string;
  playedAt?: Date;
  isHighscore?: boolean;

  constructor(
    username: string,
    score: number,
    profilePicture?: string,
    playedAt?: Date,
    isHighscore?: boolean
  ) {
    this.username = username;
    this.score = score;
    this.profilePicture = profilePicture;
    this.playedAt = playedAt;
    this.isHighscore = isHighscore;
  }
}

export function Main() {
  const [users, setUsers] = useState<UserLeaderboard[]>([]);
  const [period, setPeriod] = useState("total");
  const [rankingType, setRankingType] = useState("recent_sessions");
  const [gameId, setGameId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const { t } = useTranslation();

  // Fetch de juegos
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data: Game[] = await apiClient.get("/game");
        setGames(data);
      } catch (error) {
        console.error("Error al cargar juegos:", error);
      }
    };

    fetchGames();
  }, []);

  // Fetch de ranking
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        let endpoint = "";

        if (rankingType === "high_score") {
          endpoint = gameId
            ? `/game/ranking/highscore/${gameId}`
            : "/game/ranking";
        } else if (rankingType === "total_score") {
          endpoint = gameId
            ? `/game/ranking/total_score/${period}/${gameId}`
            : `/game/ranking/total_score/${period}/all`;
        } else if (rankingType === "recent_sessions") {
          endpoint = `/game/sessions/recent`;
        }

        const data = await apiClient.get(endpoint);

        if (rankingType === "recent_sessions") {
          const userList: UserLeaderboard[] = (data as RecentSession[])
            .map(
              (item) =>
                new UserLeaderboard(
                  item.username,
                  item.score,
                  item.profile_image || DefaultProfile,
                  new Date(item.played_at),
                  item.highscore
                )
            )
            .sort(
              (a, b) =>
                (b.playedAt?.getTime() ?? 0) - (a.playedAt?.getTime() ?? 0)
            );
          setUsers(userList);
        } else if (rankingType === "high_score") {
          const userList: UserLeaderboard[] = (data as HighScoreItem[]).map(
            (item) =>
              new UserLeaderboard(
                item.username,
                item.high_score,
                item.profile_image || DefaultProfile
              )
          );
          setUsers(userList);
        } else if (rankingType === "total_score") {
          const userList: UserLeaderboard[] = (data as TotalScoreItem[]).map(
            (item) =>
              new UserLeaderboard(
                item.username,
                item.total_score,
                item.profile_image || DefaultProfile
              )
          );
          setUsers(userList);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar ranking:", error);
        setLoading(false);
      }
    };

    fetchRanking();
  }, [period, rankingType, gameId]);

  return (
    <div className="main-container">
      <div className="filters">
        <select
          value={rankingType}
          onChange={(e) => setRankingType(e.target.value)}
        >
          <option value="high_score">{t("main.filters.high_score")}</option>
          <option value="total_score">{t("main.filters.total_score")}</option>
          <option value="recent_sessions">
            {t("main.filters.recent_sessions")}
          </option>
        </select>

        {rankingType === "total_score" && (
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="day">{t("main.filters.day")}</option>
            <option value="week">{t("main.filters.week")}</option>
            <option value="month">{t("main.filters.month")}</option>
            <option value="total">{t("main.filters.total")}</option>
          </select>
        )}

        {rankingType !== "recent_sessions" && (
          <select
            value={gameId ?? ""}
            onChange={(e) =>
              setGameId(e.target.value ? Number(e.target.value) : null)
            }
          >
            {rankingType === "total_score" && (
              <option value="">{t("main.filters.all_games")}</option>
            )}
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <PodiumChartSkeleton />
      ) : users.length > 0 ? (
        <PodiumChart users={users.slice(0, 5)} />
      ) : (
        <>
          <p className="no-results">{t("main.no_players")}</p>
          <PodiumChartSkeleton /> {/* Skeleton vacío */}
        </>
      )}

      <Leaderboard users={users} loading={loading} rankingType={rankingType} />
    </div>
  );
}

// ------------------------- LEADERBOARD COMPONENTS -------------------------

interface LeaderboardProps {
  users: UserLeaderboard[];
  loading: boolean;
  rankingType?: string;
}

function Leaderboard({ users, loading, rankingType }: LeaderboardProps) {
  const { t } = useTranslation();
  const sortedUsers =
    rankingType === "recent_sessions"
      ? users
      : [...users].sort(
          (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
        );

  // Si está cargando o no hay usuarios, mostramos 5 skeletons
  const showSkeletons = loading || users.length === 0;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>{t("main.leaderboard")}</h1>
      </div>
      <div className="leaderboard">
        {users.length === 0 && (
          <p className="no-results">{t("main.no_players")}</p>
        )}
        {showSkeletons
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />)
          : sortedUsers.map((user, index) => (
              <LeaderboardItem
                key={`${user.username}-${index}`}
                rank={index + 1}
                username={user.username}
                score={user.score || 0}
                image={user.profilePicture}
                playedAt={user.playedAt}
                isHighscore={user.isHighscore}
                rankingType={rankingType}
              />
            ))}
      </div>
    </div>
  );
}

interface LeaderboardItemProps {
  rank: number;
  username: string;
  score: number;
  image?: string;
  playedAt?: Date;
  isHighscore?: boolean;
  rankingType?: string;
}

function LeaderboardItem({
  rank,
  username,
  score,
  image,
  playedAt,
  isHighscore,
  rankingType,
}: LeaderboardItemProps) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleClick = () => {
    navigate(`/user/${username}`);
  };
  const { t } = useTranslation();

  return (
    <button className="leaderboard-item" onClick={handleClick}>
      <h2 className={`rank`}>#{rank}</h2>
      <div className="profile-pic-container">
        {!imgLoaded && <div className="skeleton-circle" />}
        <img
          src={image || DefaultProfile}
          alt={t("main.avatar_alt")}
          className={`profile-pic ${imgLoaded ? "fade-in" : "hidden"}`}
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <div className="stats-container">
        <div className="username-text">{username.toUpperCase()}</div>
        <div className="stats-text">{score}</div>
        {rankingType === "recent_sessions" && playedAt && (
          <div className="time-info">
            {timeSince(playedAt, t)} {isHighscore ? "🔥" : ""}
          </div>
        )}
      </div>
    </button>
  );
}

function SkeletonItem() {
  return (
    <div className="skeleton">
      <div className="rank skeleton-box" />
      <div className="skeleton-circle" />
      <div className="stats-container">
        <div className="username-text skeleton-box" />
        <div className="stats-text skeleton-box" />
      </div>
    </div>
  );
}

export default Main;
