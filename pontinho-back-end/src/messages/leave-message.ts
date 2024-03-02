import { MessageBase, MessageTypes } from "./message";

type LeaveMessageData = {
  playerId: string
}

export class LeaveMessage extends MessageBase {
  readonly type: MessageTypes = 'leave';

  constructor(
    public data: LeaveMessageData
  ) { super(); }
}
