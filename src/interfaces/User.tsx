import { VideoGame } from "./Videogame";

export class User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  gamesPlayed: VideoGame[];
  total_score: number;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    gamesPlayed: VideoGame[] = []
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profilePicture = profilePicture;
    this.gamesPlayed = gamesPlayed;
    this.total_score = this.calculateTotalScore();
  }

  totalPlayTime(): number {
    return this.gamesPlayed.reduce((total, game) => total + game.timePlayed, 0);
  }

  highestScoringGame(): VideoGame {
    return this.gamesPlayed.reduce(
      (max, game) => (game.maxScore > max.maxScore ? game : max),
      new VideoGame("N/A", 0, 0)
    );
  }

  calculateTotalScore(): number {
    return this.gamesPlayed.reduce((total, game) => total + game.maxScore, 0);
  }

  // 🔥 método para crear User desde API
  static fromApiResponse(apiData: any): User {
    const fullnameParts = (apiData.fullname || "").split(" ");
    const firstName = fullnameParts[0] || "";
    const lastName = fullnameParts.slice(1).join(" ") || "";

    return new User(
      apiData.username,
      firstName,
      lastName,
      apiData.email,
      apiData.profile_image || "",
      [] // suponemos que no devuelve los juegos aquí
    );
  }
}
