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
    playingUserId: number = null;
    playingGameId: number = null;

    constructor(id?: number,
                user?: User,
                game?: Game) {
                    
        console.log("~.1");
        this.playerId = id;
        console.log("~.2");
        if(user) this.playingUserId = user.id;
        console.log("~.3");
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
        console.log("3.3.4.1");
        let player: Player = assign(new Player(),json);
        console.log("3.3.4.2");
        player.hand = player.hand.map(x => Card.from(x));
        console.log("3.3.4.3");
        return player;
    }
}