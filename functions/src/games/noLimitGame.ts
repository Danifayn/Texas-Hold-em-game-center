import * as assign from 'object.assign';
import {Game, Stage, GameType} from "./game";
import { Player, Status } from "../player";
import * as logs from "../logs/logObj";

export class noLimitGame extends Game {
    constructor(id?: number,
        name?: string,
        league?: number,
        buyin?: number,
        initialChips?: number,
        minBet?: number,
        minPlayers?: number,
        maxPlayers?: number,
        spectatingAllowed?: boolean) {
        super(id, name, league, GameType.NoLimit, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
    }

    raiseBody(player: Player, amount: number) {
        let raiseSize = amount - (this.bet - player.lastBet);
        if (raiseSize != 0 && raiseSize < this.minBet)
            throw new Error("You must raise over the min bet!");
        this.userLogs.push(new logs.gamePlayerLog(++this.logId, player, Status.Raise, raiseSize, new Date));
        player.lastBet += amount;
        player.money -= amount;
        this.bet = player.lastBet;
        this.pot += amount;
        this.minBet = raiseSize;
    }
}