import { GameCenter } from './game-center';
import * as assign from 'object.assign';

export class env {
    real: GameCenter;
    test: GameCenter;
    
    constructor() {
        this.real = new GameCenter();
        this.test = new GameCenter();
    }

    static from(json: any): env {
        let newEnv = null;
        newEnv = assign(new env(), json);
        newEnv.real = GameCenter.from(newEnv.real);
        newEnv.test = GameCenter.from(newEnv.test);
        return newEnv;
    }
}