import { Card } from './Card';

export type PlayerStatus = 'Online' | 'Offline'
export interface PlayerState {
  _id: string;
  name: string;
  cards: Card[];
  yourTurn: boolean;
  alreadyDraw: boolean;
  status: PlayerStatus;
}