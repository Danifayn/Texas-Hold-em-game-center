/// <reference path="../typings/globals/jasmine/index.d.ts" />
import {User} from "./user"
import {gameLogStub} from "./stubs/gamelogStub"
import {GameMock} from "./stubs/gameMock"
import {PlayerStub} from "./stubs/playerStub"

describe("User", function() {
    var user: User;
    var g: GameMock;

    beforeEach(()=>{
        user = new User("u","p1","e1",0,0);
        g = new GameMock();
        g.setID(7);
    })


    //TODO: join, spectate, leave, 
    
    it('should allow to join game', ()=>{
        let n = user.activeGamesIds.length;
        user.joinGame(g);
        expect(
            user.activeGamesIds.length
        ).toBe(n+1);
    });
    
    it('should allow to spectate', ()=>{
        let n = user.spectatingGamesIds.length;
        user.spectateGame(g);
        expect(
            user.spectatingGamesIds.length
        ).toBe(n+1);
    });
    
    it('should allow to leave', ()=>{
        let p = new PlayerStub();
        p.points = 100;
        g.setReturnPlayer(p);
        user.joinGame(g);
        user.spectateGame(g);

        let jn = user.activeGamesIds.length;
        let sn = user.spectatingGamesIds.length;
        let pn = user.points;

        user.leaveGame(g);
        expect(
            user.points
        ).toBe(pn+100);

        expect(
            user.activeGamesIds.length
        ).toBe(jn-1);

        expect(
            user.spectatingGamesIds.length
        ).toBe(sn-1);
    });

    it('should allow to change email', ()=>{
        user.setEmail("e2");
        expect(
            user.email
        ).toBe("e2");
    });
    
    it('should allow to change passowrd', ()=>{
        user.setPassword("p2");
        expect(
            user.password
        ).toBe("p2");
    });
    
    it('should allow to change league', ()=>{
        user.setLeague(1);
        expect(
            user.league
        ).toBe(1);
    });
});
