import * as assign from 'object.assign';

export class Game {

}
export class GameCenter {
    private num: number = 234;
    private games: Game[] = [];

    add(param: number) {
        this.num += +param;
        return this.num;
    }

    // factory method to create a GameCenter instance from the json data from the db
    public static from(json: any): GameCenter{
        let gc = assign(new GameCenter(), json);
        gc.games = gc.games.map(game => assign(new Game(), game));
        return gc;
    }
}