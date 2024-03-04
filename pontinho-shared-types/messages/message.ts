import * as ws from "ws";
import { MessageBase, MessageTypes } from "./message-base";

type ResolverSignature<W, T> = (ws: W, message: any, options?: T) => Promise<void>

export const createResolver = (resolvers: Record<MessageTypes, ResolverSignature<ws, {}>>) => {
  return new MessageResolver(resolvers)
}

export class MessageResolver<W = ws | WebSocket, T = {}> {
  constructor(private resolvers: Record<MessageTypes, ResolverSignature<W, T>>) { }

  async resolveMessage(ws: W, message: ws.Data, options?: T) {
    const decodedMessage: MessageBase = JSON.parse(message.toString());
    await this.resolvers[decodedMessage.type](ws, decodedMessage, options)
  }
}