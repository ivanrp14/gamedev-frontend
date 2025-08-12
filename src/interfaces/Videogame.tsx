export class VideoGame {
  name: string;
  high_score: number;
  total_score: number;
  timePlayed: number; // en minutos

  constructor(
    name: string,
    high_score: number,
    total_score: number,
    timePlayed: number
  ) {
    this.name = name;
    this.high_score = high_score;
    this.total_score = total_score;
    this.timePlayed = timePlayed;
  }
}
