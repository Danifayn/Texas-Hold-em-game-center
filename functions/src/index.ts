import { GameCenter } from './test';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
var assign = require('object.assign');
admin.initializeApp(functions.config().firebase);

const createHandler = (f: (gc: GameCenter, params: any) => any) => {
  return functions.https.onRequest((req, res) => {
    console.log('req.params',req.params);
    console.log('req.body',req.body);
    console.log('req.query',req.query);
    return admin.database().ref().transaction(db => {
      try{
        let gc: GameCenter = assign(new GameCenter(), db);
        f(gc, assign(req.query, req.params, req.body));
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


export const add = createHandler((gc,p) => gc.add(p.param));