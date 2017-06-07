import * as assign from 'object.assign';
import { Player, Status } from "../player";
import { User } from "../user";
import * as logs from "../logs/logObj";
import * as Cards from "./card";
import * as GT from "./gameObj";

export enum Stage {
    Preflop,
    Flop,
    Turn,
    River
}

export enum GameType {
    Limit,
    NoLimit,
    PotLimit
}

export abstract class Game {
    publics: gamePublics;
    privates: gamePrivates;

    constructor(id?: number,
        name?: string,
        league?: number,
        gameType?: GameType,
        buyin?: number,
        initialChips?: number,
        minBet?: number,
        minPlayers?: number,
        maxPlayers?: number,
        spectatingAllowed?: boolean) {

        this.publics = new gamePublics();
        this.privates = new gamePrivates();

        this.gameId = id;
        this.gameName = name;
        this.type = gameType;
        this.buyin = buyin;
        this.league = league;
        this.initialChips = initialChips;
        this.minBet = minBet;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
        this.spectatingAllowed = spectatingAllowed;
        this.newPlayerId = 0;
    }

    addPlayer(user: User): void {
        let exist = false;
        this.allPlayers.forEach(x => exist = (exist || (x.userId == user.uId)));
        if (!exist) {
            this.addNewPlayer(user);
        } else {
            this.restoreOldPlayer(user);
        }
    }

    private addNewPlayer(user: User) {
        if (user.money >= this.buyin) {
            user.money -= this.buyin;
            let newPlayer = new Player(this.newPlayerId, user, this);
            newPlayer.money = this.initialChips;
            this.allPlayers.push(newPlayer);
            this.systemLogs.push(new logs.gameSystemLog(++this.logId, logs.logType.entering, newPlayer, null, new Date()));
            this.newPlayerId += 1;
            this.playerAmount += 1;
        }
    }

    private restoreOldPlayer(user: User) {
        this.allPlayers.forEach(x => { if (x.userId == user.uId) x.isActive == true; });
    }

    removePlayer(user: User): void {
        this.allPlayers.forEach(x => { if (x.userId == user.uId) x.isActive = false; });
    }

    doAction(status: Status, amount: number, player: Player): void {
        if (player.playerId != this.currentPlayer) {
            throw new Error('Not your turn!');
        }
        if (status == Status.Check) {
            this.check(player);
        } else if (status == Status.Fold) {
            this.fold(player);
        } else if (status == Status.Raise) {
            this.raise(player, amount);
        }
        if (player.playerId == this.bigBlind) {
            this.nextStage();
        }
    }

    private nextStage() {
        let isOver = true;
        for (let i = 0; i < this.activePlayers.length; i++)
            isOver = isOver && (this.getPlayerByID(this.activePlayers[i]).lastBet == this.bet);
        if (isOver) {
            if (this.stage == Stage.Preflop) {
                this.openCardsOnTable(3);
                this.stage = Stage.Flop;
            } else if (this.stage == Stage.Flop) {
                this.openCardsOnTable(1);
                this.stage = Stage.Turn;
            } else if (this.stage == Stage.Turn) {
                this.openCardsOnTable(1);
                this.stage = Stage.River;
            } else if (this.stage == Stage.River) {
                this.finishARound();
            }
        }
    }

    private check(player: Player): void {
        if (player.lastBet != this.bet) {
            throw new Error('You cannot check if there is a bet!');
        }
        this.userLogs.push(new logs.gamePlayerLog(++this.logId, player, Status.Check, null, new Date));
        let i = this.activePlayers.indexOf(this.currentPlayer);
        i = (i + 1) % this.activePlayers.length;
        this.currentPlayer = this.activePlayers[i];
    }

