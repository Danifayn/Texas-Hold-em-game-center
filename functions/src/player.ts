import * as assign from 'object.assign';
import {Card, Game} from "./game";
import {User} from "./user";

export enum Status {
    Check,
    Raise,
    Fold,
}

export class Player {
    status: Status = null;
    lastBet: Number = null;
    hand: Card[] = [];
    money: Number = 0;
    playingUser: User = null;
    playingGame: Game = null;
    err: boolean = false;

    constructor(user?:User,
                game?:Game) {
        this.playingUser = user;
        this.playingGame = game;
    }

    deal(c:Card) {
        this.hand.push(c);
    }

    isEqual(p: Player): boolean {
        return  (p.playingGame.id == this.playingGame.id) &&
                (p.playingUser.username == this.playingUser.username);
    }

    static from(json: any): Player {
        let player: Player = assign(new Player(),json)
        player.hand.map(x => Card.from(x));
        return player;
    }
}