import {Card, CardType, CardRank} from "../game"
import {Player, Status} from "../player"

export class PlayerStub implements Player {
    playerId: number;
    status: Status = null;
    lastBet: number = null;
    hand: Card[] = [];
    money: number = 0;
    playingUser: string = null;
    playingGameId: number = null;
    points: number = 0;
    isActive: boolean = true;

    constructor() { }

    deal(c:Card): boolean {
        throw new Error('Method not implemented.');
    }
}