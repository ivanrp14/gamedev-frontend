import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../../images/default-profile.png";

// Función para mostrar tiempo relativo (ejemplo: hace 2 horas)
function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `hace ${interval} años`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `hace ${interval} meses`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `hace ${interval} días`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `hace ${interval} horas`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `hace ${interval} minutos`;

  return "hace unos segundos";
}

// Clase para tipar los datos del usuario, incluyendo fecha y highscore
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
  const [games, setGames] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("https://api.gamedev.study/game");
        if (!response.ok) throw new Error("Error al obtener juegos");
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error al cargar juegos:", error);
      }
    };

    fetchGames();
  }, []);

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

        const response = await fetch(`https://api.gamedev.study${endpoint}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al obtener ranking");

        const data = await response.json();
        console.log("Ranking data:", data);
        if (rankingType === "recent_sessions") {
          // Mapeamos incluyendo fecha y flag isHighscore
          const userList: UserLeaderboard[] = data
            .map((item: any) => {
              return new UserLeaderboard(
                item.username,
                item.score,
                item.profile_image || DefaultProfile,
                new Date(item.played_at), // Asumiendo que el campo fecha es played_at
                item.highscore
              );
            })
            // Ordenar por fecha descendente (los más recientes primero)
            .sort(
              (a: UserLeaderboard, b: UserLeaderboard) =>
                (b.playedAt?.getTime() ?? 0) - (a.playedAt?.getTime() ?? 0)
            );

          setUsers(userList);
        } else {
          const userList: UserLeaderboard[] = data.map((item: any) => {
            return new UserLeaderboard(
              item.username,
              item.total_score ?? item.high_score,
              item.profile_image || DefaultProfile
            );
          });
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
          <option value="high_score">High Score</option>
          <option value="total_score">Total Score</option>
          <option value="recent_sessions">Recent Sessions</option>
        </select>

        {rankingType === "total_score" && (
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="total">Total</option>
          </select>
        )}
        {rankingType === "recent_sessions" || (
          <select
            value={gameId ?? ""}
            onChange={(e) =>
              setGameId(e.target.value ? Number(e.target.value) : null)
            }
          >
            {rankingType === "total_score" && (
              <option value="">All Games</option>
            )}
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <Leaderboard users={users} loading={loading} rankingType={rankingType} />
    </div>
  );
}

interface LeaderboardProps {
  users: UserLeaderboard[];
  loading: boolean;
  rankingType?: string;
}

function Leaderboard({ users, loading, rankingType }: LeaderboardProps) {
  // Para recent_sessions no ordenamos por score sino ya están ordenados por fecha en fetch
  const sortedUsers =
    rankingType === "recent_sessions"
      ? users
      : [...users].sort(
          (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
        );

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
      </div>
      <div className="leaderboard">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />)
        ) : users.length === 0 ? (
          <p className="no-results">No hay jugadores en este ranking aún.</p>
        ) : (
          sortedUsers.map((user, index) => (
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
          ))
        )}
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

  return (
    <button className="leaderboard-item" onClick={handleClick}>
      <h2 className={`rank`}>#{rank}</h2>
      <div className="profile-pic-container">
        {!imgLoaded && <div className="skeleton-circle" />}
        <img
          src={image || "/default-avatar.png"}
          alt="Avatar"
          className={`profile-pic ${imgLoaded ? "fade-in" : "hidden"}`}
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <div className="stats-container">
        <div className="username-text">{username.toUpperCase()}</div>
        <div className="stats-text">{score}</div>
        {rankingType === "recent_sessions" && playedAt && (
          <div className="time-info">
            {timeSince(playedAt)} {isHighscore ? "🔥" : ""}
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
