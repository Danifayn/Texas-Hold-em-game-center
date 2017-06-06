import * as Games from './games/gameObj';
import * as assign from 'object.assign';

export class User {
    publics: userPublic;
    privates: userPrivate;

    constructor(id?: string, username?: string, password?: string, email?: string, league?: number, points?: number) {
        this.publics = new userPublic();
        this.privates = new userPrivate();
        this.uId = id;
        this.username = username;
        this.password = password;
        this.email = email;
        if (league) this.league = league;
        if (points) this.points = points;
        else this.points = 0;
    }

    public joinGame(game: Games.Game) {
        this.activeGamesIds.push(game.gameId);
    }

    public spectateGame(game: Games.Game) {
        this.spectatingGamesIds.push(game.gameId);
    }

    public leaveGame(game: Games.Game) {
        this.activeGamesIds = this.activeGamesIds.filter(x => x != game.gameId);
        this.spectatingGamesIds = this.spectatingGamesIds.filter(x => x != game.gameId);
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public setPassword(password: string) {
        this.password = password;
    }
    public setLeague(leauge: number) {
        this.league = leauge;
    }

    public endGame(game: Games.Game) {
        this.gamesPlayed++;
        this.money += (game.buyin * game.getPlayerByUserId(this.uId).money) / game.initialChips;
    }

    static from(json: any): User {
        let user = null;
        user = assign(new User(), json);
        user.publics = userPublic.from(user.publics);
        user.privates = userPrivate.from(user.privates);
        return user;
    }
    

    get uId():string {
        return this.publics.uId;
    }
    set uId(setter:string) {
        this.publics.uId = setter;
    }

    get username():string {
        return this.publics.username;
    }
    set username(setter:string) {
        this.publics.username = setter;
    }

    get email():string {
        return this.publics.email;
    }
    set email(setter:string) {
        this.publics.email = setter;
    }

    get league():number {
        return this.publics.league;
    }
    set league(setter:number) {
        this.publics.league = setter;
    }

    get points():number {
        return this.publics.points;
    }
    set points(setter:number) {
        this.publics.points = setter;
    }

    get activeGamesIds():number[] {
        return this.publics.activeGamesIds;
    }
    set activeGamesIds(setter:number[]) {
        this.publics.activeGamesIds = setter;
    }

    get spectatingGamesIds():number[] {
        return this.publics.spectatingGamesIds;
    }
    set spectatingGamesIds(setter:number[]) {
        this.publics.spectatingGamesIds = setter;
    }

    get gamesPlayed():number {
        return this.publics.gamesPlayed;
    }
    set gamesPlayed(setter:number) {
        this.publics.gamesPlayed = setter;
    }

    get password():string {
        return this.privates.password;
    }
    set password(setter:string) {
        this.privates.password = setter;
    }

    get money():number {
        return this.privates.money;
    }
    set money(setter:number) {
        this.privates.money = setter;
    }
}

class userPublic {
    uId: string = "-1";
    username: string;
    email: string;
    league: number = 0;
    points: number = 0;
    activeGamesIds: number[] = [];
    spectatingGamesIds: number[] = [];
    gamesPlayed: number = 0;

    static from(json: any): userPublic {
        let user: userPublic = assign(new userPublic(), json);
        return user;
    }
}

class userPrivate {
    password: string;
    money = 200;

    static from(json: any): userPrivate {
        let user: userPrivate = assign(new userPrivate(), json);
        return user;
    }
}

