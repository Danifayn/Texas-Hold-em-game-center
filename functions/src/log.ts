import * as assign from 'object.assign';
import {Status, Player} from "./player";

export class logEntry {
    logId: number;
    massage: string = "log";
    timestamp: Date = null;

    constructor(id?: number, msg?: string, date?:Date) {
        this.logId = id;
        this.massage = msg;
        this.timestamp = date;
    }
    
    static from(json: any): logEntry {
        let log: logEntry = assign(new logEntry(),json);
        return log;
    }
}

export class gamePlayerLog extends logEntry {
    playerid: number = null;
    action: Status = null;
    raiseAmount: number = null;

    constructor(id?: number, player?: Player, status?: Status, amount?: number, date?:Date) {
        super(id, "", date);
        if(status == Status.Check) {
            this.massage = player.playingUser + " checked";
        } else if(status == Status.Fold) {
            this.massage = player.playingUser + " folded";
        } else if(status == Status.Raise) {
            if(amount == 0)
                this.massage = player.playingUser + " called";
            else {
                this.massage = player.playingUser + " raised by " + amount;
                this.raiseAmount = amount;
            }
        }
        this.playerid = player.playerId;
        this.action = status;
    }
    
    static from(json: any): gamePlayerLog {
        let log: gamePlayerLog = assign(new gamePlayerLog(),json);
        return log;
    }
}

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
        if(action == logType.entering) {
            this.playerid = player.playerId;
            this.massage = player.playingUser + " has entered the game";
        } else 
        if(action == logType.leaving) {
            this.playerid = player.playerId;
            this.massage = player.playingUser + " has left the game";
        } else 
        if(action == logType.cardsToPlayer) {
            this.playerid = player.playerId;
            this.cards = cards;
            this.massage = "delt ";
            cards.forEach(x => this.massage += x + " ");
            this.massage += "to " + player.playingUser;
        } else 
        if(action == logType.cardsToTable) {
            this.cards = cards;
            this.massage = "opened "+ cards[0] + "on the table";
        }
    }
    
    static from(json: any): gameSystemLog {
        let log: gameSystemLog = assign(new gameSystemLog(),json);
        return log;
    }
}

export class errorLog extends logEntry {
    actionName: string = null;
    username: string = null;
    err: string = null;
    isCrit: boolean = null;

    constructor(id?: number, action?: string, user?: string, error?: string, critical?: boolean, date?: Date) {
        super(id, "", date);
        this.actionName = action;
        this.username = user;
        this.isCrit = critical;
        this.err = error;
        if(critical) this.massage = "[CRITIACL!!!] ";
        this.massage += user + " tried to use " + action + " and got " + error;
    }
    
    static from(json: any): errorLog {
        let log: errorLog = assign(new errorLog(),json);
        return log;
    }
}