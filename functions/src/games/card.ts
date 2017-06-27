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

export const cardName = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
export const cardType = ['s', 'c', 'h', 'd'];

export class Card {
    type: CardType = CardType.Spade;
    number: CardRank = CardRank.Ace;

    constructor() { }

    static from(json: any): Card {
        return assign(new Card(), json);
    }

    static getNewDeck(): Card[] {
        let cards = [];
        for (let i = 0; i < 52; i++) {
            let newCard = new Card();
            newCard.number = i % 13;
            newCard.type = Math.floor(i / 13);
            cards.push(newCard);
        }
        return cards;
    }

    toString(): string {
        return cardName[this.number] + cardType[this.type];
    }
}
