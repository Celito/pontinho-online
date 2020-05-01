import { Card } from './Card';

export interface PlayerState {
  name: string;
  cards: Card[];
  yourTurn: boolean;
  alreadyDraw: boolean;
}