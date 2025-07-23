import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button.tsx";

class UserLeaderboard {
  username: string;
  high_score: number;
  profilePicture?: string;

  constructor(username: string, high_score: number, profilePicture?: string) {
    this.username = username;
    this.high_score = high_score;
    this.profilePicture = profilePicture;
  }
}

export function Main() {
  const [users, setUsers] = useState<UserLeaderboard[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch("https://api.gamedev.study/game/ranking", {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) throw new Error("Error al obtener ranking");
        const data = await response.json();

        // Paso 1: detectar cuántos usuarios necesitan imagen
        const usersWithoutImage = data.filter((u: any) => !u.profile_image);
        const catRes = await fetch(
          `https://api.thecatapi.com/v1/images/search?limit=${usersWithoutImage.length}`
        );
        const catData = await catRes.json();

        // Paso 2: asignar imágenes aleatorias a los usuarios sin imagen
        const userList: UserLeaderboard[] = data.map((item: any) => {
          const fallbackCat = !item.profile_image
            ? catData.pop()?.url
            : undefined;
          return new UserLeaderboard(
            item.username,
            item.high_score,
            item.profile_image || fallbackCat
          );
        });

        setUsers(userList);
      } catch (error) {
        console.error("Error al cargar ranking:", error);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="main-container">
      <Leaderboard users={users} />
    </div>
  );
}

interface LeaderboardProps {
  users: UserLeaderboard[];
}

function Leaderboard({ users }: LeaderboardProps) {
  const sortedUsers = [...users].sort(
    (a, b) => (Number(b.high_score) || 0) - (Number(a.high_score) || 0)
  );

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
      </div>
      <div className="leaderboard">
        {sortedUsers.map((user, index) => (
          <LeaderboardItem
            key={user.username}
            rank={index + 1}
            username={user.username}
            score={user.high_score}
            image={user.profilePicture}
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
}

function LeaderboardItem({
  rank,
  username,
  score,
  image,
}: LeaderboardItemProps) {
  const navigate = useNavigate();

  const handleClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  let rankClass = "";
  if (rank === 1) rankClass = "gold";
  else if (rank === 2) rankClass = "silver";
  else if (rank === 3) rankClass = "bronze";

  return (
    <Button className="leaderboard-item" onClick={() => handleClick(username)}>
      <h2 className={`rank ${rankClass}`}>#{rank}</h2>
      <img
        src={image || "/default-avatar.png"}
        alt="Avatar"
        className="profile-pic"
      />
      <div className="stats-container">
        <div className="username-text">{username.toUpperCase()}</div>
        <div className="stats-text">{score}</div>
      </div>
    </Button>
  );
}

export default Main;
