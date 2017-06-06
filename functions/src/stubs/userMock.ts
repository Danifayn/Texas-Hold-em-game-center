import { User } from '../user';
import { Game } from "../games/gameObj";
import { gamePlayerLog } from "../logs/logObj";

export class UserMock implements User {
    publics: userPublic;
    privates: userPrivate;

  public constructor() {
        this.publics = new userPublic();
        this.privates = new userPrivate();
     }

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
  public addFave(turn: gamePlayerLog) {
    throw new Error('Method not implemented.');
  }
  public endGame(game: Game) {
    throw new Error('Method not implemented.');
  }

  public setPoints(point: number) {
    this.points = point;
  }
  public setLeague(leauge: number): void {
    this.league = leauge;
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
}

class userPrivate {
    password: string;
    money = 200;
}