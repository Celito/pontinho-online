import * as WebSocket from 'ws';
import { Server as HTTPServer } from 'http';
import { gameStateController } from './game-state-controller';

export class MatchServer {
  private readonly wss: WebSocket.Server;

  constructor(server: HTTPServer) {
    this.wss = new WebSocket.Server({ server })

    this.wss.on('connection', (ws) => this.onConnection(ws));
  }

  private onConnection(ws: WebSocket): void {
    console.log(`New socket connection. Now server has ${this.wss.clients.size} connections.`);
    ws.on('message', (message) => this.onMessage(ws, message));
  }

  private async onMessage(ws: WebSocket, message: WebSocket.Data): Promise<void> {
    console.log('received:', message);
    const decodedMessage = JSON.parse(message.toString());
    if (decodedMessage.type === 'join') {
      const playerId: string = decodedMessage.data.playerId;
      const match = gameStateController.getMatch(decodedMessage.data.matchId);
      if (!playerId) {
        console.error('missing the playerId for a join message');
        return;
      }
      if (!match) {
        console.error('can\'t find a match for the join message received');
        return;
      }
      const addResult = match.addPlayerSocket(playerId, ws);
      console.log('add player to match restult: ', addResult);

      try {
        const state = await gameStateController.getGameStateFromIds(match.id, undefined, match.playerStatus);
        console.log('state for the broadcast: ', JSON.stringify(state))
        if (state) {
          match.broadcast(
            {
              type: 'joined',
              params: { player_id: playerId },
              state
            }
          );
        }
      } catch (e) {
        console.log('Error while trying join a match', e)
      }
    }
  }
}
