
import * as http from 'http';
import * as WebSocket from 'ws';
import { PontinhoApp } from './config/pontinho-app';
import { GameStateController } from './controller/game-state-controller';
import * as mongoose from 'mongoose';


// let app = require('./config/express-config')();
const gameStateController = new GameStateController();
const pontinhoApp = new PontinhoApp({
  port: 3000,
  controllers: [gameStateController]
});

const server = http.createServer(pontinhoApp.app);

mongoose.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Mongo connected");
    server.listen(pontinhoApp.port, () => {
      console.log('Pontinho back-end started to listen to port: ' + pontinhoApp.port);
    })
  }
);
mongoose.set('useFindAndModify', false);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log(`New socket connection. Now server has ${wss.clients.size} connections.`);

  ws.on('message', (message: WebSocket.Data) => {
    console.log('received: %s', message);
    const decodedMessage = JSON.parse(message.toString());
    if (decodedMessage.type === 'join') {
      gameStateController.addSocketToMatch(ws, decodedMessage.data.matchId, decodedMessage.data.playerId)
    }
  });

});

