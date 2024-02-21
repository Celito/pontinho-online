import * as WebSocket from 'ws';
import { Message } from '../../pontinho-app/src/app/interfaces/Message'

export class Match {
  private _playerSockets: { [playerId: string]: WebSocket } = {};

  get id(): string {
    return this._matchId;
  }

  constructor(
    private _matchId: string
  ) { }

  public broadcast(message: string): void {
    console.log(`broadcasting to ${Object.keys(this._playerSockets).length} players`)
    for (const playerId in this._playerSockets) {
      this._playerSockets[playerId].send(message);
    }
  }

  public addPlayerSocket(playerId: string, socket: WebSocket): boolean {
    if (playerId in this._playerSockets) {
      return false;
    }
    this._playerSockets[playerId] = socket;
    console.log(`Adding a new WS to the match ${this._matchId}. The group now has ` +
      `${Object.keys(this._playerSockets).length} connections`);
    return true;
  }
}
