import mongoose from "mongoose";
const Schema = mongoose.Schema;


const transactionSchema = new Schema({
    coin: String,
    currency: String,
    amountReceived: Number,
    status: String,
    type: String

}, { timestamps: true })

const Transaction = mongoose.model('transaction', transactionSchema);

export default Transaction