import { Card } from './Card';

export interface PlayerState {
  _id: string;
  name: string;
  cards: Card[];
  yourTurn: boolean;
  alreadyDraw: boolean;
}