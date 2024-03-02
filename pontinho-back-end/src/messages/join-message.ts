import { MessageBase, MessageTypes } from "./message";

type JoinMessageData = {
  playerId: string
  matchId: string
}

export class JoinMessage extends MessageBase {
  type: MessageTypes = 'join';

  constructor(
    public data: JoinMessageData
  ) { super(); }
}
