import { User } from './user';
import { register, leaveGame, joinGame, spectateGame, createGame } from './index';
import { GameCenter } from './game-center';
import { GameType } from "./game";
/// <reference path="../typings/globals/jasmine/index.d.ts" />

describe("Game Center", () => {
  var gc;
  var user1;
  var user2;
  var gameId;
  beforeEach(()=>{
    gc = GameCenter.from({});
    gc.register('user1','user1');
    gc.register('user2','user2');
    user1 = gc.getUser('user1');
    user2 = gc.getUser('user2');
    gameId = gc.createGame(user1, GameType.NoLimit, 20, 100, 10, 2, 23, false);
  });

  it("should not allow registeration twice", () => {
    expect(()=>{
      gc.register('moshe','moshe');
      gc.register('moshe','moshe');
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
});
