import * as WebSocket from "ws";
import { MessageOptions } from "./match-server";
import { gameStateController } from "./game-state-controller";
import { JoinMessage } from "shared-types/messages";
import { Match } from "../model/match";

export const resolveJoin = async (ws: WebSocket, message: JoinMessage, options?: MessageOptions) => {
  const { server } = options!
  console.log('resolving a join message', message);
  // testing, we can keep the match state on the server object and not have to load it from the
  // DB on every message
  server.broadcast();
  const playerId: string = message.data.playerId;
  const match = gameStateController.getMatch(message.data.matchId);
  if (!playerId) {
    console.error('missing the playerId for a join message');
    return;
  }
  if (!match) {
    console.error('can\'t find a match for the join message received');
    return;
  }
  const addResult = match.addPlayerSocket(playerId, ws);
  console.log('add player to match restult: ', addResult);

  try {
    await broadcast(match, message);
  } catch (e) {
    console.log('Error while trying join a match', e)
  }
}

const broadcast = async (match: Match, message: JoinMessage) => {
  const playerSockets = match.playerSockets
  console.log(`broadcasting to ${Object.keys(playerSockets).length} players`)
  const state = await gameStateController.getGameStateFromIds(match.id, undefined, match.playerStatus)
  if (state) {
    for (const playerId in playerSockets) {
      message.state = gameStateController.filterGameStateForPlayer(state, playerId)
      playerSockets[playerId].send(JSON.stringify(message), (r) => {
        console.log(`message sent to ${playerId}: `, r)
      });
    }
  }
}