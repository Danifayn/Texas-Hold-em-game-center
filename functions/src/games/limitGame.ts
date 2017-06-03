import * as assign from 'object.assign';
import {Game, Stage, GameType} from "./game";
import { Player, Status } from "../player";
import * as logs from "../logs/logObj";

export class limitGame extends Game {
    constructor(id?: number,
        league?: number,
        buyin?: number,
        initialChips?: number,
        minBet?: number,
        minPlayers?: number,
        maxPlayers?: number,
        spectatingAllowed?: boolean) {
        super(id, league, GameType.Limit, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
    }

    raiseBody(player: Player, amount: number) {
        let raiseSize = amount - (this.bet - player.lastBet);
        if (this.stage == Stage.Preflop || this.stage == Stage.Flop) {
            if (raiseSize != this.minBet && raiseSize != 0)
                throw new Error("You can only raise by the small bet!");
        } else {
            if (raiseSize != 2 * this.minBet && raiseSize != 0)
                throw new Error("You can only raise by twice the small bet!");
        }
        this.userLogs.push(new logs.gamePlayerLog(++this.logId, player, Status.Raise, raiseSize, new Date));
        player.lastBet += amount;
        player.money -= amount;
        this.bet = player.lastBet;
        this.pot += amount;
    }
}