import * as assign from 'object.assign';
import { logEntry } from './logEntry'
import { Status, Player } from "../player";

export class errorLog extends logEntry {
    actionName: string = null;
    username: string = null;
    err: string = null;

    constructor(id?: number, action?: string, user?: string, error?: string, date?: Date, params?: string) {
        super(id, "", date);
        this.actionName = action;
        this.username = user;
        this.err = error;
        this.massage += user + " tried to use " + action + " with the params " + params + " and got " + error;
    }

    static from(json: any): errorLog {
        let log: errorLog = assign(new errorLog(), json);
        log.timestamp = assign(new Date, log.timestamp);
        return log;
    }
}