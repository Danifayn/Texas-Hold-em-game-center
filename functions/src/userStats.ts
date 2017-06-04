import * as assign from 'object.assign';

export class userStats {
    username: string = null;
    winnings: number = 0;
    gross: number = 0;
    highestWin: number = 0;
    gamesPlayed: number = 0;

    constructor(username?: string) {
        this.username = username;
    }

    update(win: number, buyin: number) {
        this.winnings += win;
        this.gross += (win-buyin);
        this.highestWin = (win > this.highestWin) ? win : this.highestWin;
        this.gamesPlayed++;
    }

    static from(json: any): userStats {
        let stat: userStats = assign(new userStats(), json);
        return stat;
    }
}