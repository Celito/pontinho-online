import * as WebSocket from "ws";
import { MessageBase, MessageTypes } from "./message-base";

type ResolverSignature<T> = (ws: WebSocket, message: any, options?: T) => Promise<void>

export const createResolver = (resolvers: Record<MessageTypes, ResolverSignature<{}>>) => {
  return new MessageResolver(resolvers)
}

export class MessageResolver<T = {}> {
  constructor(private resolvers: Record<MessageTypes, ResolverSignature<T>>) { }

  async resolveMessage(ws: WebSocket, message: WebSocket.Data, options?: T) {
    const decodedMessage: MessageBase = JSON.parse(message.toString());
    await this.resolvers[decodedMessage.type](ws, decodedMessage, options)
  }
}