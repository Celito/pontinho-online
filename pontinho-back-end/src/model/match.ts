import * as WebSocket from 'ws';
import { gameStateController } from '../controller/game-state-controller';
import { PlayerStatus } from 'shared-types/types';
import { MessageBase } from 'shared-types/messages/message-base';

export type PlayerStatusMap = { [playerId: string]: PlayerStatus }

type PlayerSocketsMap = { [playerId: string]: WebSocket }

export class Match {
  private _playerSockets: PlayerSocketsMap = {};

  get id(): string {
    return this._matchId;
  }

  get playerStatus(): PlayerStatusMap {
    const status: PlayerStatusMap = {};
    for (const playerId in this._playerSockets) {
      status[playerId] =
        this._playerSockets[playerId].readyState === WebSocket.OPEN ?
          'Online' :
          'Offline';
    }
    return status;
  }

  get playerSockets(): PlayerSocketsMap {
    return this._playerSockets;
  }

  constructor(
    private _matchId: string
  ) { }

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
