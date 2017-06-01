import {Game, GameType, Card, Stage} from "../game"
import {Status} from "../player"
import{UserMock} from "./usermock"
import {gamePlayerLog, gameSystemLog} from "../log"
import {PlayerStub} from "./playerStub"

export class GameMock implements Game {
    id: number;
    stage: Stage = Stage.Preflop;
    openCards: Card[] = [];
    freeCards: Card[] = [];
    bet: number = 0;
    type: GameType = GameType.NoLimit;
    buyin: number = 0;
    league: number = 0;
    initialChips: number = 1;
    minBet: number = 1;
    minPlayers: number = 2;
    maxPlayers: number = 23;
    spectatingAllowed: boolean = true;
    allPlayers: PlayerStub[] = [];
    currentPlayer: number = null;
    activePlayers: number[] = [];
    smallBet: number = null;
    pot: number = 0;
    newPlayerId: number = 0;
    bigBlind: number = null;

    userLogs: gamePlayerLog[] = [];
    systemLogs : gameSystemLog[] = [];
    logId: number = 0;

    ps: PlayerStub;

    constructor() {}

    addPlayer(user: UserMock): void {
    throw new Error('Method not implemented.');
    }

    removePlayer(user: UserMock): void {
    throw new Error('Method not implemented.');
    }

    doAction(status: Status, amount: number, player: PlayerStub): void {
    throw new Error('Method not implemented.');
    }

    doCheck(player: PlayerStub) : void {
    throw new Error('Method not implemented.');
    }

    doFold(player: PlayerStub) : void {
    throw new Error('Method not implemented.');
    }

    doRaise(player: PlayerStub, amount: number) : void {
    throw new Error('Method not implemented.');
    }

    doRaiseBody(player: PlayerStub, amount: number) : void{
    throw new Error('Method not implemented.');
    }

    dealCard(): void {
    throw new Error('Method not implemented.');
    }

    dealCardsToPlayer(): void {
    throw new Error('Method not implemented.');
    }

    startARound(): void {
    throw new Error('Method not implemented.');
    }

    finishARound(): void {
    throw new Error('Method not implemented.');
    }

    getPlayerByID(id: number): PlayerStub {
    throw new Error('Method not implemented.');
    }

    getPlayerByUsername(name: string): PlayerStub {
        return this.ps;
    }

    setReturnPlayer(p: PlayerStub) {
        this.ps = p;
    }

    setID(id: number) {
        this.id = id;
    }
}