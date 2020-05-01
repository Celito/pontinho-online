import { Card } from './Card';
import { PlayerState } from './PlayerState';

export interface GameState {
  mainPile: {
    cards: Card[]
  }
  discard: {
    cards: Card[]
  }
  players: PlayerState[]
}