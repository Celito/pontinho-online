import { createServer } from 'http'
import { PontinhoApp } from './src/config/pontinho-app';
import { gameStateController } from './src/controller/game-state-controller';
import * as mongoose from 'mongoose';
import { MatchServer } from './src/controller/match-server';

const pontinhoApp = new PontinhoApp({
  port: 3000,
  controllers: [gameStateController]
});

export const httpServer = createServer(pontinhoApp.app);

mongoose.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Mongo connected");
    httpServer.listen(pontinhoApp.port, () => {
      console.log('Pontinho back-end started to listen to port: ' + pontinhoApp.port);
    })
  }
);
mongoose.set('useFindAndModify', false);

const matchServer = new MatchServer(httpServer)
