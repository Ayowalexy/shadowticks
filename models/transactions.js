const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const transactionSchema = new Schema({
    coin: String,
    currency: String,
    amountReceived: Number,
    status: String,
    type: String

}, { timestamps: true })

module.exports = mongoose.model('transaction', transactionSchema)