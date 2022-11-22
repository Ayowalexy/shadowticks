const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const identitySchema = new Schema({
    userId: String,
    name: String,
    imageUrl: String,
    isOwnned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('identity', identitySchema)