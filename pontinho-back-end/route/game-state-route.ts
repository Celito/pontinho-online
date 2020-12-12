import { GameStateController } from "../controller/game-state-controller";

export class GameStateRoute {
    constructor(app: any) {
        const controller = new GameStateController();

        app.post("/api/match/create", controller.createGame);
        app.get("/api/match", controller.listMatches);
        app.post("/api/match/join", controller.joinMatch);
    }
}