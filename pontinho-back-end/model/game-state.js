const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;
const cards = Array.from(Array(104), (x, index) => index + 1);

function shuffleArray(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

shuffleArray(cards);
const GameStateSchema = new Schema(
    {
        players: {type: [mongoose.Types.ObjectId], required:true, default: []},
        mainPile: {type: {}, required: true, default: {cards: cards}},
        discard: {type: {}, required: true, default: {cards: []}}
    }
);

module.exports = mongoose.model('GameState', GameStateSchema);