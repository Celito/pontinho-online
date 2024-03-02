import WebSocket = require("ws");
import { LeaveMessage } from "../messages/leave-message";

export const resolveLeave = async (ws: WebSocket, message: LeaveMessage) => {
  console.log('resolving a leave message', message);
}