import { User } from './user';
import { GameCenter } from './game-center';
import { env } from './env'
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as assign from 'object.assign';

export type Extractor = {
  string: (name: string) => string;
  number: (name: string) => number;
  boolean: (name: string) => boolean;
}

export type RequestHandler = (gc: GameCenter, params: Extractor, currentUser?: User, uid?: string) => any;

export const createExtractor = (o: any): Extractor => ({
  string: name => {
    if (name in o)
      return '' + o[name];
    else
      throw new Error(`param '${name}' not provided`);
  },
  number: name => {
    if (name in o && !isNaN(o[name]))
      return +o[name];
    else
      throw new Error(`param '${name}' not provided or not a number`);
  },
  boolean: name => o[name] ? true : false
});

export const createHandler = (f: RequestHandler) => {
  return functions.https.onRequest((req,res)=>{
    let result: env;
    let error: Error;

    const params: any = assign({}, req.query, req.params, req.body, req.headers);
    const extractor: Extractor = createExtractor(params);

    const onComplete = (e, commited, snapshot) => {
      if (commited || error) {
        if (result){
          console.log(`----- successfully finished transaction`);
          res.send(200, { result });
        }
        else if (error){
          console.log(`----- encountred an error: ` + error.message);
          res.send(400, error.message);
        }
      }
    }

    if(params.token)
      return admin.auth().verifyIdToken(params.token)
        .then(decodedToken => {
          return admin.database().ref('/').transaction(db =>{
            if(!db) return 0;
            console.log('----- transaction started db = ' , db);
            console.log(`----- uid = ${decodedToken.uid}`);

            const uid = decodedToken.uid;
            let ev = new env();
            if(db)
              ev = env.from(db);

            console.log('----- ev = ', ev);

            try{
              result = f(ev.real,extractor,ev.real.getUserById(uid),uid);
              return ev; // write transaction
            }
            catch(e){
              error = e;
              return undefined; // cancel transaction
            }
          }, onComplete, true);
        })
        .catch(e => {error = e; onComplete(e,false,undefined);})
    else if(params.username && params.password){
      return admin.database().ref('/').transaction(db =>{
            if(!db) return 0;
            console.log('----- transaction started db = ' , db);
            let ev = new env();
            if(db)
              ev = env.from(db);
            console.log('----- ev = ', ev);
            try{
              const user = ev.real.getUser(params.username);
              if(!user || user.password != params.password)
                throw new Error('user not found or passwordsd don`t match');
              result = f(ev.real,extractor,ev.real.getUser(params.username),user.uId);
              return ev; // write transaction
            }
            catch(e){
              error = e;
              return undefined; // cancel transaction
            }
          }, onComplete, true);
    }
    else {
      error = new Error('must provide either `token` or `username`&&`password`'); 
      onComplete(error,false,undefined);
    }
  });

  
}

/*
export const createHandler = (f: RequestHandler) => {
  return functions.https.onRequest((req, res) => {
    var result;
    var error: Error;
    const onComplete = (e, commited, snapshot) => {
      console.log('onComplete', e, commited, snapshot)
      if (commited || error) {
        if (result)
          res.send(200, { result });
        else if (error)
          res.send(400, error.message);
      }
    }

    var params: any;
    params = assign({}, req.query, req.params, req.body, req.headers);

    if (params.token) {
      return admin.auth().verifyIdToken(params.token)
        .then(function (decodedToken) {
          return admin.database().ref('/').transaction(db => {
            if (!db) return 0;
            var gc: GameCenter = new GameCenter();
            var everything: env = new env();
            var extractor: Extractor;
            try {
              everything = env.from(db);
              extractor = createExtractor(params);

              let user = gc.getUserById(decodedToken.uid);
              if (!user) {
                user = new User();
                user.uId = decodedToken.uid;
              }
              gc = everything.real;
              console.log('user', user);
              result = f(gc, extractor, user);
              if (result === undefined)
                result = true;
              return everything;
            }
            catch (e) {
              error = e;
              if (gc)
                gc.logError(req.url, params, e);
              return;
            }
          }, onComplete, true);
        }).catch(function (error) {
          return admin.database().ref('/').transaction(db => {
            result = false;
            return;
          }, onComplete, true);
          admin.database().ref('/').transaction(db => {
            if (!db) return 0;
            var gc: GameCenter = new GameCenter();
            var everything: env = new env();
            var extractor: Extractor;
            try {
              everything = env.from(db);
              extractor = createExtractor(params);

              let user = null;
              result = f(gc, extractor, user);
              if (result === undefined)
                result = true;
              return everything;
            }
            catch (e) {
              error = e;
              if (gc)
                gc.logError(req.url, params, e);
              return;
            }
          }, onComplete, true);
        });
    } else {
      return admin.database().ref('/').transaction(db => {
        if (!db) return 0;
        var gc: GameCenter = new GameCenter();
        var everything: env = new env();
        var extractor: Extractor;
        try {
          everything = env.from(db);
          extractor = createExtractor(params);

          let user = gc.getUser(params.username);
          if (!user || user.password !== params.password)
            user = null;
          gc = everything.test;
          console.log('user', user);
          result = f(gc, extractor, user);
          if (result === undefined)
            result = true;
          return everything;
        }
        catch (e) {
          error = e;
          if (gc)
            gc.logError(req.url, params, e);
          return;
        }
      }, onComplete, true);
    }
  })
}*/

