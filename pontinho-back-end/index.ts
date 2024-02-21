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
  ws.on('message', async (message: WebSocket.Data) => {
    console.log('received:', message);
    const decodedMessage = JSON.parse(message.toString());
    if (decodedMessage.type === 'join') {
      const playerId: string = decodedMessage.data.playerId;
      const match = gameStateController.getMatch(decodedMessage.data.matchId);
      if (!playerId) {
        console.error('missing the playerId for a join message');
        return;
      }
      if (!match) {
        console.error('can\'t find a match for the join message received');
        return;
      }
      const addResult = match.addPlayerSocket(playerId, ws);
      console.log('add player to match restult: ', addResult);

      try {
        const state = await GameStateController.getGameStateFromIds(match.id, undefined, match.playerStatus);
        console.log('state for the broadcast: ', JSON.stringify(state))
        if (state) {
          match.broadcast(
            {
              type: 'joined',
              params: { player_id: playerId },
              state
            }
          );
        }
      } catch (e) {
        console.log('Error while trying join a match', e)
      }
    }
  });
});

