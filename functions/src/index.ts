import { User } from './user';
import { GameCenter } from './game-center';
import { Player } from './player';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as assign from 'object.assign';
import {gamePlayerLog} from "./log";
admin.initializeApp(functions.config().firebase);

export type Extractor = {
  string: (name: string) => string;
  number: (name: string) => number;
  boolean: (name: string) => boolean;
}

export type RequestHandler = (gc: GameCenter, params: Extractor, currentUser?: User) => any;

const createExtractor = (o: any): Extractor => ({
  string: name => {
    if(name in o)
      return '' + o[name];
    else
      throw new Error(`param '${name}' not provided`);
  },
  number: name => {
    if(name in o && !isNaN(o[name]))
      return +o[name];
    else
      throw new Error(`param '${name}' not provided or not a number`);
  },
  boolean: name => o[name] ? true : false
});

const createHandler = (f: RequestHandler) => {
  return functions.https.onRequest((req, res) => {
    var result;
    var error: Error;
    const onComplete = (e,commited,snapshot) => {
      console.log('onComplete',e, commited, snapshot)
      if(commited || error){
        if(result)
          res.send(200,{result});
        else if(error)
          res.send(400,error.message);
      }
    }
    
    return admin.database().ref('/').transaction(db => {
      if(!db) return 0;
      try{
        const gc = GameCenter.from(db);
        const params = assign({},req.query, req.params, req.body,req.headers);
        const extractor = createExtractor(params);

        let user = null;
        if(params.username && params.password){
          user = gc.getUser(params.username);
          if(!user || user.password !== params.password)
            user = null;
        }
        console.log('user', user);
        result = f(gc, extractor , user);
        if(result === undefined)
          result = true;
        return gc;
      }
      catch(e){
        error = e;
        return;
      }
    }, onComplete, true);
  })
}

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

export const adFavTurn = createHandler((gc, extractor, user) => {
  let Turns = gc.getGame(extractor.number('gameId')).userLogs;
  let favTurn = null;
  for(let i = 0; i < Turns.length; i++) {
    if(Turns[i].logId == extractor.number('logId'))
      favTurn = Turns[i]
  }
  if(favTurn == null)
    throw new Error("The turn does not exist!!!");
  user.favTurns.push(favTurn);
});
