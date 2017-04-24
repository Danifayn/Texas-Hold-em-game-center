
import { setUserLeague, register } from './index';
import { User, Admin } from './user';
import { GameCenter } from './game-center';
import { Game, GameType } from "./game";
/// <reference path="../typings/globals/jasmine/index.d.ts" />

class UserStub implements User {
  username: string;
  password: string;
  email: string;
  league: number;
  points: number;
  activeGamesIds: number[];
  spectatingGamesIds: number[];
  public joinGame(game: Game): void {
    throw new Error('Method not implemented.');
  }
  public spectateGame(game: Game): void {
    throw new Error('Method not implemented.');
  }
  public leaveGame(game: Game): void {
    throw new Error('Method not implemented.');
  }
  public setEmail(email: string): void {
    throw new Error('Method not implemented.');
  }
  public setPassword(password: string): void {
    throw new Error('Method not implemented.');
  }
  public setLeague(leauge: number): void {
    throw new Error('Method not implemented.');
  }
}

describe("Game Center", function() {
  var gc: GameCenter;
  var admin: Admin;
  var user1: User;
  var user2: User;
  var gameId: number;

  beforeEach(()=>{
    gc = GameCenter.from({});
    admin = new Admin();
    gc.register('user1','user1','user1@email.com');
    user1 = gc.getUser('user1');
    gc.register('user2','user2','user2@email.com');
    user1 = gc.getUser('user2');
    gameId = gc.createGame(user1, GameType.NoLimit, 20, 100, 10, 2, 23, false);
  })

  it('should not allow managing leagues for non-admin user', ()=>{
    expect(()=>{
      gc.setDefaultLeague(new UserStub(),3);
    }).toThrowError();

    expect(()=>{
      gc.setUserLeague(new UserStub(),'someusername',3);
    }).toThrowError();

    expect(()=>{
      gc.setLeagueCriteria(new UserStub(),4,300);
    }).toThrowError();
  });

  it('should update default league correctly', ()=>{
    gc.setDefaultLeague(admin,5);
    gc.register('newcomer','newcomer','newcomer@email.com');
    expect(gc.getUser('newcomer').league).toBe(5);
  });

  it('should be able to set a user`s league', ()=>{
    gc.setDefaultLeague(admin,5);
    gc.register('newcomer','newcomer','newcomer@email.com');
    expect(gc.getUser('newcomer').league).toBe(5);
    gc.setUserLeague(admin,'newcomer',2);
    expect(gc.getUser('newcomer').league).toBe(2);
  });

  it('should should update a user`s league according to the user`s points', ()=>{
    user1.setLeague(2);
    gc.setLeagueCriteria(admin,2,312);
    let gameId = gc.createGame(user1, GameType.NoLimit,50,50,50,2,21,true); // create and join the game

    user1.points += 313

    gc.leaveGame(user1,gameId); // leave
    expect(user1.league).toBe(3);
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
