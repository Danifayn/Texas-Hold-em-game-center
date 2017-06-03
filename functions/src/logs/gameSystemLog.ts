import * as assign from 'object.assign';
import { logEntry } from './logEntry'
import { Status, Player } from "../player";

export enum logType {
    entering,
    leaving,
    cardsToTable,
    cardsToPlayer
}

export class gameSystemLog extends logEntry {
    action: number = null;
    playerid: number = null;
    cards: string[] = null;

    constructor(id?: number, action?: logType, player?: Player, cards?: string[], date?: Date) {
        super(id, "", date);
        this.action = action;
        if (action == logType.cardsToTable) {
            this.cards = cards;
            this.massage = "opened " + cards[0] + "on the table";
        } else {
            this.playerid = player.playerId;
            if (action == logType.entering) {
                this.massage = player.playingUser + " has entered the game";
            } else
                if (action == logType.leaving) {
                    this.massage = player.playingUser + " has left the game";
                } else
                    if (action == logType.cardsToPlayer) {
                        this.cards = cards;
                        this.massage = "delt ";
                        cards.forEach(x => this.massage += x + " ");
                        this.massage += "to " + player.playingUser;
                    }
        }
    }

    static from(json: any): gameSystemLog {
        let log: gameSystemLog = assign(new gameSystemLog(), json);
        return log;
    }
}