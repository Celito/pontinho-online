const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const PlayerSchema = new Schema(
    {
        playerName: {type: String, required: true}
    }
);

module.exports = mongoose.model('Player', PlayerSchema);