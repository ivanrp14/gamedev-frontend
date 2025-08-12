import { VideoGame } from "./Videogame";
export class User {
  username: string;

  fullname: string; // Para compatibilidad con API
  email: string;
  profile_image: string;
  gamesPlayed: VideoGame[];
  total_score: number;

  constructor(
    username: string,
    fullname: string,
    email: string,
    profile_image: string,
    gamesPlayed: VideoGame[] = [],
    total_score: number = 0
  ) {
    this.username = username;
    this.fullname = fullname;
    this.email = email;
    this.profile_image = profile_image;
    this.gamesPlayed = gamesPlayed;
    this.total_score = total_score;
  }

  totalPlayTime(): number {
    return this.gamesPlayed.reduce((total, game) => total + game.timePlayed, 0);
  }

  highestScoringGame(): VideoGame {
    return this.gamesPlayed.reduce(
      (max, game) => (game.high_score > max.high_score ? game : max),
      new VideoGame("N/A", 0, 0, 0)
    );
  }

  static fromApiResponse(apiData: any): User {
    console.log("Convirtiendo respuesta de API a User:", apiData);
    const gamesPlayed: VideoGame[] = (apiData.gamesPlayed || []).map(
      (game: any) => {
        return new VideoGame(
          game.gameName || game.name, // para compatibilidad
          game.maxScore || game.high_score || 0,
          game.totalScore || 0,
          game.totalTimePlayed || game.timePlayed || 0
        );
      }
    );

    return new User(
      apiData.username,
      apiData.firstName + " " + apiData.lastName || "",
      apiData.email,
      apiData.profilePicture || apiData.profile_image || "",
      gamesPlayed,
      apiData.total_score || 0
    );
  }
}
