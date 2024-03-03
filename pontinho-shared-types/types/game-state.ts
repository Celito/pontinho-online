import { Player } from "./player";

export type GameState = {
  _id: string;
  host: string;
  players: (Player['_id'] | Player)[];
  mainPile: {
    cards: number[];
  }
  discard: {
    cards: number[];
  }
}