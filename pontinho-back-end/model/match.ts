import * as WebSocket from 'ws';
import { IGameState } from './game-state';
import { GameStateController } from '../controller/game-state-controller';
import { PlayerStatus } from './player';

export interface Message {
  type: 'joined';
  params: {
    player_id?: string;
  };
  state: IGameState;
}

export type PlayerStatusMap = { [playerId: string]: PlayerStatus }

export class Match {
  private _playerSockets: { [playerId: string]: WebSocket } = {};

  get id(): string {
    return this._matchId;
  }

  get playerStatus(): PlayerStatusMap {
    const status: PlayerStatusMap = {};
    for (const playerId in this._playerSockets) {
      status[playerId] = this._playerSockets[playerId].readyState === WebSocket.OPEN ? 'Online' : 'Offline'
    }
    return status
  }

  constructor(
    private _matchId: string
  ) { }

  public broadcast(message: Message): void {
    console.log(`broadcasting to ${Object.keys(this._playerSockets).length} players`)
    for (const playerId in this._playerSockets) {
      message.state = GameStateController.filterGameStateForPlayer(message.state, playerId)
      this._playerSockets[playerId].send(JSON.stringify(message), (r) => {
        console.log(`message sent to ${playerId}: `, r)
      });
    }
  }

  public addPlayerSocket(playerId: string, socket: WebSocket): boolean {
    const alreadyIn = playerId in this._playerSockets
    if (alreadyIn) {
      delete this._playerSockets[playerId]
    }
    this._playerSockets[playerId] = socket;
    console.log(`${alreadyIn ? 'Re-adding' : 'Adding a new'} WS to the match ${this._matchId}. The group now has ` +
      `${Object.keys(this._playerSockets).length} connections`);
    return true;
  }
}
