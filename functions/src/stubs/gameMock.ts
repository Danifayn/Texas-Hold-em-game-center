import { Game, GameType, Stage } from "../games/gameObj"
import { Status } from "../player"
import { UserMock } from "./usermock"
import * as logs from "../logs/logObj"
import * as Cards from "../games/card"
import { PlayerStub } from "./playerStub"

export class GameMock extends Game {
    gameId: number;
    spectatingAllowed: boolean = true;
    type: GameType = null;
    buyin: number = 0;
    league: number = 0;
    newPlayerId: number = 0;
    minBet: number = 1;
    initialChips: number = 1;
    minPlayers: number = 2;
    maxPlayers: number = 23;

    stage: Stage = Stage.Preflop;
    pot: number = 0;
    bet: number = 0;

    allPlayers: PlayerStub[] = [];
    currentPlayer: number = null;
    activePlayers: number[] = [];
    smallBlind: number = null;
    bigBlind: number = null;

    tableCards: Cards.Card[] = [];
    deck: Cards.Card[] = [];

    userLogs: logs.gamePlayerLog[] = [];
    systemLogs: logs.gameSystemLog[] = [];
    logId: number = 0;

    ps: PlayerStub;

    constructor() {
        super();
     }

    addPlayer(user: UserMock): void {
        throw new Error('Method not implemented.');
    }

    removePlayer(user: UserMock): void {
        throw new Error('Method not implemented.');
    }

    doAction(status: Status, amount: number, player: PlayerStub): void {
        throw new Error('Method not implemented.');
    }

    raiseBody(player: PlayerStub, amount: number): void {
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

    endGame() {
        throw new Error('Method not implemented.');
    }

    static from(json: any): Game {
        throw new Error('Method not implemented.');
    }

    getPlayerByUsername(name: string): PlayerStub {
        return this.ps;
    }

    setReturnPlayer(p: PlayerStub) {
        this.ps = p;
    }

    setID(id: number) {
        this.gameId = id;
    }
}