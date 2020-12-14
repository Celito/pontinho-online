import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface IPlayer extends mongoose.Document {
  _id: Schema.Types.ObjectId;
  playerName: string;
  cards: number[];
  yourTurn: boolean;
  alreadyDraw: boolean;
  scores: number;
}

const PlayerSchema = new Schema(
  {
    playerName: { type: String, required: true },
    cards: { type: [Number], required: true, default: [] },
    yourTurn: { type: Boolean, required: true, default: false },
    alreadyDraw: { type: Boolean, required: true, default: false },
    scores: { type: Number, required: true, default: 0 }
  }
);

export default mongoose.model<IPlayer>('Player', PlayerSchema);