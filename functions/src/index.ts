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

const createHandler = (f: (gc: GameCenter, params: Extractor) => any) => {
  return functions.https.onRequest((req, res) => {
    var result;
    var error: Error;
    const onComplete = (e,commited,snapshot) => {
      if(commited){
        res.send({result});
      } else {
        res.send(error.message);
      }
    }
    return admin.database().ref('/').transaction(db => {
      try{
        const gc = GameCenter.from(db);
        const params = assign({},req.query, req.params, req.body);
        result = f(gc, createExtractor(params));
        return gc;
      }
      catch(e){
        error = e;
        return;
      }
    },onComplete);
  })
}

export const add = createHandler((gc,extractor) => gc.add(extractor.number('param')));