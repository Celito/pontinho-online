import { Card } from './Card';
import { PlayerState } from './PlayerState';

export interface GameState {
  _id: string;
  mainPile: {
    cards: Card[]
  };
  discard: {
    cards: Card[]
  };
  players: PlayerState[];
}