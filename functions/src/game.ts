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
    freeCards: Card[] = Card.getAll();
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
        if(this.currentPlayer == null) {
            this.currentPlayer = player.id;
        }
    }

    doAction(status: Status, amount: Number, player: Player): void {
        if(player.id != this.currentPlayer) {
            player.err = true;
            return;
        }
        if(status == Status.Check) {
            if(player.lastBet != this.bet) {
                player.err = true;
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
            }
        }
    }

    static from(json: any): Game {
        let game: Game = assign(new Game(),json)
        game.openCards.map(x => Card.from(x));
        game.freeCards.map(x => Card.from(x));
        game.allPlayers.map(x => Player.from(x));
        return game;
    }
}