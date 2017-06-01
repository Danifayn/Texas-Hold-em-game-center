import * as assign from 'object.assign';
import {Player, Status} from "./player";
import {User} from "./user";
import {gamePlayerLog, gameSystemLog, logType} from "./log";

export enum CardType {
    Spade,
    Club,
    Heart,
    Diamond,
}

export enum CardRank {
    Ace,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
}

export const cardName = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
export const cardType = ['s', 'c', 'h', 'd'];

export class Card {
    type: CardType = CardType.Spade;
    number: CardRank = CardRank.Ace;

    constructor() {}

    static from(json: any): Card {
        return assign(new Card(),json);
    }

    static getAll(): Card[] {
        let cards = [];
        for(let i = 0; i < 52; i++) {
            let newCard = new Card();
            newCard.number = i % 13;
            newCard.type = Math.floor(i/13);
            cards.push(newCard);
        }
        return cards;
    }

    toString(): string {
        return cardName[this.number] + cardType[this.type];
    }
}

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
    allPlayers: Player[] = [];
    currentPlayer: number = null;
    activePlayers: number[] = [];
    smallBet: number = null;
    pot: number = 0;
    newPlayerId: number = 0;
    bigBlind: number = null;

    userLogs: gamePlayerLog[] = [];
    systemLogs : gameSystemLog[] = [];
    logId: number = 0;

    constructor(id?: number,
                league?: number,
                gameType?: GameType,
                buyin?: number,
                initialChips?: number,
                minBet?: number,
                minPlayers?: number,
                maxPlayers?: number,
                spectatingAllowed?: boolean) {
        this.id = id;
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
        this.allPlayers.forEach(x => exist = (exist || (x.playingUser == user.username)));
        if (!exist) {
            let newPlayer = new Player(this.newPlayerId, user, this);
            newPlayer.money = this.initialChips;
            this.allPlayers.push(newPlayer);
            this.systemLogs.push(new gameSystemLog(++this.logId, logType.entering, newPlayer, null, new Date()));
            this.newPlayerId += 1;
        } else {
            this.allPlayers.forEach(x => {if(x.playingUser == user.username) x.isActive == true;});
        }
    }

    removePlayer(user: User): void {
        this.allPlayers.forEach(x => {if(x.playingUser == user.username) x.isActive = false;});
    }

    doAction(status: Status, amount: number, player: Player): void {
        if(player.playerId != this.currentPlayer) {
            throw new Error('Not your turn!');
        }
        if(status == Status.Check) {
            this.doCheck(player);
        } else if(status == Status.Fold) {
            this.doFold(player);
        } else if(status == Status.Raise) {
            this.doRaise(player, amount);
        }
        if(player.playerId == this.bigBlind) {
            let isOver = true;
            for(let i = 0; i < this.activePlayers.length; i++) {
                isOver = isOver && (this.getPlayerByID(this.activePlayers[i]).lastBet == this.bet);
            }
            if(isOver) {
                if(this.stage == Stage.Preflop) {
                    this.dealCard();
                    this.dealCard();
                    this.dealCard();
                    this.stage = Stage.Flop;
                } else if(this.stage == Stage.Flop) {
                    this.dealCard();
                    this.stage = Stage.Turn;
                } else if(this.stage == Stage.Turn) {
                    this.dealCard();
                    this.stage = Stage.River;
                } else if(this.stage == Stage.River) {
                    this.finishARound();
                }
            }
        }
    }

    doCheck(player: Player) : void {
        if(player.lastBet != this.bet) {
                throw new Error('You cannot check if there is a bet!');
            }
            this.userLogs.push(new gamePlayerLog(++this.logId, player, Status.Check, null, new Date));
            let i = this.activePlayers.indexOf(this.currentPlayer);
            i = (i+1) % this.activePlayers.length;
            this.currentPlayer = this.activePlayers[i];
    }

    doFold(player: Player) : void {
            this.userLogs.push(new gamePlayerLog(++this.logId, player, Status.Fold, null, new Date));
            let i = this.activePlayers.indexOf(this.currentPlayer);
            this.activePlayers.splice(i, 1);
            i = i % this.activePlayers.length;
            this.currentPlayer = this.activePlayers[i];
            if(player.playerId == this.bigBlind)
                this.bigBlind = this.currentPlayer;
            if(this.activePlayers.length == 1)
                this.finishARound();
    }

    doRaise(player: Player, amount: number) : void {
            if(amount <= 0)
                throw new Error("You cannot raise by zero or by a negative number!");
            if(amount > player.money)
                throw new Error("You cannot bet for more then you have!");

            this.doRaiseBody(player, amount);

            let i = this.activePlayers.indexOf(this.currentPlayer);
            i = (i+1) % this.activePlayers.length;
            this.currentPlayer = this.activePlayers[i];
    }

    abstract doRaiseBody(player: Player, amount: number) : void;

    dealCard(): void {
        if(this.openCards.length >= 5)
            return;
        let rnd = Math.floor(Math.random() * this.freeCards.length);
        this.openCards.push(this.freeCards[rnd]);
        this.systemLogs.push(new gameSystemLog(++this.logId, logType.cardsToTable, null, [this.freeCards[rnd].toString()], new Date()));
        this.freeCards.splice(rnd, 1);
    }

    dealCardsToPlayer(): void {
        for(let i = 0; i < this.allPlayers.length; i++) {
            let player = this.allPlayers[i];
            if(this.activePlayers.indexOf(player.playerId) != -1) {
                let deltCards = [];
                let rnd = Math.floor(Math.random() * this.freeCards.length);
                if(player.deal(this.freeCards[rnd])) {
                    deltCards.push(this.freeCards[rnd].toString());
                    this.freeCards.splice(rnd, 1);
                }
                rnd = Math.floor(Math.random() * this.freeCards.length);
                if(player.deal(this.freeCards[rnd])) {
                    deltCards.push(this.freeCards[rnd].toString());
                    this.freeCards.splice(rnd, 1);
                }
                this.systemLogs.push(new gameSystemLog(++this.logId, logType.cardsToPlayer, player, deltCards, new Date()));
            }
        }
    }

    startARound(): void {
        this.freeCards = Card.getAll();
        this.openCards = [];
        this.allPlayers.forEach(player => {
            player.hand = [];
            player.lastBet = 0;
        })
        this.activePlayers = [];
        this.allPlayers.map(x => {if (x.isActive) this.activePlayers.push(x.playerId);});
        this.dealCardsToPlayer();
        if(this.smallBet == null) {
            this.smallBet = this.allPlayers[0].playerId;
            this.currentPlayer = this.allPlayers[0].playerId;
        } else {
            this.smallBet = this.activePlayers[(this.activePlayers.indexOf(this.smallBet)+1)%this.activePlayers.length];
        }
        let smallBlindPlayer = this.getPlayerByID(this.currentPlayer);
        this.currentPlayer = this.activePlayers[(this.activePlayers.indexOf(this.currentPlayer) + 1)%this.activePlayers.length];
        let bigBlindPlayer = this.getPlayerByID(this.currentPlayer);
        this.currentPlayer = this.activePlayers[(this.activePlayers.indexOf(this.currentPlayer) + 1)%this.activePlayers.length];
        smallBlindPlayer.lastBet = Math.floor(this.minBet/2);
        smallBlindPlayer.money = smallBlindPlayer.money-smallBlindPlayer.lastBet;
        this.pot = smallBlindPlayer.lastBet;
        bigBlindPlayer.lastBet = this.minBet;
        bigBlindPlayer.money = bigBlindPlayer.money-bigBlindPlayer.lastBet;
        this.pot += bigBlindPlayer.lastBet;
        this.bet = this.minBet;
        this.stage = Stage.Preflop;
        this.bigBlind = bigBlindPlayer.playerId;
    }

    finishARound(): void {
        var PokerEvaluator = require("poker-evaluator");
        if(this.activePlayers.length == 1) {
            this.getPlayerByID(this.activePlayers[0]).money += this.pot;
            this.getPlayerByID(this.activePlayers[0]).points += 20;
        } else {
            let evaledHands = this.activePlayers.map(pId => {
                let hand = this.getPlayerByID(pId).hand.concat(this.openCards);
                return PokerEvaluator.evalHand(hand.map(x => x.toString()));
            });
            let maxVal = -1;
            let maxP = 0;
            for(let i = 0; i < evaledHands.length; i++) {
                if(evaledHands[i].value > maxVal) {
                    maxVal = evaledHands[i].value;
                    maxP = i;
                }
            }
            this.getPlayerByID(this.activePlayers[maxP]).money += this.pot;
            this.getPlayerByID(this.activePlayers[maxP]).points += 20;
        }
    }

    getPlayerByID(id: number): Player {
        let pList = this.allPlayers.filter(p => {return p.playerId == id});
        if(pList.length == 0)
            return null;
        return pList[0];
    }

    getPlayerByUsername(name: string): Player {
        let pList = this.allPlayers.filter(p => {return p.playingUser == name});
        if(pList.length == 0)
            return null;
        return pList[0];
    }
    
    static from(json: any): Game {
        let game: Game = assign(new limitGame(),json);
        game.openCards = game.openCards.map(x => Card.from(x));
        game.freeCards = game.freeCards.map(x => Card.from(x));
        game.allPlayers = game.allPlayers.map(x => Player.from(x));
        game.userLogs = game.userLogs.map(x => gamePlayerLog.from(x));
        game.systemLogs = game.systemLogs.map(x => gameSystemLog.from(x));
        return game;
    }
}

