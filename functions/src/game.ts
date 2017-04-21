import * as assign from 'object.assign';

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

    static from(json: any): Card {
        return assign(new Card(),json);
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
    bet: number = 0;
    type: GameType = GameType.NoLimit;
    buyin: number = 0;
    league: number = 0;
    initialChips: number = 1;
    minBet: number = 1;
    minPlayers: number = 2;
    maxPlayers: number = 23;
    spectatingAllowed: boolean = true;

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

    static from(json: any): Game {
        let game: Game = assign(new Game(),json)
        game.openCards.map(x => Card.from(x));
        return game;
    }
}