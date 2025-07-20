import { useEffect, useState } from "react";
import { Section } from "../../ui/Section.tsx";
import "./Home.css";

class UserLeaderboard {
  username: string;
  high_score: number;

  constructor(username: string, high_score: number) {
    this.username = username;
    this.high_score = high_score;
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

        const userList: UserLeaderboard[] = data.map(
          (item: any) => new UserLeaderboard(item.username, item.high_score)
        );

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
}

function LeaderboardItem({ rank, username, score }: LeaderboardItemProps) {
  let rankClass = "";
  if (rank === 1) rankClass = "gold";
  else if (rank === 2) rankClass = "silver";
  else if (rank === 3) rankClass = "bronze";

  const catImageUrl = `https://cataas.com/cat/says/${encodeURIComponent(
    username
  )}?fontSize=100&fontColor=purple&unique=${Date.now() + Math.random()}`;

  return (
    <Section className="leaderboard-item">
      <h2 className={`rank ${rankClass}`}>#{rank}</h2>
      <img src={catImageUrl} alt="Avatar" className="profile-pic" />
      <div className="stats-container">
        <div className="username-text">{username.toUpperCase()}</div>
        <div className="stats-text">{score}</div>
      </div>
    </Section>
  );
}

export default Main;
