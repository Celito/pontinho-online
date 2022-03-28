import { GameState } from "./GameState";

export interface Message {
  type: 'joined';
  params: {
    player_id?: string;
  };
  state: GameState;
}