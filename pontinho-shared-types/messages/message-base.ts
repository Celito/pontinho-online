export type MessageTypes = 'join' | 'leave'

export abstract class MessageBase {
  constructor() { }
  abstract readonly type: MessageTypes
}