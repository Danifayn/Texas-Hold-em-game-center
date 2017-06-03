import { Card, CardType, CardRank } from "../games/gameObj"

export class CardStub implements Card {
    type: CardType = CardType.Spade;
    number: CardRank = CardRank.Ace;

    constructor() { }
}