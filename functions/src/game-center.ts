import { Game, GameType } from './game';
import { User, Admin, ADMIN_USERNAME } from './user';
import * as assign from 'object.assign';

export class GameCenter {
    private defaultLeague: number;
    
    private users: {[username:string]: User} = {};
    private games: {[id: number]: Game} = {};
    private lastGameId = 0;
    private leaguesCriteria = [100,100,100,100,100,100,100,100,100,-1/*infinity*/];
    private lastUserId = 0;

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
        let game = new Game(id,user.league,gameType,buyin,initialChips,minBet,minPlayers,maxPlayers,spectatingAllowed);
        game.addPlayer(user);
        this.games[id] = game;
        user.joinGame(game);
        return id;
    }

    joinGame(user: User, gameId: number) {
        console.log("entering gcjg");
        if(!user)
           throw new Error('must be logged in to use this method !');
        if(!this.games[gameId])
           throw new Error('game not found');
        user.joinGame(this.games[gameId]);
    }

    spectateGame(user: User, gameId: number) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        if(!this.games[gameId])
           throw new Error('game not found');
        user.spectateGame(this.games[gameId]);
    }

    leaveGame(user: User, gameId: number) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        if(!this.games[gameId])
           throw new Error('game not found');
        this.games[gameId] = null;
        user.leaveGame(this.games[gameId]);
        this.updateUserLeague(user);
    }

    register(username: string, password: string, email: string) {
        if(/^[a-zA-Z0-9- ]*$/.test(username) == false)
            throw new Error('username cannot contain special characters !');
        if(this.users[username])
            throw new Error('username already taken !');
        else {
            let id = ++this.lastUserId;
            this.users[username] = new User(username, password, email, this.defaultLeague);
        }
    }

    getUser(username: string): User{
        return this.users[username];
    }

    getGame(gameId: number): Game{
        return this.games[gameId];
    }
      
    setDefaultLeague(user: User, league: number) {
        if(!(user instanceof Admin))
            throw new Error('must be an admin to use this method');
        this.defaultLeague = league;
    }

    setUserLeague(user: User, username: string, league: number) {
        if(!(user instanceof Admin))
            throw new Error('must be an admin to use this method');
        if(!this.users[username])
            throw new Error('user not found');
        this.users[username].setLeague(league);
    }

    setLeagueCriteria(user: User, league: number, criteria: number) {
        if(!(user instanceof Admin))
            throw new Error('must be an admin to use this method');
        if(!(0 <= league && league < this.leaguesCriteria.length))
            throw new Error('league must be between 0 and 10');
        if(criteria < 0)
            throw new Error('criteria must be positive');
        this.leaguesCriteria[league] = criteria

        for(let username in this.users)
            this.updateUserLeague(this.users[username]);
    }

    private updateUserLeague(user: User) {
        while(this.leaguesCriteria[user.league] > 0 && user.points > this.leaguesCriteria[user.league]){
            user.points -= this.leaguesCriteria[user.league];
            user.league++;
        }
    }

    // factory method to create a GameCenter instance from the json data from the db
    public static from(json: any): GameCenter{
        let gc: GameCenter = assign(new GameCenter(), json);
        gc.users = Object.keys(gc.users).reduce((acc,k) => ({...acc, [k]: User.from(gc.users[k])}),{});
        gc.games = Object.keys(gc.games).reduce((acc,k) => ({...acc, [k]: Game.from(gc.games[k])}),{});

        if(!gc.users[ADMIN_USERNAME])
            gc.users[ADMIN_USERNAME] = new Admin()
        return gc;
    }
}