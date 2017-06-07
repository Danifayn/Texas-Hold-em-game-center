import * as Games from './games/gameObj';
import { User } from './user';
import { userStats } from './userStats'
import * as assign from 'object.assign';
import * as logs from "./logs/logObj";

export class GameCenter {
    private defaultLeague: number = -1;

    private users: { [uid: number]: User } = {};
    private stats: { [username: string]: userStats} = {};
    private games: { [id: number]: Games.Game } = {};
    private activeGames: number[] = [];
    private lastGameId = 0;
    private leaguesCriteria = [100, 200, 300, 400, 500, 600, 700, 800, 900, -1/*infinity*/];
    private lastUserId = 0;

    private errorLogId: number = 0;
    private errorLogs: logs.errorLog[] = [];
    private logId: number = 0;
    private logs: logs.logEntry[] = [];

    test: number = 0;

    reset() {    
        this.defaultLeague = -1;

        this.users = {};
        this.stats = {};
        this.games = {};
        this.lastGameId = 0;
        this.leaguesCriteria = [100, 200, 300, 400, 500, 600, 700, 800, 900, -1/*infinity*/];
        this.lastUserId = 0;

        this.errorLogId  = 0;
        this.errorLogs = [];
        this.logId = 0;
        this.logs = [];

        this.test = 0;
    }

