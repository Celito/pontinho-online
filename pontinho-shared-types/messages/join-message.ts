import { GameState } from "../types";
import { MessageBase, MessageTypes } from "./message-base";

type JoinMessageData = {
  playerId: string
  matchId: string
  state?: GameState;
}

export class JoinMessage extends MessageBase {
  type: MessageTypes = 'join';

  constructor(
    public data: JoinMessageData
  ) { super(); }
}
