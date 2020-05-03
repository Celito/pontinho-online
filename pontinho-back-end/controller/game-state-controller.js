const GameState = require("../model/game-state")
const Player = require("../model/player")

module.exports.createGame = function(req, res){
    Player.findOne({playerName: req.body.playerName})
    .then(player => {
        if(player){
            res.status(409).send("You are already in a match, not possible to be in two matches at the same time");
        }
        else{
            const newPlayer = new Player(req.body);
            newPlayer
            .save()
            .then(np => {
                const newGameState = new GameState();
                newGameState
                .save()
                .then(ngs => {
                    const ngsPlayers = ngs.players;
                    ngsPlayers.push(np._id);
                    GameState.findByIdAndUpdate(ngs._id, {$set:{players:ngsPlayers, host:np.playerName}}, {new:true})
                    .then(updatedNgs => {
                        res.status(200)
                        .send({
                               _id:updatedNgs._id, 
                               host: updatedNgs.host, 
                               mainPile: {cards: Array.from(Array(104), (x, index) => 0)}, 
                               discard: updatedNgs.discard, 
                               players: [np]
                            })
                    })
                })
            })
            .catch((err => {
                console.log(err);
            }));
        }
    })  
}

module.exports.listMatches = function(req, res){
    GameState.find()
    .then(gs => {
        if(gs){
            var resJson = gs.map(function(gs) {
                return{_id:gs._id, host: gs.host}
            })
            res.send(resJson);
        }
        else{
            res.send([]);
        }
    })
}

module.exports.joinMatch = function(req, res){

}