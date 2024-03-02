import * as WebSocket from "ws";

export type MessageTypes = 'join' | 'leave'

export abstract class MessageBase {
  constructor() { }
  abstract readonly type: MessageTypes
}

type ResolverSignature<T> = (ws: WebSocket, message: any, options?: T) => Promise<void>

export class MessageResolver<T> {
  constructor(private resolvers: Record<MessageTypes, ResolverSignature<T>>) { }

  async resolve(ws: WebSocket, message: WebSocket.Data, options?: T) {
    const decodedMessage: MessageBase = JSON.parse(message.toString());
    await this.resolvers[decodedMessage.type](ws, decodedMessage, options)
  }
}