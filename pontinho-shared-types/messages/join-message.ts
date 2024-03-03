import { GameState } from "../types";
import { MessageBase, MessageTypes } from "./message-base";

type JoinMessageData = {
  playerId: string
  matchId: string
}

export class JoinMessage extends MessageBase {
  type: MessageTypes = 'join';
  state?: GameState;

  constructor(
    public data: JoinMessageData
  ) { super(); }
}
