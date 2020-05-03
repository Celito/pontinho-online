const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const PlayerSchema = new Schema(
    {
        playerName: {type: String, required: true},
        cards: {type: {}, required: true, default:{cards: []}},
        yourTurn: {type: Boolean, required: true, default:false},
        alreadyDraw: {type: Boolean, required: true, default:false},
        scores: {type: Number, required:true, default: 0}
    }
);

module.exports = mongoose.model('Player', PlayerSchema);