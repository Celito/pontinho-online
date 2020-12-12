import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { GameStateRoute } from '../route/game-state-route';

// const path = require('path');

export class ExpressConfig {

  app: any;

  constructor() {
    this.app = express();
    this.app.set("port", 3000);
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static('./public'));
    new GameStateRoute(this.app);
  }
}