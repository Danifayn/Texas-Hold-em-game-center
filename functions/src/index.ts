import { GameCenter } from './game-center';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
var assign = require('object.assign');
admin.initializeApp(functions.config().firebase);

type Extractor = {
  string: (name: string) => string;
  number: (name: string) => number;
  boolean: (name: string) => boolean;
}

const createExtractor = (o: any): Extractor => ({
  string: name => {
    if(name in o)
      return o[name];
    else
      throw new Error(`param ${name} not provided`);
  },
  number: name => {
    if(name in o && !isNaN(Number(o.name)))
      return +o[name];
    else
      throw new Error(`param ${name} not provided or not a number`);
  },
  boolean: name => o[name] ? true : false
});

const createHandler = (f: (gc: GameCenter, params: Extractor) => any) => {
  return functions.https.onRequest((req, res) => {
    return admin.database().ref().transaction(db => {
      try{
        let gc: GameCenter = assign(new GameCenter(), db);
        let params = assign({},req.query, req.params, req.body);
        f(gc, createExtractor(params));
        res.status(200).end();
        return gc;
      }
      catch(e){
        res.status(400).send(e.message).end();
        return;
      }
    });
  })
}

export const add = createHandler((gc,extractor) => gc.add(extractor.number('param')));