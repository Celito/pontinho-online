export type PlayerStatus = 'Online' | 'Offline';

export type Player = {
  _id: string;
  name: string;
  cards: number[];
  yourTurn: boolean;
  alreadyDraw: boolean;
  scores: number;
  status?: PlayerStatus;
}