    private fold(player: Player): void {
        this.userLogs.push(new logs.gamePlayerLog(++this.logId, player, Status.Fold, null, new Date));
        let i = this.activePlayers.indexOf(this.currentPlayer);
        this.activePlayers.splice(i, 1);
        i = i % this.activePlayers.length;
        this.currentPlayer = this.activePlayers[i];
        if (player.playerId == this.bigBlind)
            this.bigBlind = this.currentPlayer;
        //player.playingUser
        if (this.activePlayers.length == 1)
            this.finishARound();
    }

    private raise(player: Player, amount: number): void {
        if (amount <= 0)
            throw new Error("You cannot raise by zero or by a negative number!");
        if (amount > player.money)
            throw new Error("You cannot bet for more then you have!");

        this.raiseBody(player, amount);

        let i = this.activePlayers.indexOf(this.currentPlayer);
        i = (i + 1) % this.activePlayers.length;
        this.currentPlayer = this.activePlayers[i];
    }

    abstract raiseBody(player: Player, amount: number): void;

    private openCardsOnTable(amount: number): void {
        for (let i = 0; i < amount; i++) {
            if (this.tableCards.length >= 5)
                return;
            let rnd = Math.floor(Math.random() * this.deck.length);
            this.tableCards.push(this.deck[rnd]);
            this.systemLogs.push(new logs.gameSystemLog(++this.logId, logs.logType.cardsToTable, null, [this.deck[rnd].toString()], new Date()));
            this.deck.splice(rnd, 1);
        }
    }

    private dealCardsToPlayer(): void {
        for (let i = 0; i < this.allPlayers.length; i++) {
            let player = this.allPlayers[i];
            if (this.activePlayers.indexOf(player.playerId) != -1) {
                this.dealSingleCardToPlayer(player);
                this.dealSingleCardToPlayer(player);
            }
        }
    }

    private dealSingleCardToPlayer(player: Player) {
        let rnd = Math.floor(Math.random() * this.deck.length);
        this.systemLogs.push(new logs.gameSystemLog(++this.logId, logs.logType.cardsToPlayer, player, [this.deck[rnd].toString()], new Date()));
        if (player.dealCards(this.deck[rnd])) {
            this.deck.splice(rnd, 1);
        }
    }

    startARound(): void {
        this.resetTable();
        this.dealCardsToPlayer();
        if (this.smallBlind == null) {
            this.smallBlind = this.allPlayers[0].playerId;
            this.currentPlayer = this.allPlayers[0].playerId;
        } else {
            this.smallBlind = this.activePlayers[(this.activePlayers.indexOf(this.smallBlind) + 1) % this.activePlayers.length];
        }
        let smallBlindPlayer = this.getPlayerByID(this.currentPlayer);
        this.advanceCurrPlayer();
        let bigBlindPlayer = this.getPlayerByID(this.currentPlayer);
        this.advanceCurrPlayer();
        this.setBeginingBets(smallBlindPlayer, bigBlindPlayer);
        this.bigBlind = bigBlindPlayer.playerId;
    }

    private resetTable() {
        this.deck = Cards.Card.getNewDeck();
        this.tableCards = [];
        this.allPlayers.forEach(player => {
            player.hand = [];
            player.lastBet = 0;
        })
        this.activePlayers = [];
        this.allPlayers.map(x => { if (x.isActive) this.activePlayers.push(x.playerId); });
        this.pot = 0;
        this.bet = this.minBet;
        this.stage = Stage.Preflop;
    }

    private advanceCurrPlayer() {
        this.currentPlayer = this.activePlayers[(this.activePlayers.indexOf(this.currentPlayer) + 1) % this.activePlayers.length];
    }

    private setBeginingBets(smallBlindPlayer, bigBlindPlayer) {
        smallBlindPlayer.lastBet = Math.floor(this.minBet / 2);
        smallBlindPlayer.money = smallBlindPlayer.money - smallBlindPlayer.lastBet;
        this.pot = smallBlindPlayer.lastBet;
        bigBlindPlayer.lastBet = this.minBet;
        bigBlindPlayer.money = bigBlindPlayer.money - bigBlindPlayer.lastBet;
        this.pot += bigBlindPlayer.lastBet;
    }

