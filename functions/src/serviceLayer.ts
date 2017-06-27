import { createHandler } from './service';
import { User } from './user';
import { GameCenter } from './game-center';
import { Player } from './player';
import * as functions from 'firebase-functions'
import * as assign from 'object.assign';
import * as Game from "./games/gameObj";

export const register = (gc: GameCenter, username: string, password: string, email: string, uid?: string) => {
    gc.register(username, password, email, uid);//problem here
};


export const createGame = ( gc: GameCenter, 
                            user: User,
                            gameName: string,
                            gameType: number,
                            buyin: number,
                            initialChips: number,
                            minBet: number,
                            minPlayers: number,
                            maxPlayers: number,
                            spectatingAllowed: boolean) => {
    return gc.createGame(user, gameName, gameType, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
};

export const joinGame = (gc: GameCenter, user: User, gameId: number) => {
    gc.joinGame(user, gameId);
    gc.getGame(gameId).addPlayer(user);
};

export const spectateGame = (gc: GameCenter, user: User, gameId: number) => {
    gc.spectateGame(user, gameId);
};

export const leaveGame = (gc: GameCenter, user: User, gameId: number) => {
    gc.leaveGame(user, gameId);
};

//check/fold/raise
export const playerAction = (gc: GameCenter,
                            user: User,
                            playerId: number,
                            gameId: number,
                            newStatus: number,
                            newBet: number) => {
    let playerID = playerId;
    let game = gc.getGame(gameId);
    let player = game.getPlayerByID(playerId);
    player.status = newStatus;
    console.log(playerID + ";" + player.playerId + ";" + gameId + ";" + game.gameId);
    game.doAction(player.status, newBet, player);
};

//start round
export const startRound = (gc: GameCenter, gameId: number) => {
    gc.getGame(gameId).startARound();
};

export const changePassword = (gc: GameCenter,user: User, newPassword: string) => {
    user.setPassword(newPassword);
};

export const changeEmail = (gc: GameCenter, user: User, newEmail: string) => {
    user.setEmail(newEmail);
};

export const setUserLeague = (gc: GameCenter,user: User, league: number, userToChange: string) => {
    gc.setUserLeague(user,userToChange,league);
};

export const setLeagueCriteria = (gc: GameCenter, user: User, league: number, criteria: number) => {
    gc.setLeagueCriteria(user,league,criteria);
};

export const getPlayableGames = (gc: GameCenter, user: User) => {
    return gc.getPlayableGames(user);
};

export const endGame = (gc: GameCenter, user: User, gID: number) => {
    let finishedgame = gc.getGame(gID);
    finishedgame.allPlayers.forEach(player => {
        let user = gc.getUserById(player.userId);
        gc.quitGame(user, gID);
    });
    finishedgame.endGame();
    gc.endGame(gID);
}

export const weeklyUpdate = (gc: GameCenter, user:User) => {
    gc.weeklyUpdate();
}

export const reset = (gc: GameCenter) => {
    gc.reset();
    gc.register("test1", "123456", "test1@test.com");
    gc.register("test2", "asdasd", "test2@test.com");
    gc.register("test3", "111111", "test3@test.com");
    gc.createGame(gc.getUser("test1"), "game1", 0, 10, 20, 2, 2, 4, false);
    gc.createGame(gc.getUser("test2"), "game2", 1, 10, 20, 2, 2, 4, true);
    gc.joinGame(gc.getUser("test3"), 1);
    gc.getGame(1).addPlayer(gc.getUser("test3"));
    gc.spectateGame(gc.getUser("test3"), 2);
}

//for tests

export const isUserExisting = (gc: GameCenter, username: string) => { 
    return gc.getUser(username) != null;
}

export const deleteUSer = (gc: GameCenter, username: string) => { 
    gc.removeUser(username);
 }
export const isGameExisting = (gc: GameCenter, gId: number) => { 
    return gc.getGame(gId) != null;
 }

export const deleteGame = (gc: GameCenter, gId: number) => { 
    gc.removeGame(gId);
 };

export const isUSerPlaying = (gc: GameCenter, username: string, gId: number) => { 
    return gc.getUser(username).activeGamesIds.filter(x => x == gId).length != 0
 }

export const isUserSpectating = (gc: GameCenter, username: string, gId: number) => { 
    return gc.getUser(username).spectatingGamesIds.filter(x => x == gId).length != 0;
 }

export const isGameReady = (gc: GameCenter, gId: number) => { 
    return gc.getGame(gId).minPlayers <= gc.getGame(gId).activePlayers.length;
 }

export const getUserCash = (gc: GameCenter, username: string) => {
    return gc.getUser(username).money;
 }

export const getPlayerCards = (gc: GameCenter, username: string, gId: number) => { 
    return gc.getGame(gId).getPlayerByUserId(gc.getUser(username).uId).hand.map(card => card.toString());
 }

export const getPlayerBet = (gc: GameCenter, username: string, gId: number) => { 
    return gc.getGame(gId).getPlayerByUserId(gc.getUser(username).uId).lastBet;
 }

export const getCurrPlayer = (gc: GameCenter, gId: number) => { 
    let myGame = gc.getGame(gId);
    return gc.getUserById(myGame.getPlayerByID(myGame.currentPlayer).userId);
 }

export const getPot = (gc: GameCenter, gId: number) => { 
    return gc.getGame(gId).pot; 
}

export const setPot = (gc: GameCenter, newPot: number, gId: number) => { 
    gc.getGame(gId).pot = newPot; 
}

export const setBigBlind = (gc: GameCenter, gId: number, newBlind: number) => { 
    gc.getGame(gId).bigBlind = newBlind;
 }

export const setPlayerChips = (gc: GameCenter, username: string, gId:number, chips: number) => { 
    let uid = gc.getUser(username).uId;
    let thisGame = gc.getGame(gId);
    thisGame.allPlayers = thisGame.allPlayers.map(x => {
        if(x.userId == uid){
            x.money = chips;
        }
        return x;
    });
 }

export const getLeagueCriteria = (gc: GameCenter, league: number) => { 
    return gc.getLeagueCret(league);
 }

export const getUserLeague = (gc: GameCenter, username: string) => { 
    return gc.getUser(username).league;
 }

export const setDefLeague = (gc: GameCenter, league: number) => { 
    gc.setDefLeague(league);
 }