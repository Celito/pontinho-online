import PlayerModel, { IPlayer } from '../model/player';
import GameStateModel, { IGameState } from '../model/game-state';
import IControllerBase from '../config/controller-base';
import { Request, Response, Application, Router } from "express";
import { Schema } from 'mongoose';

export class GameStateController implements IControllerBase {

  public router = Router();

  initRoutes(app: Application): void {
    app.post("/api/match/create", (req, res) => this.createGame(req, res));
    app.get("/api/match", (req, res) => this.listMatches(req, res));
    app.get("/api/match/:matchId/:playerId", (req, res) => this.getMatch(req, res));
    app.post("/api/match/join", (req, res) => this.joinMatch(req, res));
  }

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
              const newGameState = new GameStateModel();
              newGameState
                .save()
                .then((ngs: IGameState) => {
                  const ngsPlayers = ngs.players;
                  ngsPlayers.push(np._id);
                  GameStateModel
                    .findByIdAndUpdate(
                      ngs._id,
                      { $set: { players: ngsPlayers, host: np.playerName } },
                      { new: true }
                    )
                    .then(updatedGameState => {
                      if (updatedGameState) {
                        res.status(200)
                          .send(
                            this.filterGameStateForPlayer(updatedGameState, np._id.toString())
                          );
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

  listMatches(_: any, res: any) {
    GameStateModel.find()
      .then(gameState => {
        if (gameState) {
          const resJson = gameState.map((gs) => {
            return { _id: gs._id, host: gs.host }
          })
          res.send(resJson);
        }
        else {
          res.send([]);
        }
      });
  }

  joinMatch(req: Request, res: Response) {
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
              GameStateModel.findById({ _id: req.body.match_id })
                .then(gameState => {
                  if (!gameState) {
                    return;
                  }
                  const newPlayersList = gameState.players;
                  newPlayersList.push(np._id);
                  GameStateModel
                    .findByIdAndUpdate(
                      gameState._id,
                      { $set: { players: newPlayersList } },
                      { new: true }
                    )
                    .populate('players')
                    .then(updatedGameState => {
                      if (!updatedGameState) {
                        return;
                      }
                      res.send(
                        this.filterGameStateForPlayer(updatedGameState, np._id.toString())
                      );
                    });
                });
            })
            .catch((err => {
              console.log(err);
            }));
        }
      })
  }

  getMatch(req: Request, res: Response) {
    // TODO: Filter cards that the player shouldn't see
    GameStateModel.findOne({ _id: req.params.matchId })
      .populate('players')
      .then(gameState => {
        if (gameState) {
          res.send(this.filterGameStateForPlayer(gameState, req.params.playerId));
        } else {
          res.sendStatus(404);
        }
      });
  }

  filterGameStateForPlayer(gameState: IGameState, playerId: string): any {
    const filteredGameState = {
      _id: gameState._id,
      host: gameState.host,
      players: gameState.players.map(p => {
        const castP = p as IPlayer;
        return {
          playerName: castP.playerName,
          yourTurn: castP.yourTurn,
          alreadyDraw: castP.alreadyDraw,
          scores: castP.alreadyDraw,
          cards: castP.cards.map(c => castP._id.toString() === playerId ? c : 0)
        };
      }),
      mainPile: {
        cards: gameState.mainPile.cards.map(_ => 0)
      },
      discard: gameState.discard
    }
    return filteredGameState;
  }
}