import * as mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

export interface IPlayer extends mongoose.Document {
  playerName: string;
  cards: number[];
  yourTurn: boolean;
  alreadyDraw: boolean;
  scores: number;
}

const PlayerSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: true },
    cards: { type: [Number], required: true, default: [] },
    yourTurn: { type: Boolean, required: true, default: false },
    alreadyDraw: { type: Boolean, required: true, default: false },
    scores: { type: Number, required: true, default: 0 }
  }
);

export default mongoose.model<IPlayer>('Player', PlayerSchema);