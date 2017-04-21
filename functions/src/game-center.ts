import { User } from './user';
import * as assign from 'object.assign';

export class Game {

}
export class GameCenter {
    private num: number = 234;
    private users: {[username:string]: User} = {};

    add(user: User, param: number) {
        if(!user)
           throw new Error('must be logged in to use this method !');
        this.num += +param;
        return this.num;
    }

    register(user: User) {
        if(/^[a-zA-Z0-9- ]*$/.test(user.username) == false)
            throw new Error('username cannot contain special characters !');
        if(this.users[user.username])
            throw new Error('username already taken !');
        else 
            this.users[user.username] = user;
    }

    getUser(username: string): User{
        return this.users[username];
    }


    // factory method to create a GameCenter instance from the json data from the db
    public static from(json: any): GameCenter{
        let gc: GameCenter = assign(new GameCenter(), json);
        gc.users = Object.keys(gc.users).reduce((acc,k) => ({...acc, [k]: assign(new User(), gc.users[k])}),{})
        return gc;
    }
}