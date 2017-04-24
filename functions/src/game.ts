import * as assign from 'object.assign';
import {Player, Status} from "./player";
import {User} from "./user";

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

const cardName = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const cardType = ['s', 'c', 'h', 'd'];

export class Card {
    type: CardType = CardType.Spade;
    number: CardRank = CardRank.Ace;

    constructor() {}

    static from(json: any): Card {
        console.log("3.3.3.1");
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

export class Game {
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
    pot: number[] = [0];
    potPlayers: number[][] = [];
    newPlayerId: number = 0;

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
    }

    addPlayer(user: User): void {
        this.allPlayers.push(new Player(this.newPlayerId, user, this));
        this.newPlayerId += 1;
    }

    doAction(status: Status, amount: number, player: Player): void {
        if(player.playerId != this.currentPlayer) {
            throw new Error('Not your turn!');
        }
        if(status == Status.Check) {
            if(player.lastBet != this.bet) {
                throw new Error('You cannot check if there is a bet!');
            }
            let i = this.activePlayers.indexOf(this.currentPlayer);
            i = (i+1) % this.activePlayers.length;
            this.currentPlayer = this.activePlayers[i];
        } else if(status == Status.Fold) {
            let i = this.activePlayers.indexOf(this.currentPlayer);
            this.activePlayers.splice(i, 1);
            this.potPlayers[0].splice(i, 1);
            i = i % this.activePlayers.length;
            this.currentPlayer = this.activePlayers[i];
            return;
        } else if(status == Status.Raise) {
            if(amount <= 0)
                throw new Error("You cannot raise by zero or by a negative number!");
            if(amount > player.money)
                throw new Error("You cannot bet for more then you have!");
            if(this.type == GameType.Limit) {
                if(this.stage == Stage.Preflop || this.stage == Stage.Flop) {
                    if(amount != this.smallBet)
                        throw new Error("You can only raise by the small bet!");
                } else {
                    if(amount != 2 *this.smallBet)
                        throw new Error("You can only raise by twice the small bet!");
                }
                player.lastBet += amount;
                player.money -= amount;
                this.bet = player.lastBet;
                this.pot[0] += amount;
            } else
            if(this.type == GameType.NoLimit) {
                let raiseSize = amount - (this.bet-player.lastBet);
                if(raiseSize != 0 && raiseSize < this.minBet)
                    throw new Error("You must raise over the min bet!");
                player.lastBet += amount;
                player.money -= amount;
                this.bet = player.lastBet;
                this.pot[0] += amount;
                this.minBet = raiseSize;
            } else {
                let raiseSize = amount - (this.bet-player.lastBet);
                if(raiseSize > this.pot[0] + (this.bet-player.lastBet))
                    throw new Error("You cannot raise for more than the pot!");
                player.lastBet += amount;
                player.money -= amount;
                this.bet = player.lastBet;
                this.pot[0] += amount;
            }
            let i = this.activePlayers.indexOf(this.currentPlayer);
            i = (i+1) % this.activePlayers.length;
            this.currentPlayer = this.activePlayers[i];
        }
    }

    dealCard(): void {
        if(this.openCards.length >= 5)
            return;
        let rnd = Math.floor(Math.random() * this.freeCards.length);
        this.openCards.push(this.freeCards[rnd]);
        this.freeCards.splice(rnd, 1);
    }

    dealCardsToPlayer(): void {
        for(let i = 0; i < this.allPlayers.length; i++) {
            let player = this.allPlayers[i];
            if(this.activePlayers.indexOf(player.playerId) != -1) {
                let rnd = Math.floor(Math.random() * this.freeCards.length);
                if(player.deal(this.freeCards[rnd])) {
                    this.freeCards.splice(rnd, 1);
                }
                rnd = Math.floor(Math.random() * this.freeCards.length);
                if(player.deal(this.freeCards[rnd])) {
                    this.freeCards.splice(rnd, 1);
                }
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
        this.potPlayers = [[]];
        this.allPlayers.map(x => this.activePlayers.push(x.playerId));
        this.allPlayers.map(x => this.potPlayers[0].push(x.playerId));
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
        this.pot[0] = smallBlindPlayer.lastBet;
        bigBlindPlayer.lastBet = this.minBet;
        bigBlindPlayer.money = bigBlindPlayer.money-bigBlindPlayer.lastBet;
        this.pot[0] += bigBlindPlayer.lastBet;
        this.bet = this.minBet;
        this.stage = Stage.Preflop;
    }

    finishARound(): void {
        let Hand = require('pokersolver').Hand;
        if(this.pot.length == 0) 
            return;
        if(this.potPlayers[0].length == 1) {
            this.getPlayerByID(this.potPlayers[0][0]).money += this.pot[0];
        } else {
            //fix this after adding functionallity
            //check https://github.com/chenosaurus/poker-evaluator
            this.getPlayerByID(this.potPlayers[0][0]).money += this.pot[0];
        }
        this.pot.splice(0,1);
        this.potPlayers.splice(0,1);
        this.finishARound();
    }

    getPlayerByID(id: number): Player {
        let pList = this.allPlayers.filter(p => {return p.playerId == id});
        if(pList.length == 0)
            return null;
        return pList[0];
    }

    static from(json: any): Game {
        console.log("3.3.1");
        let game: Game = assign(new Game(),json);
        console.log("3.3.2");
        game.openCards = game.openCards.map(x => Card.from(x));
        console.log("3.3.3");
        game.freeCards = game.freeCards.map(x => Card.from(x));
        console.log("3.3.4");
        game.allPlayers = game.allPlayers.map(x => Player.from(x));
        console.log("3.3.5");
        return game;
    }
}