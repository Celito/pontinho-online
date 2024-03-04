
import { JoinMessage } from "shared-types/messages"
import { ResolverOptions } from "../match.service";

export const joinResolver = async (
  ws: WebSocket,
  message: JoinMessage,
  { matchService, toastr }: ResolverOptions
) => {
  console.log('resolver.join', message);
  if (message.data.state) {
    matchService.setGameState(message.data.state)
    if (message.data.playerId !== matchService.userId) {
      toastr.info(`${matchService.getPlayer(message.data.playerId)?.name} has joined the game`);
    }
  }

}