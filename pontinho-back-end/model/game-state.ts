import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IPlayer } from './player';

export interface IGameState extends mongoose.Document {
    host: string;
    players: (IPlayer['_id'] | IPlayer)[];
    mainPile: {
        cards: number[];
    }
    discard: {
        cards: number[];
    }
}

const cards = Array.from(Array(104), (x, index) => index + 1);

function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

shuffleArray(cards);
const GameStateSchema = new Schema(
    {
        host: String,
        players: [{ type: Schema.Types.ObjectId, ref: 'Player', required: true }],
        mainPile: { type: {}, required: true, default: { cards } },
        discard: { type: {}, required: true, default: { cards: [] } }
    }
);

export default mongoose.model<IGameState>('GameState', GameStateSchema);