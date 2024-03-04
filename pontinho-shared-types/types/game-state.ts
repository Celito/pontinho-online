import { Player } from "./player";

export type GameState = {
  _id: string;
  host: string;
  players: Player[];
  mainPile: {
    cards: number[];
  }
  discard: {
    cards: number[];
  }
}