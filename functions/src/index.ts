import { createHandler } from './service';
import { User } from './user';
import { GameCenter } from './game-center';
import { Player } from './player';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as assign from 'object.assign';
admin.initializeApp(functions.config().firebase);

export const register = createHandler((gc,extractor) => gc.register(extractor.string('username'),extractor.string('password'),extractor.string('email')));
export const createGame = createHandler((gc,extractor,user) => 
  gc.createGame(user,
    extractor.number('gameType'),
    extractor.number('buyin'),
    extractor.number('initialChips'),
    extractor.number('minBet'),
    extractor.number('minPlayers'),
    extractor.number('maxPlayers'),
    extractor.boolean('spectatingAllowed')
  )
);
export const joinGame = createHandler((gc,extractor,user) => {
  gc.joinGame(user, extractor.number('gameId'));
  gc.getGame(extractor.number('gameId')).addPlayer(user);
});
export const spectateGame = createHandler((gc,extractor,user) => gc.spectateGame(user, extractor.number('gameId')));
export const leaveGame = createHandler((gc,extractor,user) => gc.leaveGame(user,extractor.number('gameId')));

//check/fold/raise
export const playerAction = createHandler((gc,extractor,user) => {
  let playerID = extractor.number('playerId');
  let game = gc.getGame(extractor.number('gameId'));
  let player = game.getPlayerByID(extractor.number('playerId'));
  player.status = extractor.number('newStatus');
  game.doAction(player.status, extractor.number('newBet'), player);
});

//start round
export const startRound = createHandler((gc,extractor,user) => gc.getGame(extractor.number('gameId')).startARound());

export const changePassword = createHandler((gc,extractor,user) => user.setPassword(extractor.string('newPassword')));

export const changeEmail = createHandler((gc,extractor,user) =>  user.setEmail(extractor.string('newEmail')));

export const setDefaultLeague = createHandler((gc,extractor,user) => gc.setDefaultLeague(user,extractor.number('defaultLeague')));
export const setUserLeague = createHandler((gc,extractor,user) => gc.setUserLeague(user,extractor.string('user'),extractor.number('league')));
export const setLeagueCriteria = createHandler((gc,extractor,user) => gc.setLeagueCriteria(user,extractor.number('league'),extractor.number('criteria')));
