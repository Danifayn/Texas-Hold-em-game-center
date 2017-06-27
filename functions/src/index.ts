import { createHandler } from './service';
import { GameCenter } from './game-center';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as assign from 'object.assign';
import * as SL from "./serviceLayer"
admin.initializeApp(functions.config().firebase);

export const register = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  SL.register(newGC, extractor.string('username'), extractor.string('password'), extractor.string('email'), uid);
});

export const createGame = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.createGame(newGC,
    user,
    extractor.string('gameName'),
    extractor.number('gameType'),
    extractor.number('buyin'),
    extractor.number('initialChips'),
    extractor.number('minBet'),
    extractor.number('minPlayers'),
    extractor.number('maxPlayers'),
    extractor.boolean('spectatingAllowed'));
});

export const joinGame = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.joinGame(newGC, user, extractor.number('gameId'));
});

export const spectateGame = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.spectateGame(newGC, user, extractor.number('gameId'));
});

export const leaveGame = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.leaveGame(newGC, user, extractor.number('gameId'));
});

export const playerAction = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.playerAction(newGC,
    user,
    extractor.number('playerId'),
    extractor.number('gameId'),
    extractor.number('newStatus'),
    extractor.number('newBet'));
});

export const startRound = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.startRound(newGC, extractor.number('gameId'));
});

export const changePassword = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.changePassword(newGC, user, extractor.string('newPassword'));
});

export const changeEmail = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.changeEmail(newGC, user, extractor.string('newEmail'));
});

export const setUserLeague = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.setUserLeague(newGC, user, extractor.number('league'), extractor.string('user'));
});

export const setLeagueCriteria = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.setLeagueCriteria(newGC, user, extractor.number('league'), extractor.number('criteria'));
});

export const getPlayableGames = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc);
  let user = SL.getuser(gc, uid, username, password);
  SL.getPlayableGames(newGC, user);
});

export const endAGame = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.endGame(newGC, user, extractor.number('gID'));
});

export const weeklyUpdate = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.weeklyUpdate(newGC, user);
});

export const reset = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.reset(newGC);
});

export const isUserExisting = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.isUserExisting(newGC, extractor.string('username'));
});

export const deleteUSer = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.deleteUSer(newGC, extractor.string('username'));
});

export const isGameExisting = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.isGameExisting(newGC, extractor.number('gID'));
});

export const deleteGame = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.deleteGame(newGC, extractor.number('gID'));
});

export const isUSerPlaying = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.isUSerPlaying(newGC, extractor.string('username'), extractor.number('gID'));
});

export const isUserSpectating = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.isUserSpectating(newGC, extractor.string('username'), extractor.number('gID'));
});

export const isGameReady = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.isGameReady(newGC, extractor.number('gID'));
});

export const getUserCash = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.getUserCash(newGC, extractor.string('username'));
});

export const getPlayerCards = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.getPlayerCards(newGC, extractor.string('username'), extractor.number('gID'));
});

export const getPlayerBet = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.getPlayerBet(newGC, extractor.string('username'), extractor.number('gID'));
});

export const getCurrPlayer = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.getCurrPlayer(newGC, extractor.number('gID'));
});

export const getPot = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.getPot(newGC, extractor.number('gID'));
});

export const setPot = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.setPot(newGC, extractor.number('pot'), extractor.number('gID'));
});

export const setBigBlind = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.setBigBlind(newGC, extractor.number('gID'), extractor.number('newBlind'));
});

export const setPlayerChips = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.setPlayerChips(newGC, extractor.string('username'), extractor.number('gID'), extractor.number('chips'));
});

export const getLeagueCriteria = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.getLeagueCriteria(newGC, extractor.number('league'));
});

export const getUserLeague = createHandler((gc, extractor, uid, username, password) => { 
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.getUserLeague(newGC, extractor.string('username'));
});

export const setDefLeague = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.setDefLeague(newGC, extractor.number('league'));
});

export const sendChat = createHandler((gc, extractor, uid, username, password) => {
  let newGC = SL.jsonToGC(gc); 
  let user = SL.getuser(gc, uid, username, password);
  SL.sendChat(newGC, user, extractor.number('gID'), extractor.string('msg'));
});
