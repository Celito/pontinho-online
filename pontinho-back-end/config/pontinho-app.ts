import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import IControllerBase from './controller-base';

// const path = require('path');

export class PontinhoApp {

  app: Application;
  port: number;

  constructor(appInit: { port: number; controllers: IControllerBase[] }) {
    this.app = express();
    this.port = appInit.port;
    this.app.set('port', this.port);
    this.app.use(bodyParser.json());
    this.app.use(cors() as any);
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static('./public'));
    this.initControllers(appInit.controllers);
  }

  initControllers(controllers: IControllerBase[]): void {
    controllers.forEach(c => c.initRoutes(this.app));
  }
}