    createGame(user: User,
        gameName: string,
        gameType: Games.GameType,
        buyin: number,
        initialChips: number,
        minBet: number,
        minPlayers: number,
        maxPlayers: number,
        spectatingAllowed: boolean) {
        if (!user)
            throw new Error('must be logged in to use this method !');
        let id = ++this.lastGameId;
        let game = null;
        if (gameType == Games.GameType.Limit)
            game = new Games.limitGame(id, gameName, user.league, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
        if (gameType == Games.GameType.NoLimit)
            game = new Games.noLimitGame(id, gameName, user.league, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
        if (gameType == Games.GameType.PotLimit)
            game = new Games.potLimitGame(id, gameName, user.league, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
        if (game == null)
            throw new Error("game has no type!!");
        game.addPlayer(user);
        this.games[id] = game;
        user.joinGame(game);
        this.logs.push(new logs.logEntry(++this.logId, user.username + " created a game with the id " + id, new Date()));
        this.activeGames.push(id);
        return id;
    }

    joinGame(user: User, gameId: number) {
        if (!user)
            throw new Error('must be logged in to use this method !');
        if (!this.games[gameId])
            throw new Error('game not found');
        if (user.activeGamesIds.indexOf(gameId) != -1)
            throw new Error('cannot join twice !');
        user.joinGame(this.games[gameId]);
        this.logs.push(new logs.logEntry(++this.logId, user.username + " joind the game with id " + gameId, new Date()));
    }

    spectateGame(user: User, gameId: number) {
        if (!user)
            throw new Error('must be logged in to use this method !');
        if (!this.games[gameId])
            throw new Error('game not found');
        user.spectateGame(this.games[gameId]);
        this.logs.push(new logs.logEntry(++this.logId, user.username + " spectates the game with id " + gameId, new Date()));
    }

    leaveGame(user: User, gameId: number) {
        if (!user)
            throw new Error('must be logged in to use this method !');
        if (!this.games[gameId])
            throw new Error('game not found');
        user.leaveGame(this.games[gameId]);
        this.games[gameId].removePlayer(user);
        this.logs.push(new logs.logEntry(++this.logId, user.username + " left the game with id " + gameId, new Date()));
    }

    quitGame(user: User, gameId: number) {
        if (!user)
            throw new Error('must be logged in to use this method !');
        if (!this.games[gameId])
            throw new Error('game not found');
        let game = this.games[gameId];
        user.leaveGame(game);
        user.endGame(game);
        this.stats[user.username].update((game.buyin * game.getPlayerByUserId(user.uId).money) / game.initialChips, game.buyin);
        if (user.gamesPlayed == 10)
            this.updateUserLeague(user);
        this.logs.push(new logs.logEntry(++this.logId, user.username + " quit the game with id " + gameId, new Date()));
    }

    register(username: string, password: string, email: string, uid?: string) {
        if (/^[a-zA-Z0-9- ]*$/.test(username) == false)
            throw new Error('username cannot contain special characters !');
        if (this.getUser(username))
            throw new Error('username already taken !');
        else {
            if(uid){
                    this.users[uid] = new User(uid, username, password, email, this.defaultLeague, 0);
                    this.stats[username] = new userStats(username);
            } else {
                this.users[username+"'s uId"] = new User(username+"'s uId", username, password, email, this.defaultLeague, 0);
                this.stats[username] = new userStats(username);
            }
        }
        this.logs.push(new logs.logEntry(++this.logId, username + " has registered with the password " + password, new Date()));
    }

    getUserById(uId: string): User {
        console.log('------ getUserById: ' + uId);
        console.log('------ users: ' , this.users);
        console.log(`------ users[${uId}]: ` + this.users[uId]);
        return this.users[uId];
    }

    getUser(username: string): User {
        for (let uid in this.users)
            if(this.users[uid].username == username)
                return this.users[uid];
        return null;
    }

    getGame(gameId: number): Games.Game {
        return this.games[gameId];
    }

    setUserLeague(user: User, username: string, league: number) {
        if (!this.getUser(username))
            throw new Error('user not found');
        this.getUser(username).setLeague(league);
        this.logs.push(new logs.logEntry(++this.logId, user.username + " has set " + username + "s league to be" + league, new Date()));
    }

    setLeagueCriteria(user: User, league: number, criteria: number) {
        if (!(0 <= league && league < this.leaguesCriteria.length))
            throw new Error('league must be between 0 and 10');
        if (criteria < 0)
            throw new Error('criteria must be positive');
        this.leaguesCriteria[league] = criteria;

        this.logs.push(new logs.logEntry(++this.logId, user.username + " has set " + league + " league cretiria to be " + criteria, new Date()));

        for (let uid in this.users)
            this.updateUserLeague(this.users[uid]);
    }

    private updateUserLeague(user: User) {
        while (user.league < this.leaguesCriteria.length &&
            user.points > this.leaguesCriteria[user.league]) {
            user.league++;
        }
        user.points = 0;
        this.logs.push(new logs.logEntry(++this.logId, user.username + " league was updated to " + user.league, new Date()));
    }

    weeklyUpdate() {
        let usernum = 0;
        for (let uid in this.users)
            if (this.users[uid].league != -1)
                usernum++;
        let leaguenum = Math.min(10, usernum / 2);
        let scores = [];
        for (let uid in this.users)
            if (this.users[uid].league != -1)
                scores.push(this.users[uid].points);
        scores.sort((a, b) => a - b);
        this.leaguesCriteria = [];
        for (let i = 0; i < leaguenum; i++) {
            this.leaguesCriteria.push(scores[i * usernum / leaguenum]);
        }
        for (let uid in this.users)
            if (this.users[uid].league != -1)
                this.updateUserLeague(this.users[uid]);
    }

    logError(url: string, params: any, e: Error) {
        this.errorLogs.push(new logs.errorLog(++this.errorLogId, url, "a", e.message, new Date(), JSON.stringify(params)));
    }

    getPlayableGames(user: User): number[] {
        let gamesIndexes = [];

        for (var newGame in this.games) {
            if (this.games[newGame]) {
                if (this.games[newGame].league == user.league || user.league == -1)
                    gamesIndexes.push(newGame);
            }
        }

        return gamesIndexes;
    };

    endGame(gId : number) {
        this.activeGames = this.activeGames.filter(x => x != gId);
    }

    setDefLeague(leagueNum: number) {
        this.defaultLeague = leagueNum;
    }

    getLeagueCret(leagueNum: number) {
        return this.leaguesCriteria[leagueNum];
    }

    removeUser(username: string) {
        let uId = this.getUser(username).uId;
        this.users[uId] = null;
    }

    removeGame(gId: number) {
        this.games[gId] = null;
    }

    // factory method to create a GameCenter instance from the json data from the db
    public static from(json: any): GameCenter {
        let gc: GameCenter = assign(new GameCenter(), json);
        gc.users = Object.keys(gc.users).reduce((acc, k) => ({ ...acc, [k]: User.from(gc.users[k]) }), {});
        gc.stats = Object.keys(gc.stats).reduce((acc, k) => ({ ...acc, [k]: userStats.from(gc.stats[k]) }), {});
        gc.games = Object.keys(gc.games).reduce((acc, k) => ({ ...acc, [k]: Games.Game.from(gc.games[k]) }), {});

        return gc;
    }
}