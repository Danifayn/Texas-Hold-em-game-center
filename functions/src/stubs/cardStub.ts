import {Card, CardType, CardRank} from "../game"

export class CardStub implements Card {
    type: CardType = CardType.Spade;
    number: CardRank = CardRank.Ace;

    constructor() {}
}