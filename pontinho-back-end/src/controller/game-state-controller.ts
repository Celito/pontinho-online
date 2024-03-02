import PlayerModel, { IPlayer, PlayerStatus } from '../model/player';
import GameStateModel, { IGameState } from '../model/game-state';
import IControllerBase from '../config/controller-base';
import { Request, Response, Application, Router } from "express";
import { Match } from '../model/match';

class GameStateController implements IControllerBase {

  public router = Router();

  public wsMatchGroups: {
    [matchId: string]: Match
  } = {};

  initRoutes(app: Application): void {
    app.post("/api/match/create", (req, res) => this.createGame(req, res));
    app.get("/api/match", (req, res) => this.listMatches(req, res));
    app.get("/api/match/:matchId/:playerId", (req, res) => this.getGameState(req, res));
    app.post("/api/match/join", (req, res) => this.joinMatch(req, res));
  }

  async createGame(req: Request, res: Response) {
    const existingPlayer = await PlayerModel.findOne({ name: req.body.name })
    if (existingPlayer) {
      return res.status(409).send("You are already in a match, not possible to be in two matches at the same time");
    }
    const newPlayer = await (new PlayerModel(req.body)).save();
    const newGameState = await (new GameStateModel()).save();
    const ngsPlayers = newGameState.players;
    ngsPlayers.push(newPlayer._id);
    this.wsMatchGroups[newGameState.id] = new Match(newGameState.id);
    const updatedGameState = await GameStateModel.findByIdAndUpdate(
      newGameState._id,
      { $set: { players: ngsPlayers, host: newPlayer.name } },
      { new: true }
    ).populate('players')
    if (!updatedGameState) {
      return res.status(500).send("Failed to generate the game state");
    }
    res.status(200).send(
      this.filterGameStateForPlayer(updatedGameState.toObject({ versionKey: false }) as IGameState, newPlayer._id.toString())
    );
  }

  async listMatches(_: Request, res: Response) {
    console.log('starting to list matches');
    const gameState = await GameStateModel.find() || []
    const resJson = gameState.map((gs) => {
      return { _id: gs._id, host: gs.host }
    })
    res.send(resJson);
  }

  async joinMatch(req: Request, res: Response) {
    const existingPlayer = await PlayerModel.findOne({ name: req.body.name })
    if (existingPlayer) {
      return res.status(409).send("You are already in a match, not possible to be in two matches at the same time");
    }
    const newPlayer = await (new PlayerModel(req.body)).save();
    if (!newPlayer) {
      return res.status(500).send("Failed to create a new player for your match");
    }
    const gameState = await GameStateModel.findById({ _id: req.body.match_id })
    if (!gameState) {
      return res.status(404).send("Failed to find the match you are trying to join");;
    }
    const newPlayersList = gameState.players;
    newPlayersList.push(newPlayer._id);
    const updatedGameState = await GameStateModel.findByIdAndUpdate(
      gameState._id,
      { $set: { players: newPlayersList } },
      { new: true }
    ).populate('players')
    if (!updatedGameState) {
      return res.status(500).send("Failed to join the match");
    }
    res.send(
      this.filterGameStateForPlayer(updatedGameState.toObject({ versionKey: false }) as IGameState, newPlayer._id.toString())
    );
  }

  async getGameState(req: Request, res: Response): Promise<void> {
    // TODO: Filter cards that the player shouldn't see
    const gameState = await this.getGameStateFromIds(req.params.matchId, req.params.playerId)
    if (gameState) {
      res.send(gameState);
    } else {
      res.sendStatus(404);
    }
  }

  async getGameStateFromIds(matchId: string, playerId?: string, playerStatus?: { [playerId: string]: PlayerStatus }): Promise<IGameState | null> {
    try {
      const gameState = (await GameStateModel.findOne({ _id: matchId }).populate('players'))?.toObject({ versionKey: false }) as IGameState
      if (gameState && playerStatus) {
        for (const playerIndex in gameState.players) {
          const player: IPlayer = JSON.parse(JSON.stringify(gameState.players[playerIndex]))
          gameState.players[playerIndex] = {
            ...player,
            status: playerStatus[player._id] || 'Offline'
          } as IPlayer
          console.log(`setting player ${player.name} status to ${(gameState.players[playerIndex] as IPlayer).status}`)
        }
      }
      if (gameState && playerId) {
        return this.filterGameStateForPlayer(gameState, playerId);
      }
      return gameState;
    } catch (e: unknown) {
      console.log(`Error while trying to get the game state from matchId: "${matchId}", playerId: "${playerId}"`)
      return null
    }
  }

  getMatch(matchId: string): Match {
    if (!this.wsMatchGroups[matchId]) {
      this.wsMatchGroups[matchId] = new Match(matchId);
    }
    return this.wsMatchGroups[matchId];
  }

  filterGameStateForPlayer(gameState: IGameState, playerId: string): IGameState {

    const filteredGameState = {
      ...gameState,
      players: gameState.players.map(p => {
        const castP = p as IPlayer;
        return {
          ...castP,
          cards: castP.cards?.map(c => castP._id === playerId ? c : 0) || []
        };
      }),
      mainPile: {
        cards: gameState.mainPile.cards.map(_ => 0)
      }
    }
    return filteredGameState;
  }
}

export const gameStateController = new GameStateController()
