import * as assign from 'object.assign';
import * as Games from "./games/gameObj";
import { User } from "./user";

export enum Status {
    Check,
    Raise,
    Fold,
}

export class Player {
    publics: PlayerPublics;
    privates: PlayerPrivates;

    constructor(id?: number,
        user?: User,
        game?: Games.Game) {

        this.publics = new PlayerPublics();
        this.privates = new PlayerPrivates();

        this.playerId = id;
        if (user) this.userId = user.uId;
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
        player.publics = PlayerPublics.from(player.publics);
        player.privates = PlayerPrivates.from(player.privates);
        return player;
    }

    get status():Status {
        return this.publics.status;
    }
    set status(setter:Status) {
        this.publics.status = setter;
    }

    get lastBet():number {
        return this.publics.lastBet;
    }
    set lastBet(setter:number) {
        this.publics.lastBet = setter;
    }

    get money():number {
        return this.publics.money;
    }
    set money(setter:number) {
        this.publics.money = setter;
    }

    get userId():string {
        return this.publics.userId;
    }
    set userId(setter:string) {
        this.publics.userId = setter;
    }

    get points():number {
        return this.publics.points;
    }
    set points(setter:number) {
        this.publics.points = setter;
    }

    get isActive():boolean {
        return this.publics.isActive;
    }
    set isActive(setter:boolean) {
        this.publics.isActive = setter;
    }

    get playerId():number {
        return this.privates.playerId;
    }
    set playerId(setter:number) {
        this.privates.playerId = setter;
    }

    get hand():Games.Card[] {
        return this.privates.hand;
    }
    set hand(setter:Games.Card[]) {
        this.privates.hand = setter;
    }

    get playingGameId():number {
        return this.privates.playingGameId;
    }
    set playingGameId(setter:number) {
        this.privates.playingGameId = setter;
    }
}

class PlayerPublics {    
    status: Status = null;
    lastBet: number = null;
    money: number = 0;
    userId: string = null;
    points: number = 0;
    isActive: boolean = true;

    static from(json: any): PlayerPublics {
        let player: PlayerPublics = assign(new PlayerPublics(), json);
        return player;
    }
}

class PlayerPrivates {
    playerId: number;
    hand: Games.Card[] = [];
    playingGameId: number = null;

    static from(json: any): PlayerPrivates {
        let player: PlayerPrivates = assign(new PlayerPrivates(), json);
        player.hand = player.hand.map(x => Games.Card.from(x));
        return player;
    }
}