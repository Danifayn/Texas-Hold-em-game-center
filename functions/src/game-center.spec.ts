/// <reference path="../typings/globals/jasmine/index.d.ts" />
import { setUserLeague, register } from './index';
import { User } from './user';
import { GameCenter } from './game-center';
import { Game, GameType } from "./games/gameObj";
import {gamePlayerLog} from "./logs/logObj";
import {UserMock} from "./stubs/userMock";

describe("Game Center", function() {
  var gc: GameCenter;
  var user1: User;
  var user2: User;
  var mUser: UserMock;
  var gameId: number;

  beforeEach(()=>{
    gc = GameCenter.from({});
    gc.register('user1','user1','user1@email.com');
    user1 = gc.getUser('user1');
    gc.register('user2','user2','user2@email.com');
    user2 = gc.getUser('user2');
    gameId = gc.createGame(user1, "game1", GameType.NoLimit, 20, 100, 10, 2, 23, false);
    mUser = new UserMock();
  })

  it('should set default league correctly', ()=>{
    mUser.setPoints(Math.max(user1.points, user2.points)+1);
    mUser.setLeague(Math.max(user1.league, user2.league)+1);

    gc.register('newcomer','newcomer','newcomer@email.com');
    expect(gc.getUser('newcomer').league).toBe(-1);
  });

  it('should be able to set a user`s league', ()=>{
    mUser.setPoints(Math.max(user1.points, user2.points)+1);
    mUser.setLeague(Math.max(user1.league, user2.league)+1);

    gc.register('newcomer','newcomer','newcomer@email.com');
    expect(gc.getUser('newcomer').league).toBe(-1);
    mUser.setLeague(Math.max(mUser.league, gc.getUser('newcomer').league)+1);
    gc.setUserLeague(mUser,'newcomer',2);
    expect(gc.getUser('newcomer').league).toBe(2);
  });

  it('should should update a user`s league according to the user`s points', ()=>{
    user1.setLeague(2);
    mUser.setPoints(Math.max(user1.points, user2.points)+1);
    mUser.setLeague(Math.max(user1.league, user2.league)+1);
    gc.setLeagueCriteria(mUser,2,312);
    let gameId = gc.createGame(user1, "game2", GameType.NoLimit,50,50,50,2,21,true); // create and join the game

    user1.points += 313
    user1.gamesPlayed = 9;

    gc.quitGame(user1,gameId); // leave
    expect(user1.league).toBe(3);
  });

  it("should not allow registeration twice", () => {
    expect(()=>{
      gc.register('moshe','moshe','mail@someMail.com');
      gc.register('moshe','moshe','mail@someMail.com');
    }).toThrowError();
  });

  it("should not allow operation on non-existent game", () => {
    expect(()=>{
      gc.leaveGame(user1,gameId + 1);
      gc.joinGame(user1,gameId + 1);
      gc.spectateGame(user1,gameId + 1);

      gc.leaveGame(user2,gameId + 1);
      gc.joinGame(user2,gameId + 1);
      gc.spectateGame(user2,gameId + 1);
    }).toThrowError();
  });

  it('should allow to leave a game', ()=>{
    gc.leaveGame(user1,gameId);
  });

  it('should allow to join a game', ()=>{
    gc.joinGame(user2,gameId);
  });

  it('should allow to spectate a game', ()=>{
    gc.spectateGame(user2,gameId);
  });

  it('should not allow to join twice', ()=>{
    expect(()=>{
      gc.joinGame(user2, gameId);
      gc.joinGame(user2, gameId);
    }).toThrowError();
  });
});
