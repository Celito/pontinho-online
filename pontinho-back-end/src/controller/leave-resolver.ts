import { LeaveMessage } from "shared-types/messages";
import WebSocket = require("ws");

export const resolveLeave = async (ws: WebSocket, message: LeaveMessage) => {
  console.log('resolving a leave message', message);
}