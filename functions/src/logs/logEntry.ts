import * as assign from 'object.assign';
import { Status, Player } from "../player";

export class logEntry {
    logId: number;
    massage: string = "log";
    timestamp: Date = null;

    constructor(id?: number, msg?: string, date?: Date) {
        this.logId = id;
        this.massage = msg;
        this.timestamp = date;
    }

    static from(json: any): logEntry {
        let log: logEntry = assign(new logEntry(), json);
        log.timestamp = assign(new Date, log.timestamp);
        return log;
    }
}