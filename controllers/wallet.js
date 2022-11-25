const asyncHandler = require('express-async-handler');
const LAZER_SECRET_KEY = process.env.LAZER_PAY_SK;
const LAZER_PUBLIC_KEY = process.env.LAZER_PAY_PK;
const User = require('../models/userModel');


const sendCoin = asyncHandler(async (req, res) => {

    // const Lazerpay = require('lazerpay-node-sdk');

    // const transaction_payload = {
    //     reference: 'W6b8hV55l0435t3545435',
    //     customer_name: 'John Doe',
    //     customer_email: 'seinde@gmail.com',
    //     coin: 'USDC',
    //     currency: 'USD',
    //     fiatAmount: '100',
    //     acceptPartialPayment: true
    // };

    // const response = await lazerpay.Payment.initializePayment(transaction_payload);

    res.send("Coming soon")

})

module.exports = {
    sendCoin
}