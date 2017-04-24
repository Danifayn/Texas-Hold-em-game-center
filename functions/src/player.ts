import * as assign from 'object.assign';
import {Card, Game} from "./game";
import {User} from "./user";

export enum Status {
    Check,
    Raise,
    Fold,
}

export class Player {
    playerId: number;
    status: Status = null;
    lastBet: number = null;
    hand: Card[] = [];
    money: number = 0;
    playingUser: string = null;
    playingGameId: number = null;

    constructor(id?: number,
                user?: User,
                game?: Game) {
                    
        this.playerId = id;
        if(user) this.playingUser = user.username;
        if(game) this.playingGameId = game.id;
    }

    deal(c:Card): boolean {
        if(this.hand.length < 5) {
            this.hand.push(c);
            return true;
        }
        return false;
    }

    static from(json: any): Player {
        let player: Player = assign(new Player(),json);
        player.hand = player.hand.map(x => Card.from(x));
        return player;
    }
}