    finishARound(): void {
        if (this.activePlayers.length == 1) {
            this.giveWinReward(0);
        } else {
            this.giveWinReward(this.getRoundWinner());
        }
    }

    private getRoundWinner(): number {
        var PokerEvaluator = require("poker-evaluator");
        let evaledHands = this.activePlayers.map(pId => {
            let hand = this.getPlayerByID(pId).hand.concat(this.tableCards);
            return PokerEvaluator.evalHand(hand.map(x => x.toString()));
        });
        let maxVal = -1;
        let maxP = 0;
        for (let i = 0; i < evaledHands.length; i++) {
            if (evaledHands[i].value > maxVal) {
                maxVal = evaledHands[i].value;
                maxP = i;
            }
        }
        return maxP;
    }

    private giveWinReward(index: number) {
        this.getPlayerByID(this.activePlayers[index]).money += this.pot;
        this.getPlayerByID(this.activePlayers[index]).points += 5;
    }

    getPlayerByID(id: number): Player {
        let pList = this.allPlayers.filter(p => { return p.playerId == id });
        if (pList.length == 0)
            return null;
        return pList[0];
    }

    getPlayerByUserId(uId: string): Player {
        let pList = this.allPlayers.filter(p => { return p.userId == uId });
        if (pList.length == 0)
            return null;
        return pList[0];
    }

    endGame() {
        this.spectatingAllowed = false;
        this.allPlayers = [];
        this.currentPlayer = null;
        this.activePlayers = [];
    }

    static from(json: any): Game {
        let game: Game = this.getTypedGame(json);
        if (game == null)
            throw new Error("cannot create Game!");

        game.publics = gamePublics.from(game.publics);
        game.privates = gamePrivates.from(game.privates);

        return game;
    }

    private static getTypedGame(json: any): Game {
        let gType;
        try {
            gType = json.publics.type;
        } catch (e) {
            return null;
        }
        if (gType == GameType.NoLimit)
            return assign(new GT.noLimitGame(), json);
        if (gType == GameType.Limit)
            return assign(new GT.limitGame(), json);
        if (gType == GameType.PotLimit)
            return assign(new GT.potLimitGame(), json);
        return null;
    }

    get gameId():number {
	return this.publics.gameId;
    }
    set gameId(setter:number) {
        this.publics.gameId = setter;
    }

    get gameName():string {
	return this.publics.gameName;
    }
    set gameName(setter:string) {
        this.publics.gameName = setter;
    }

    get spectatingAllowed():boolean {
        return this.publics.spectatingAllowed;
    }
    set spectatingAllowed(setter:boolean) {
        this.publics.spectatingAllowed = setter;
    }

    get type():GameType {
        return this.publics.type;
    }
    set type(setter:GameType) {
        this.publics.type = setter;
    }

    get buyin():number {
        return this.publics.buyin;
    }
    set buyin(setter:number) {
        this.publics.buyin = setter;
    }

    get league():number {
        return this.publics.league;
    }
    set league(setter:number) {
        this.publics.league = setter;
    }

    get minBet():number {
        return this.publics.minBet;
    }
    set minBet(setter:number) {
        this.publics.minBet = setter;
    }

    get initialChips():number {
        return this.publics.initialChips;
    }
    set initialChips(setter:number) {
        this.publics.initialChips = setter;
    }

    get minPlayers():number {
        return this.publics.minPlayers;
    }
    set minPlayers(setter:number) {
        this.publics.minPlayers = setter;
    }

    get maxPlayers():number {
        return this.publics.maxPlayers;
    }
    set maxPlayers(setter:number) {
        this.publics.maxPlayers = setter;
    }

    get stage():Stage {
        return this.publics.stage;
    }
    set stage(setter:Stage) {
        this.publics.stage = setter;
    }