export class limitGame extends Game {
    constructor(id?: number,
                league?: number,
                buyin?: number,
                initialChips?: number,
                minBet?: number,
                minPlayers?: number,
                maxPlayers?: number,
                spectatingAllowed?: boolean) {
        super(id, league, GameType.Limit, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
    }

    doRaiseBody(player: Player, amount: number) {
                let raiseSize = amount - (this.bet-player.lastBet);
                if(this.stage == Stage.Preflop || this.stage == Stage.Flop) {
                    if(raiseSize != this.minBet && raiseSize != 0)
                        throw new Error("You can only raise by the small bet!");
                } else {
                    if(raiseSize != 2 *this.minBet && raiseSize != 0)
                        throw new Error("You can only raise by twice the small bet!");
                }
                this.userLogs.push(new gamePlayerLog(++this.logId, player, Status.Raise, raiseSize, new Date));
                player.lastBet += amount;
                player.money -= amount;
                this.bet = player.lastBet;
                this.pot += amount;
    }
    
    static from(json: any): Game {
        let game: Game = assign(new noLimitGame(),json);
        game.openCards = game.openCards.map(x => Card.from(x));
        game.freeCards = game.freeCards.map(x => Card.from(x));
        game.allPlayers = game.allPlayers.map(x => Player.from(x));
        game.userLogs = game.userLogs.map(x => gamePlayerLog.from(x));
        game.systemLogs = game.systemLogs.map(x => gameSystemLog.from(x));
        return game;
    }
}

export class noLimitGame extends Game {
    constructor(id?: number,
                league?: number,
                buyin?: number,
                initialChips?: number,
                minBet?: number,
                minPlayers?: number,
                maxPlayers?: number,
                spectatingAllowed?: boolean) {
        super(id, league, GameType.NoLimit, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
    }

    doRaiseBody(player: Player, amount: number) {
                let raiseSize = amount - (this.bet-player.lastBet);
                if(raiseSize != 0 && raiseSize < this.minBet)
                    throw new Error("You must raise over the min bet!");
                this.userLogs.push(new gamePlayerLog(++this.logId, player, Status.Raise, raiseSize, new Date));
                player.lastBet += amount;
                player.money -= amount;
                this.bet = player.lastBet;
                this.pot += amount;
                this.minBet = raiseSize;
    }
    
    static from(json: any): Game {
        let game: Game = assign(new noLimitGame(),json);
        game.openCards = game.openCards.map(x => Card.from(x));
        game.freeCards = game.freeCards.map(x => Card.from(x));
        game.allPlayers = game.allPlayers.map(x => Player.from(x));
        game.userLogs = game.userLogs.map(x => gamePlayerLog.from(x));
        game.systemLogs = game.systemLogs.map(x => gameSystemLog.from(x));
        return game;
    }
}

export class potLimitGame extends Game {
    constructor(id?: number,
                league?: number,
                buyin?: number,
                initialChips?: number,
                minBet?: number,
                minPlayers?: number,
                maxPlayers?: number,
                spectatingAllowed?: boolean) {
        super(id, league, GameType.PotLimit, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
    }

    doRaiseBody(player: Player, amount: number) {
                let raiseSize = amount - (this.bet-player.lastBet);
                if(raiseSize > this.pot + (this.bet-player.lastBet))
                    throw new Error("You cannot raise for more than the pot!");
                this.userLogs.push(new gamePlayerLog(++this.logId, player, Status.Raise, raiseSize, new Date));
                player.lastBet += amount;
                player.money -= amount;
                this.bet = player.lastBet;
                this.pot += amount;
    }
    
    static from(json: any): Game {
        let game: Game = assign(new noLimitGame(),json);
        game.openCards = game.openCards.map(x => Card.from(x));
        game.freeCards = game.freeCards.map(x => Card.from(x));
        game.allPlayers = game.allPlayers.map(x => Player.from(x));
        game.userLogs = game.userLogs.map(x => gamePlayerLog.from(x));
        game.systemLogs = game.systemLogs.map(x => gameSystemLog.from(x));
        return game;
    }
}