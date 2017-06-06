import { Card, CardType, CardRank } from "../games/gameObj"
import { Player, Status } from "../player"

export class PlayerStub implements Player {
    publics: PlayerPublics;
    privates: PlayerPrivates;

    constructor() {
        this.publics = new PlayerPublics();
        this.privates = new PlayerPrivates();
    }

    dealCards(c: Card): boolean {
        throw new Error('Method not implemented.');
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

    get hand():Card[] {
        return this.privates.hand;
    }
    set hand(setter:Card[]) {
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
}

class PlayerPrivates {
    playerId: number;
    hand: Card[] = [];
    playingGameId: number = null;
}