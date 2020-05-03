
const controller = require("../controller/game-state-controller.js");

module.exports = function(app){
    app.post("/api/match/create", controller.createGame);
    app.get("/api/match", controller.listMatches);
}