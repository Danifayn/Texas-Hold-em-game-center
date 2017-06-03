/// <reference path="../typings/globals/jasmine/index.d.ts" />
import {Game, limitGame, noLimitGame, potLimitGame, GameType} from "./games/gameObj";
import {UserMock} from "./stubs/userMock"
import {PlayerStub} from "./stubs/playerStub"
import {Status} from "./player";

describe("Game", function() {
  var glimit: Game;
  var gnolimit: Game;
  var gpotlimit: Game;
  var user1: UserMock;
  var user2: UserMock;
  var user3: UserMock;

  beforeEach(() => {
    glimit = new limitGame(0, 1, 5, 20, 4, 2, 5, true);
    gnolimit = new noLimitGame(1, 1, 5, 20, 4, 2, 5, true);
    gpotlimit = new potLimitGame(2, 1, 5, 20, 4, 2, 5, true);
    user1= new UserMock();
    user1.username = "u1";
    user2= new UserMock();
    user2.username = "u2";
    user3= new UserMock();
    user3.username = "u3";
  });

  it('should allow to add a new player', ()=>{
    glimit.addPlayer(user1);

    expect(
      glimit.getPlayerByUsername("u1").playingGameId
    ).toBe(glimit.gameId);

    expect(
      glimit.getPlayerByUsername("u1").isActive
    ).toBe(true);
    
    glimit.removePlayer(user1);

    expect(
      glimit.getPlayerByUsername("u1").isActive
    ).toBe(false);
    
    glimit.addPlayer(user2);

    expect(
      glimit.getPlayerByUsername("u1").isActive
    ).toBe(false);
  });

  
  it('should allow to start a round', ()=>{
    glimit.addPlayer(user1);
    glimit.addPlayer(user2);
    glimit.addPlayer(user3);

    glimit.startARound();

    expect(
      glimit.deck.length
    ).toBe(46);

    let p1 = glimit.getPlayerByUsername("u1");
    let p2 = glimit.getPlayerByUsername("u2");
    let p3 = glimit.getPlayerByUsername("u3");

    expect(
      p1.money > p2.money
    ).toBe(true);
    expect(
      p3.money > p2.money
    ).toBe(true);
    expect(
      p3.money > p1.money
    ).toBe(true);

    expect(
      glimit.currentPlayer
    ).toBe(2);

    expect(
      p1.hand.length
    ).toBe(2);
    expect(
      p2.hand.length
    ).toBe(2);
    expect(
      p3.hand.length
    ).toBe(2);
  });

  it('should be able to play', ()=>{
    glimit.addPlayer(user1);
    glimit.addPlayer(user2);
    glimit.addPlayer(user3);

    glimit.startARound();

    let p1 = glimit.getPlayerByUsername("u1");
    let p2 = glimit.getPlayerByUsername("u2");
    let p3 = glimit.getPlayerByUsername("u3");

    glimit.doAction(Status.Raise, glimit.minBet, p3);
    glimit.doAction(Status.Raise, glimit.minBet-(Math.floor(glimit.minBet/2)), p1);
    glimit.doAction(Status.Check, 0, p2);

    expect(
      glimit.tableCards.length
    ).toBe(3);
  });

  it('should be able to finish', ()=>{
    glimit.addPlayer(user1);
    glimit.addPlayer(user2);
    glimit.addPlayer(user3);

    glimit.startARound();

    let p1 = glimit.getPlayerByUsername("u1");
    let p2 = glimit.getPlayerByUsername("u2");
    let p3 = glimit.getPlayerByUsername("u3");

    glimit.doAction(Status.Raise, glimit.minBet, p3);
    glimit.doAction(Status.Raise, glimit.minBet-(Math.floor(glimit.minBet/2)), p1);
    glimit.doAction(Status.Check, 0, p2);
    expect(
      glimit.tableCards.length
    ).toBe(3);

    glimit.doAction(Status.Check, 0, p3);
    glimit.doAction(Status.Check, 0, p1);
    glimit.doAction(Status.Check, 0, p2);
    expect(
      glimit.tableCards.length
    ).toBe(4);

    glimit.doAction(Status.Check, 0, p3);
    glimit.doAction(Status.Check, 0, p1);
    glimit.doAction(Status.Check, 0, p2);
    expect(
      glimit.tableCards.length
    ).toBe(5);

    glimit.doAction(Status.Check, 0, p3);
    glimit.doAction(Status.Check, 0, p1);
    glimit.doAction(Status.Check, 0, p2);
    expect(
      Math.max(p1.points,p2.points,p3.points)-Math.min(p1.points,p2.points,p3.points)
    ).toBe(5);
    expect(
      Math.max(p1.money,p2.money,p3.money)-Math.min(p1.money,p2.money,p3.money)
    ).toBe(3*glimit.minBet);
  });
});