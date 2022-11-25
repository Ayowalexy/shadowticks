const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const feedsSchema = new Schema({
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'message'
    }],
})

module.exports = mongoose.model('feed', feedsSchema)