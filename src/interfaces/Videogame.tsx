export class VideoGame {
  name: string;
  high_score: number;
  timePlayed: number;

  constructor(name: string, high_score: number, timePlayed: number) {
    this.name = name;
    this.high_score = high_score;
    this.timePlayed = timePlayed;
  }
}