    get pot():number {
        return this.publics.pot;
    }
    set pot(setter:number) {
        this.publics.pot = setter;
    }

    get bet():number {
        return this.publics.bet;
    }
    set bet(setter:number) {
        this.publics.bet = setter;
    }

    get smallBlind():number {
        return this.publics.smallBlind;
    }
    set smallBlind(setter:number) {
        this.publics.smallBlind = setter;
    }

    get bigBlind():number {
        return this.publics.bigBlind;
    }
    set bigBlind(setter:number) {
        this.publics.bigBlind = setter;
    }
    
    get tableCards():Cards.Card[] {
        return this.publics.tableCards;
    }
    set tableCards(setter:Cards.Card[]) {
        this.publics.tableCards = setter;
    }

    get playerAmount():number {
        return this.publics.playerAmount;
    }
    set playerAmount(setter:number) {
        this.publics.playerAmount = setter;
    }

    get newPlayerId():number {
        return this.privates.newPlayerId;
    }
    set newPlayerId(setter:number) {
        this.privates.newPlayerId = setter;
    }

    get allPlayers():Player[] {
        return this.privates.allPlayers;
    }
    set allPlayers(setter:Player[]) {
        this.privates.allPlayers = setter;
    }

    get currentPlayer():number {
        return this.privates.currentPlayer;
    }
    set currentPlayer(setter:number) {
        this.privates.currentPlayer = setter;
    }

    get activePlayers():number[] {
        return this.privates.activePlayers;
    }
    set activePlayers(setter:number[]) {
        this.privates.activePlayers = setter;
    }

    get deck():Cards.Card[] {
        return this.privates.deck;
    }
    set deck(setter:Cards.Card[]) {
        this.privates.deck = setter;
    }

    get userLogs():logs.gamePlayerLog[] {
        return this.privates.userLogs;
    }
    set userLogs(setter:logs.gamePlayerLog[]) {
        this.privates.userLogs = setter;
    }

    get systemLogs():logs.gameSystemLog[] {
        return this.privates.systemLogs;
    }
    set systemLogs(setter:logs.gameSystemLog[]) {
        this.privates.systemLogs = setter;
    }

    get logId():number {
        return this.privates.logId;
    }
    set logId(setter:number) {
        this.privates.logId = setter;
    }
}

class gamePublics {
    gameId: number;
    gameName: string = "no name";
    spectatingAllowed: boolean = true;
    type: GameType = null;
    buyin: number = 0;
    league: number = 0;
    minBet: number = 1;
    initialChips: number = 1;
    minPlayers: number = 2;
    maxPlayers: number = 23;
    stage: Stage = Stage.Preflop;
    pot: number = 0;
    bet: number = 0;
    smallBlind: number = null;
    bigBlind: number = null;
    tableCards: Cards.Card[] = [];
    playerAmount: number = 0;

    static from(json: any): gamePublics {
        let game: gamePublics = assign(new gamePublics(), json);

        game.tableCards = game.tableCards.map(x => Cards.Card.from(x));
        return game;
    }
}

class gamePrivates {
    newPlayerId: number = 0;
    allPlayers: Player[] = [];
    currentPlayer: number = null;
    activePlayers: number[] = [];
    deck: Cards.Card[] = [];
    userLogs: logs.gamePlayerLog[] = [];
    systemLogs: logs.gameSystemLog[] = [];
    logId: number = 0;

    static from(json: any): gamePrivates {
        let game: gamePrivates = assign(new gamePrivates(), json);

        game.deck = game.deck.map(x => Cards.Card.from(x));
        game.allPlayers = game.allPlayers.map(x => Player.from(x));
        game.userLogs = game.userLogs.map(x => logs.gamePlayerLog.from(x));
        game.systemLogs = game.systemLogs.map(x => logs.gameSystemLog.from(x));
        return game;
    }
}