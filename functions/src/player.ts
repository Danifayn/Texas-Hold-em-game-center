import {Card} from "./game";

export enum Status {
    Check,
    Raise,
    Fold,
}

export class Player {
    status: Status;
    lastBet: Number;
    hand: Card[];
    money: Number;

    
}