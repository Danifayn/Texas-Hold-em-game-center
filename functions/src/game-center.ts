import { Game, GameType, limitGame, noLimitGame, potLimitGame } from './game';
import { User } from './user';
import * as assign from 'object.assign';
import {errorLog, logEntry} from "./log";

export class GameCenter {
    private defaultLeague: number = -1;
    
    private users: {[username:string]: User} = {};
    private games: {[id: number]: Game} = {};
    private lastGameId = 0;
    private leaguesCriteria = [100,100,100,100,100,100,100,100,100,-1/*infinity*/];
    private lastUserId = 0;

    private errorLogId: number = 0;
    private errorLogs: errorLog[] = [];
    private logId: number = 0;
    private logs: logEntry[] = [];

    test: number = 0;


    createGame(user: User, 
                gameType: GameType, 
                buyin: number, 
                initialChips: number, 
                minBet: number, 
                minPlayers: number, 
                maxPlayers: number, 
                spectatingAllowed: boolean) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        let id = ++this.lastGameId;
        let game = null;
        if(gameType == GameType.Limit)
            game = new limitGame(id,user.league,buyin,initialChips,minBet,minPlayers,maxPlayers,spectatingAllowed);
        if(gameType == GameType.NoLimit)
            game = new noLimitGame(id,user.league,buyin,initialChips,minBet,minPlayers,maxPlayers,spectatingAllowed);
        if(gameType == GameType.PotLimit)
            game = new potLimitGame(id,user.league,buyin,initialChips,minBet,minPlayers,maxPlayers,spectatingAllowed);
        if(game == null)
            throw new Error("game has no type!!");
        game.addPlayer(user);
        this.games[id] = game;
        user.joinGame(game);
        this.logs.push(new logEntry(++this.logId, user.username + " created a game with the id " + id, new Date()));
        return id;
    }

    joinGame(user: User, gameId: number) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        if(!this.games[gameId])
           throw new Error('game not found');
        if(user.activeGamesIds.indexOf(gameId) != -1)
           throw new Error('cannot join twice !');
        user.joinGame(this.games[gameId]);
        this.logs.push(new logEntry(++this.logId, user.username + " joind the game with id " + gameId, new Date()));
    }

    spectateGame(user: User, gameId: number) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        if(!this.games[gameId])
           throw new Error('game not found');
        user.spectateGame(this.games[gameId]);
        this.logs.push(new logEntry(++this.logId, user.username + " spectates the game with id " + gameId, new Date()));
    }

    leaveGame(user: User, gameId: number) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        if(!this.games[gameId])
           throw new Error('game not found');
        user.leaveGame(this.games[gameId]);
        this.games[gameId].removePlayer(user);
        this.logs.push(new logEntry(++this.logId, user.username + " left the game with id " + gameId, new Date()));
    }

    quitGame(user: User, gameId: number) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        if(!this.games[gameId])
           throw new Error('game not found');
        user.leaveGame(this.games[gameId]);
        user.endGame(this.games[gameId]);
        if(user.gamesPlayed == 10)
            this.updateUserLeague(user);
        this.logs.push(new logEntry(++this.logId, user.username + " quit the game with id " + gameId, new Date()));
    }

    register(username: string, password: string, email: string) {
        if(/^[a-zA-Z0-9- ]*$/.test(username) == false)
            throw new Error('username cannot contain special characters !');
        if(this.users[username])
            throw new Error('username already taken !');
        else {
            let id = ++this.lastUserId;
            this.users[username] = new User(username, password, email, this.defaultLeague, 0);
        }
        this.logs.push(new logEntry(++this.logId, username + " has registered with the password " + password, new Date()));
    }

    getUser(username: string): User{
        return this.users[username];
    }

    getGame(gameId: number): Game{
        return this.games[gameId];
    }

    setUserLeague(user: User, username: string, league: number) {
        if(!this.users[username])
            throw new Error('user not found');
        this.users[username].setLeague(league);
        this.logs.push(new logEntry(++this.logId, user.username + " has set " + username + "s league to be" + league, new Date()));
    }

    setLeagueCriteria(user: User, league: number, criteria: number) {
        if(!(0 <= league && league < this.leaguesCriteria.length))
            throw new Error('league must be between 0 and 10');
        if(criteria < 0)
            throw new Error('criteria must be positive');
        this.leaguesCriteria[league] = criteria;

        this.logs.push(new logEntry(++this.logId, user.username + " has set " + league + " league cretiria to be " + criteria, new Date()));

        for(let username in this.users)
            this.updateUserLeague(this.users[username]);
    }

    private updateUserLeague(user: User) {
        while(user.league < this.leaguesCriteria.length && 
                user.points > this.leaguesCriteria[user.league]){
            user.league++;
        }
        user.points = 0;
        this.logs.push(new logEntry(++this.logId, user.username + " league was updated to " + user.league, new Date()));
    }

    weeklyUpdate() {
        let usernum = 0;
        for(let username in this.users)
            if(this.users[username].league != -1)
                usernum++;
        let leaguenum = Math.min(10, usernum/2);
        let scores = [];
        for(let username in this.users)
            if(this.users[username].league != -1)
                scores.push(this.users[username].points);
        scores.sort((a,b)=>a-b);
        this.leaguesCriteria = [];
        for(let i = 0; i < leaguenum; i++) {
            this.leaguesCriteria.push(scores[i*usernum/leaguenum]);
        }
        for(let username in this.users)
            if(this.users[username].league != -1)
                this.updateUserLeague(this.users[username]);
    }

    logError(url: string, params: any, e: Error) {
        this.errorLogs.push(new errorLog(++this.errorLogId, url, params.username, e.message, new Date(), JSON.stringify(params)));
    }

    getPlayableGames(user: User) : number[]{
        let gamesIndexes = [];

        for(var newGame in this.games) {
            if(this.games[newGame]){
                if(this.games[newGame].league == user.league || user.league == -1)
                    gamesIndexes.push(newGame);
            }
        }

        return gamesIndexes;
    };

    // factory method to create a GameCenter instance from the json data from the db
    public static from(json: any): GameCenter{
        let gc: GameCenter = assign(new GameCenter(), json);
        gc.users = Object.keys(gc.users).reduce((acc,k) => ({...acc, [k]: User.from(gc.users[k])}),{});
        gc.games = Object.keys(gc.games).reduce((acc,k) => ({...acc, [k]: Game.from(gc.games[k])}),{});

        return gc;
    }
}