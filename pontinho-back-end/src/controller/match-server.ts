import * as WebSocket from 'ws';
import { Server as HTTPServer } from 'http';
import { resolveJoin } from './join-resolver';
import { resolveLeave } from './leave-resolver';
import { MessageResolver } from 'shared-types/messages'

export type MessageOptions = {
  server: MatchServer
}

export class MatchServer {
  private readonly wss: WebSocket.Server;
  private readonly resolver: MessageResolver<MessageOptions> = new MessageResolver({
    join: resolveJoin,
    leave: resolveLeave
  });

  constructor(server: HTTPServer) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws) => this.onConnection(ws));
  }

  broadcast() {
    console.log('broadcasting')
  }

  private onConnection(ws: WebSocket): void {
    console.log(`New socket connection. Now server has ${this.wss.clients.size} connections.`);
    ws.on('message', (message) => this.onMessage(ws, message));
  }

  private async onMessage(ws: WebSocket, message: WebSocket.Data): Promise<void> {
    console.log('received:', message);
    await this.resolver.resolve(ws, message, { server: this });
  }
}
