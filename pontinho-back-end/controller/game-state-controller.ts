import PlayerModel, { IPlayer } from '../model/player';
import GameState, { IGameState } from '../model/game-state';

export class GameStateController {
  createGame(req: any, res: any) {
    PlayerModel.findOne({ playerName: req.body.playerName })
      .then((player: IPlayer | null) => {
        if (player) {
          res.status(409).send("You are already in a match, not possible to be in two matches at the same time");
        }
        else {
          const newPlayer = new PlayerModel(req.body);
          newPlayer
            .save()
            .then((np: IPlayer) => {
              const newGameState = new GameState();
              newGameState
                .save()
                .then((ngs: IGameState) => {
                  const ngsPlayers = ngs.players;
                  ngsPlayers.push(np._id);
                  GameState.findByIdAndUpdate(ngs._id, { $set: { players: ngsPlayers, host: np.playerName } }, { new: true })
                    .then(updatedNgs => {
                      if (updatedNgs) {
                        res.status(200)
                          .send({
                            _id: updatedNgs._id,
                            host: updatedNgs.host,
                            mainPile: { cards: Array.from(Array(104), (x, index) => 0) },
                            discard: updatedNgs.discard,
                            players: [np]
                          });
                      }
                    })
                })
            })
            .catch((err => {
              console.log(err);
            }));
        }
      });
  }

  listMatches(req: any, res: any) {
    GameState.find()
      .then(gs => {
        if (gs) {
          const resJson = gs.map(function (gs) {
            return { _id: gs._id, host: gs.host }
          })
          res.send(resJson);
        }
        else {
          res.send([]);
        }
      });
  }

  joinMatch(req: any, res: any) {
    PlayerModel.findOne({ playerName: req.body.playerName })
      .then(player => {
        if (player) {
          res.status(409).send("You are already in a match, not possible to be in two matches at the same time");
        }
        else {
          const newPlayer = new PlayerModel(req.body);
          newPlayer
            .save()
            .then(np => {
              GameState.findById({ _id: req.body.match_id })
                .then(gs => {
                  if (!gs) {
                    return;
                  }
                  const gsPlayers = gs.players;
                  gsPlayers.push(np._id);
                  GameState.findByIdAndUpdate(gs._id, { $set: { players: gsPlayers } }, { new: true })
                    .then(updatedNgs => {
                      if (!updatedNgs) {
                        return;
                      }
                      Promise.all(
                        gsPlayers.map(async function (gs) {
                          return PlayerModel.findById({ _id: gs._id })
                            .then(p => {
                              return p;
                            })
                        }))
                        .then(playersJson => {
                          console.log(playersJson);
                          const resJson = {
                            _id: updatedNgs._id,
                            host: updatedNgs.host,
                            mainPile: { cards: Array.from(Array(104), (x, index) => 0) },
                            discard: updatedNgs.discard,
                            players: playersJson
                          }

                          res.status(200).send(resJson)
                        });

                    });
                });
            })
            .catch((err => {
              console.log(err);
            }));
        }
      })
  }
}