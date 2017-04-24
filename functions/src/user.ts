import { Game } from './game';
import * as assign from 'object.assign';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin';

export class User{
    username: string;
    password: string;
    email: string;
    league: number = 0;
    points: number = 0;
    activeGamesIds: number[] = [];
    spectatingGamesIds: number[] = [];

    constructor(username?: string, password?: string, email?: string, league?: number) {
        this.username = username;
        this.password = password;
        this.email = email;
        if(league) this.league = league;
    }

    static from(json: any): User {
        return json.username === ADMIN_USERNAME && json.password === ADMIN_PASSWORD ? assign(new Admin(), json) : assign(new User(), json);
    }

    public joinGame(game: Game) {
        this.activeGamesIds.push(game.id);
    }

    public spectateGame(game: Game) {
        this.spectatingGamesIds.push(game.id);
    }

    public leaveGame(game: Game) {
        this.activeGamesIds = this.activeGamesIds.filter(x => x !== game.id);
        this.spectatingGamesIds = this.spectatingGamesIds.filter(x => x !== game.id);
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

export class Admin extends User {
    constructor() {super(ADMIN_USERNAME,ADMIN_PASSWORD);}
}