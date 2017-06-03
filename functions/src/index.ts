import { createHandler } from './service';
import { User } from './user';
import { GameCenter } from './game-center';
import { Player } from './player';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as assign from 'object.assign';
import { gamePlayerLog } from "./logs/logObj";
import * as SL from "./serviceLayer"
admin.initializeApp(functions.config().firebase);

export const register = createHandler((gc, extractor) => SL.register(gc, extractor.string('username'), extractor.string('password'), extractor.string('email')));

export const createGame = createHandler((gc, extractor, user) =>
  SL.createGame(gc,
    user,
    extractor.number('gameType'),
    extractor.number('buyin'),
    extractor.number('initialChips'),
    extractor.number('minBet'),
    extractor.number('minPlayers'),
    extractor.number('maxPlayers'),
    extractor.boolean('spectatingAllowed')));

export const joinGame = createHandler((gc, extractor, user) => SL.joinGame(gc, user, extractor.number('gameId')));

export const spectateGame = createHandler((gc, extractor, user) => SL.spectateGame(gc, user, extractor.number('gameId')));

export const leaveGame = createHandler((gc, extractor, user) => SL.leaveGame(gc, user, extractor.number('gameId')));

export const playerAction = createHandler((gc, extractor, user) =>
  SL.playerAction(gc,
    user,
    extractor.number('playerId'),
    extractor.number('gameId'),
    extractor.number('newStatus'),
    extractor.number('newBet')));

export const startRound = createHandler((gc, extractor, user) => SL.startRound(gc, extractor.number('gameId')));

export const changePassword = createHandler((gc, extractor, user) => SL.changePassword(gc, user, extractor.string('newPassword')));

export const changeEmail = createHandler((gc, extractor, user) => SL.changeEmail(gc, user, extractor.string('newEmail')));

export const setUserLeague = createHandler((gc, extractor, user) => SL.setUserLeague(gc, user, extractor.number('league'), extractor.string('user')));

export const setLeagueCriteria = createHandler((gc, extractor, user) => SL.setLeagueCriteria(gc, user, extractor.number('league'), extractor.number('criteria')));

export const getPlayableGames = createHandler((gc, extractor, user) => SL.getPlayableGames(gc, user));

export const endAGame = createHandler((gc, extractor, user) => SL.endGame(gc, user, extractor.number('gID')));

export const weeklyUpdate = createHandler((gc, extractor, user) => SL.weeklyUpdate(gc, user));
