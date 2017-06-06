import { User } from './user';
import { GameCenter } from './game-center';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as assign from 'object.assign';

export type Extractor = {
  string: (name: string) => string;
  number: (name: string) => number;
  boolean: (name: string) => boolean;
}

export type RequestHandler = (gc: GameCenter, params: Extractor, currentUser?: User) => any;

export const createExtractor = (o: any): Extractor => ({
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

export const createHandler = (f: RequestHandler) => {
  return functions.https.onRequest((req, res) => {
    var result;
    var error: Error;
    const onComplete = (e,commited,snapshot) => {
      console.log('onComplete',e, commited, snapshot)
      if(commited || error){
        if(result)
          res.send(200,{result});
        else if(error)
          res.send(400,error.message);
      }
    }
    
    return admin.database().ref('/').transaction(db => {
      if(!db) return 0;
      var gc: GameCenter = new GameCenter();
      var params: any;
      var extractor: Extractor;
      try{
        gc = GameCenter.from(db);
        params = assign({},req.query, req.params, req.body,req.headers);
        extractor = createExtractor(params);

        let user = null;
        if(params.token){
          admin.auth().verifyIdToken(params.token)
          .then(function(decodedToken) {
            var uid = decodedToken.uid;
            user = gc.getUserById(uid);
          }).catch(function(error) {
            user = gc.getUser(params.username);
            if(!user || user.password !== params.password)
              user = null;
          });
        }
        if(params.username && params.password){
          user = gc.getUser(params.username);
          if(!user || user.password !== params.password)
            user = null;
        }
        console.log('user', user);
        result = f(gc, extractor , user);
        if(result === undefined)
          result = true;
        return gc;
      }
      catch(e){
        error = e;
        if(gc)
          gc.logError(req.url,params,e);
        return;
      }
    }, onComplete, true);
  })
}