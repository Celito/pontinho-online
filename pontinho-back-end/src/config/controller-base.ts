import { Application, Router } from "express";

export default interface IControllerBase {
    router: Router;

    initRoutes(app: Application): void;
}