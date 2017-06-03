import * as assign from 'object.assign';
import * as Games from "./games/gameObj";
import { User } from "./user";

export enum Status {
    Check,
    Raise,
    Fold,
}

export class Player {
    playerId: number;
    status: Status = null;
    lastBet: number = null;
    hand: Games.Card[] = [];
    money: number = 0;
    playingUser: string = null;
    playingGameId: number = null;
    points: number = 0;
    isActive: boolean = true;

    constructor(id?: number,
        user?: User,
        game?: Games.Game) {

        this.playerId = id;
        if (user) this.playingUser = user.username;
        if (game) this.playingGameId = game.gameId;
        this.points = 0;
    }

    dealCards(c: Games.Card): boolean {
        if (this.hand.length < 2) {
            this.hand.push(c);
            return true;
        }
        return false;
    }

    static from(json: any): Player {
        let player: Player = assign(new Player(), json);
        player.hand = player.hand.map(x => Games.Card.from(x));
        return player;
    }
}