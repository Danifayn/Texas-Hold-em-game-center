import { User } from './user';
import { GameCenter } from './game-center';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as assign from 'object.assign';
admin.initializeApp(functions.config().firebase);

export type Extractor = {
  string: (name: string) => string;
  number: (name: string) => number;
  boolean: (name: string) => boolean;
}

export type RequestHandler = (gc: GameCenter, params: Extractor, currentUser?: User) => any;

const createExtractor = (o: any): Extractor => ({
  string: name => {
    if(name in o)
      return '' + o[name];
    else
      throw new Error(`param '${name}' not provided`);
  },
  number: name => {
    if(name in o && !isNaN(o[name]))
      return +o[name];
    else
      throw new Error(`param '${name}' not provided or not a number`);
  },
  boolean: name => o[name] ? true : false
});

const createHandler = (f: RequestHandler) => {
  return functions.https.onRequest((req, res) => {
    var result;
    var error: Error;
    const onComplete = (e,commited,snapshot) => {
      console.log('onComplete',e, commited, snapshot)
      if(commited || error){
        if(result)
          res.send({result});
        else if(error)
          res.send(error.message);
      }
    }
    return admin.database().ref('/').transaction(db => {
      if(!db) return 0;
      try{
        const gc = GameCenter.from(db);
        const params = assign({},req.query, req.params, req.body,req.headers);
        const extractor = createExtractor(params);

        let user = null;
        if(params.username && params.password){
          user = gc.getUser(params.username);
          if(!user || user.password !== params.password)
            user = null;
        }
        console.log('user', user);
        result = f(gc, extractor , user) || true;
        return gc;
      }
      catch(e){
        error = e;
        return;
      }
    }, onComplete, true);
  })
}

export const add = createHandler((gc,extractor,user) => gc.add(user,extractor.number('param')));
export const register = createHandler((gc,extractor) => gc.register(
  {
    username: extractor.string('username'),
    password: extractor.string('password')
  }
));