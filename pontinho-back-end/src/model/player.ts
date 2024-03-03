import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Player } from 'shared-types/types'

const PlayerSchema = new Schema(
  {
    name: { type: String, required: true },
    cards: { type: [Number], required: true, default: [] },
    yourTurn: { type: Boolean, required: true, default: false },
    alreadyDraw: { type: Boolean, required: true, default: false },
    scores: { type: Number, required: true, default: 0 }
  }
);

export default mongoose.model<Player>('Player', PlayerSchema);