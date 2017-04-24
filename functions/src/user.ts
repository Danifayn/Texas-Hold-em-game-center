import { Game } from './game';
import * as assign from 'object.assign';

export class User{
    username: string;
    password: string;
    email: string;
    league: number = 0;
    activeGamesIds: number[] = [];
    spectatingGamesIds: number[] = [];

    constructor(username?: string, password?: string, email?: string) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    static from(json: any): User {
        return assign(new User(), json);
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
}