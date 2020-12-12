
import * as http from 'http';
import * as WebSocket from 'ws';
import { MongoConnect } from './util/mongo-connect';
import { ExpressConfig } from './config/express-config';


// let app = require('./config/express-config')();

const expressConfig = new ExpressConfig();

const server = http.createServer(expressConfig.app);

new MongoConnect(() => {
  server.listen(expressConfig.app.get('port'), () => {
    console.log('Pontinho back-end started to listen to port: ' + expressConfig.app.get('port'));
  })
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('connected: %s', ws);

  ws.on('message', (message: WebSocket.Data) => {
    console.log('received: %s', message);
  });

});

