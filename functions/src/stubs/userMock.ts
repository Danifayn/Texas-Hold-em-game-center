import { User } from '../user';
import { Game } from "../game";
import {gamePlayerLog} from "../log";

export class UserMock implements User {
  username: string;
  password: string;
  email: string;
  league: number;
  points: number;
  activeGamesIds: number[];
  spectatingGamesIds: number[];
  favTurns: gamePlayerLog[] = [];
  gamesPlayed: number = 0;

  public constructor() {}

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

  public setPoints(point: number) {
    this.points = point;
  }
  public setLeague(leauge: number): void {
    this.league = leauge;
  }
}