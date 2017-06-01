import { Game } from './game';
import * as assign from 'object.assign';
import {gamePlayerLog} from "./log";

export class User{
    username: string;
    password: string;
    email: string;
    league: number = 0;
    points: number = 0;
    activeGamesIds: number[] = [];
    spectatingGamesIds: number[] = [];

    constructor(username?: string, password?: string, email?: string, league?: number, points?: number) {
        this.username = username;
        this.password = password;
        this.email = email;
        if(league) this.league = league;
        if(points) this.points = points;
        else this.points = 0;
    }

    static from(json: any): User {
        let user = null;
        user = assign(new User(), json);
        user.favTurns = user.favTurns.map(x => gamePlayerLog.from(x));
        return user;
    }

    public joinGame(game: Game) {
        this.activeGamesIds.push(game.id);
    }

    public spectateGame(game: Game) {
        this.spectatingGamesIds.push(game.id);
    }

    public leaveGame(game: Game) {
        this.points += game.getPlayerByUsername(this.username).points;
        this.activeGamesIds = this.activeGamesIds.filter(x => x != game.id);
        this.spectatingGamesIds = this.spectatingGamesIds.filter(x => x != game.id);
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
}

