import * as Games from './games/gameObj';
import * as assign from 'object.assign';

export class User {
    username: string;
    password: string;
    email: string;
    league: number = 0;
    points: number = 0;
    activeGamesIds: number[] = [];
    spectatingGamesIds: number[] = [];
    gamesPlayed: number = 0;
    money = 200;

    constructor(username?: string, password?: string, email?: string, league?: number, points?: number) {
        this.username = username;
        this.password = password;
        this.email = email;
        if (league) this.league = league;
        if (points) this.points = points;
        else this.points = 0;
    }

    public joinGame(game: Games.Game) {
        this.activeGamesIds.push(game.gameId);
    }

    public spectateGame(game: Games.Game) {
        this.spectatingGamesIds.push(game.gameId);
    }

    public leaveGame(game: Games.Game) {
        this.activeGamesIds = this.activeGamesIds.filter(x => x != game.gameId);
        this.spectatingGamesIds = this.spectatingGamesIds.filter(x => x != game.gameId);
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public setPassword(password: string) {
        this.password = password;
    }
    public setLeague(leauge: number) {
        this.league = leauge;
    }

    public endGame(game: Games.Game) {
        this.gamesPlayed++;
        this.money += (game.buyin * game.getPlayerByUsername(this.username).money) / game.initialChips;
    }

    static from(json: any): User {
        let user = null;
        user = assign(new User(), json);
        return user;
    }
}

