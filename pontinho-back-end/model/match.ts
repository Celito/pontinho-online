import * as WebSocket from 'ws';

export class Match {
  private _playerSockets:{ [playerId: string]: WebSocket } = {};

  constructor(
    private _matchId: string
  ) {}

  public broadcast(emmiterId: string, message: string): void {
    for(const playerId in this._playerSockets) {
      if(playerId !== emmiterId) {
        this._playerSockets[playerId].send(message);
      }
    }
  }

  public addPlayerSocket(playerId:string, socket: WebSocket):boolean {
    if(playerId in this._playerSockets) {
      return false;
    }
    this._playerSockets[playerId] = socket;
    console.log(`Adding a new WS to the match ${this._matchId}. The group now has ` +
      `${Object.keys(this._playerSockets).length} connections`);
    return true;
  }
}