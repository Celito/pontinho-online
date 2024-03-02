import WebSocket = require("ws");
import { JoinMessage } from "../messages/join-message";
import { MessageOptions } from "./match-server";
import { gameStateController } from "./game-state-controller";

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
    const state = await gameStateController.getGameStateFromIds(match.id, undefined, match.playerStatus);
    console.log('state for the broadcast: ', JSON.stringify(state))
    if (state) {
      match.broadcast(
        {
          type: 'joined',
          params: { player_id: playerId },
          state
        }
      );
    }
  } catch (e) {
    console.log('Error while trying join a match', e)
  }
}