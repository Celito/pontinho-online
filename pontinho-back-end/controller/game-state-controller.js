const GameState = require("../model/game-state")

module.exports.createGame = function(req, res){
    //TODO Check if player is in match
    const newGameState = new GameState(req.body);
    newGameState
    .save()
    .then(res.status(200).send(newGameState))
    //TODO Map for changing mainPile for ['0','0',...] to send to the front-end
    .catch((err => {
        console.log(err);
    }));
}