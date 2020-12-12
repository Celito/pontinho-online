import * as mongoose from 'mongoose';
import { IPlayer } from './player';
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

export interface IGameState extends mongoose.Document {
    host: string;
    players: IPlayer['_id'][];
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
const GameStateSchema = new mongoose.Schema(
    {
        host: { type: String, required: true, default: " " },
        players: { type: [mongoose.Types.ObjectId], required: true, default: [] },
        mainPile: { type: {}, required: true, default: { cards } },
        discard: { type: {}, required: true, default: { cards: [] } }
    }
);

export default mongoose.model<IGameState>('GameState', GameStateSchema);