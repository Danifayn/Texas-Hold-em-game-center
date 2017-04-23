import { Game } from './game';
import * as assign from 'object.assign';

export class User{
    id: number;
    username: string;
    password: string;
    league: number = 0;
    activeGamesIds: number[] = [];
    spectatingGamesIds: number[] = [];

    constructor(id?: number,username?: string, password?: string) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static from(json: any): User {
        return assign(new User(), json);
    }

    public joinGame(game: Game) {
        console.log("entering ujg");
        this.activeGamesIds.push(game.id);
        console.log("exiting ujg");
    }

    public spectateGame(game: Game) {
        this.spectatingGamesIds.push(game.id);
    }

    public leaveGame(game: Game) {
        this.activeGamesIds = this.activeGamesIds.filter(x => x !== game.id);
        this.spectatingGamesIds = this.spectatingGamesIds.filter(x => x !== game.id);
    }
}