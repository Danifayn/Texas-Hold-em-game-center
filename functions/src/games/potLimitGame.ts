import * as assign from 'object.assign';
import {Game, Stage, GameType} from "./game";
import { Player, Status } from "../player";
import * as logs from "../logs/logObj";

export class potLimitGame extends Game {
    constructor(id?: number,
        name?: string,
        league?: number,
        buyin?: number,
        initialChips?: number,
        minBet?: number,
        minPlayers?: number,
        maxPlayers?: number,
        spectatingAllowed?: boolean) {
        super(id, name, league, GameType.PotLimit, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
    }

    raiseBody(player: Player, amount: number) {
        let raiseSize = amount - (this.bet - player.lastBet);
        if (raiseSize > this.pot + (this.bet - player.lastBet))
            throw new Error("You cannot raise for more than the pot!");
        this.userLogs.push(new logs.gamePlayerLog(++this.logId, player, Status.Raise, raiseSize, new Date));
        player.lastBet += amount;
        player.money -= amount;
        this.bet = player.lastBet;
        this.pot += amount;
    }
}