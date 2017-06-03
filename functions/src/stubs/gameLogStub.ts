import { gamePlayerLog } from "../logs/logObj"
import { Status } from "../player";

export class gameLogStub implements gamePlayerLog {
    logId: number;
    massage: string = "log";
    timestamp: Date = null;
    playerid: number = null;
    action: Status = null;
    raiseAmount: number = null;

    constructor() { }
}