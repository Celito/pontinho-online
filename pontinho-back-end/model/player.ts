import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export type PlayerStatus = 'Online' | 'Offline';

export interface IPlayer {
  _id: string;
  name: string;
  cards: number[];
  yourTurn: boolean;
  alreadyDraw: boolean;
  scores: number;
  status?: PlayerStatus;
}

const PlayerSchema = new Schema(
  {
    name: { type: String, required: true },
    cards: { type: [Number], required: true, default: [] },
    yourTurn: { type: Boolean, required: true, default: false },
    alreadyDraw: { type: Boolean, required: true, default: false },
    scores: { type: Number, required: true, default: 0 }
  }
);

export default mongoose.model<IPlayer>('Player', PlayerSchema);