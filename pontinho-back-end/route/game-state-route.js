
const controller = require("../controller/game-state-controller.js");

module.exports = function(app){
    app.post("/api/game-state/create", controller.createGame);
}