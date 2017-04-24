import { Game, GameType } from './game';
import { User } from './user';
import * as assign from 'object.assign';

export class GameCenter {
    private users: {[username:string]: User} = {};
    private games: {[id: number]: Game} = {};
    private lastGameId = 0;
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
    }

    register(username: string, password: string) {
        if(/^[a-zA-Z0-9- ]*$/.test(username) == false)
            throw new Error('username cannot contain special characters !');
        if(this.users[username])
            throw new Error('username already taken !');
        else {
            let id = ++this.lastUserId;
            this.users[username] = new User(username, password);
        }
    }

    getUser(username: string): User{
        return this.users[username];
    }

    getGame(gameId: number): Game{
        return this.games[gameId];
    }

    // factory method to create a GameCenter instance from the json data from the db
    public static from(json: any): GameCenter{
        console.log("3.1");
        let gc: GameCenter = assign(new GameCenter(), json);
        console.log("3.2");
        gc.users = Object.keys(gc.users).reduce((acc,k) => ({...acc, [k]: User.from(gc.users[k])}),{});
        console.log("3.3");
        gc.games = Object.keys(gc.games).reduce((acc,k) => ({...acc, [k]: Game.from(gc.games[k])}),{});
        console.log("3.4");
        return gc;
    }
}