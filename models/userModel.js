const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userModel = new Schema({
    identity: {
        type: Schema.Types.ObjectId,
        ref: 'identity'
    },
    userId: {
        type: String,
        default: ""
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    socketId: String
}, { timestamps: true })

module.exports = mongoose.model('user', userModel)