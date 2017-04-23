import * as assign from 'object.assign';
import {Player, Status} from "./player";

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
            newCard.type = i/13;
            cards.push(newCard);
        }
        return cards;
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
    pot: number[] = [];
    potPlayers: number[][] = [];

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

    addPlayer(player: Player): void {
        this.allPlayers.push(player);
    }

    doAction(status: Status, amount: Number, player: Player): void {
        if(player.id != this.currentPlayer) {
            return;
        }
        if(status == Status.Check) {
            if(player.lastBet != this.bet) {
                return;
            }
        } else if(status == Status.Fold) {
            let i = this.activePlayers.indexOf(this.currentPlayer);
            this.activePlayers.splice(i, 1);
            i = i % this.activePlayers.length;
            this.currentPlayer = this.activePlayers[i];
            return;
        } else if(status == Status.Raise) {
            //TODO: do raise stuff
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
            if(this.activePlayers.indexOf(player.id) != -1) {
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
        this.dealCardsToPlayer();
        this.activePlayers = [];
        this.allPlayers.map(x => this.activePlayers.push());
        if(this.smallBet == null) {
            this.smallBet = this.allPlayers[0].id;
            this.currentPlayer = this.allPlayers[0].id;
        } else {
            this.smallBet = this.activePlayers[(this.activePlayers.indexOf(this.smallBet)+1)%this.activePlayers.length];
        }
        let smallBlindPlayer = this.getPlayerByID(this.currentPlayer);
        this.currentPlayer = this.activePlayers[(this.activePlayers.indexOf(this.currentPlayer) + 1)%this.activePlayers.length];
        let bigBlindPlayer = this.getPlayerByID(this.currentPlayer);
        this.currentPlayer = this.activePlayers[(this.activePlayers.indexOf(this.currentPlayer) + 1)%this.activePlayers.length];
        smallBlindPlayer.lastBet = Math.floor(this.minBet/2);
        smallBlindPlayer.money = smallBlindPlayer.money-smallBlindPlayer.lastBet;
        bigBlindPlayer.lastBet = this.minBet;
        bigBlindPlayer.money = bigBlindPlayer.money-bigBlindPlayer.lastBet;
        this.stage = Stage.Preflop;
    }

    finishARound(): void {
        if(this.pot.length == 0) 
            return;
        if(this.potPlayers[0].length == 1) {
            this.getPlayerByID(this.potPlayers[0][0]).money += this.pot[0];
        } else {
            let hands = this.potPlayers[0].map(id => {
                return this.openCards.concat(this.getPlayerByID(id).hand);
            });
            let best = 0;
            for(let i = 1; i < this.potPlayers[0].length; i++) {
                if(!this.betterHand(hands[best], hands[i]))
                    best = i;
            }
            this.getPlayerByID(this.potPlayers[0][best]).money += this.pot[0];
        }
        this.pot.splice(0,1);
        this.potPlayers.splice(0,1);
        this.finishARound();
    }

    betterHand(hand1: Card[], hand2: Card[]): boolean {
        
        return true;
        //change to really check
    }

    getPlayerByID(id: number): Player {
        let pList = this.allPlayers.filter(p => {return p.id == id});
        if(pList.length == 0)
            return null;
        return pList[0];
    }

    static from(json: any): Game {
        let game: Game = assign(new Game(),json)
        game.openCards = game.openCards.map(x => Card.from(x));
        game.freeCards = game.freeCards.map(x => Card.from(x));
        game.allPlayers = game.allPlayers.map(x => Player.from(x));
        return game;
    }
}