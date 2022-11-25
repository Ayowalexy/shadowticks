const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    message: String,
    time: String,
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })


module.exports = mongoose.model('message', messageSchema)