export class VideoGame {
    gameName: string;
    maxScore: number;
    timePlayed: number;

    constructor(gameName: string, maxScore: number, timePlayed: number) {
        this.gameName = gameName;
        this.maxScore = maxScore;
        this.timePlayed = timePlayed;
    }
}
