import { createHandler } from './service';
import { User } from './user';
import { GameCenter } from './game-center';
import { Player } from './player';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as assign from 'object.assign';
import {gamePlayerLog} from "./logs/logObj";

export const register = (gc: GameCenter, username: string, password: string, email: string) => {
    gc.register(username, password, email);
};


export const createGame = ( gc: GameCenter, 
                            user: User,
                            gameType: number,
                            buyin: number,
                            initialChips: number,
                            minBet: number,
                            minPlayers: number,
                            maxPlayers: number,
                            spectatingAllowed: boolean) => {
  gc.createGame(user, gameType, buyin, initialChips, minBet, minPlayers, maxPlayers, spectatingAllowed);
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
    gc.getPlayableGames(user);
};

export const endGame = (gc: GameCenter, user: User, gID: number) => {
    let finishedgame = gc.getGame(gID);
    finishedgame.allPlayers.forEach(player => {
        let user = gc.getUser(player.playingUser);
        gc.quitGame(user, gID);
    });
    finishedgame.endGame();
}

export const weeklyUpdate = (gc: GameCenter, user:User) => {
    gc.weeklyUpdate();
}

export const reset = (gc: GameCenter) => {
    gc.reset();
    gc.register("test1", "123456", "test1@test.com");
    gc.register("test2", "asdasd", "test2@test.com");
    gc.register("test3", "111111", "test3@test.com");
    gc.createGame(gc.getUser("test1"), 0, 10, 20, 2, 2, 4, false);
    gc.createGame(gc.getUser("test2"), 1, 10, 20, 2, 2, 4, true);
    gc.joinGame(gc.getUser("test3"), 1);
    gc.getGame(1).addPlayer(gc.getUser("test3"));
    gc.spectateGame(gc.getUser("test3"), 2);
}