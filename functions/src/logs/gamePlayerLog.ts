import * as assign from 'object.assign';
import { logEntry } from './logEntry'
import { Status, Player } from "../player";

export class gamePlayerLog extends logEntry {
    playerid: number = null;
    action: Status = null;
    raiseAmount: number = null;

    constructor(id?: number, player?: Player, status?: Status, amount?: number, date?: Date) {
        super(id, "", date);
        if (status == Status.Check) {
            this.massage = player.userId + " checked";
        } else if (status == Status.Fold) {
            this.massage = player.userId + " folded";
        } else if (status == Status.Raise) {
            if (amount == 0)
                this.massage = player.userId + " called";
            else {
                this.massage = player.userId + " raised by " + amount;
                this.raiseAmount = amount;
            }
        }
        this.playerid = player.playerId;
        this.action = status;
    }

    static from(json: any): gamePlayerLog {
        let log: gamePlayerLog = assign(new gamePlayerLog(), json);
        log.timestamp = assign(new Date, log.timestamp);
        return log;
    }
}