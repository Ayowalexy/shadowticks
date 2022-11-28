const asyncHandler = require('express-async-handler');
const LAZER_SECRET_KEY = process.env.LAZER_PAY_SK;
const LAZER_PUBLIC_KEY = process.env.LAZER_PAY_PK;
const User = require('../models/userModel');
const crypto = require('crypto');
const { sendCoinSchema } = require('../middlewares/schema')
const Transaction = require('../models/transactions');
const Lazerpay = require('lazerpay-node-sdk').default;
const axios = require('axios');
const lazerpay = new Lazerpay(LAZER_PUBLIC_KEY, LAZER_SECRET_KEY)




const getAllWallet = asyncHandler(async (req, res) => {
    try {
        const response = await lazerpay.Misc.getAcceptedCoins();
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})


const getWalletAddress = asyncHandler(async (req, res) => {

    try {
        const response = await axios.get(
            'https://api.lazerpay.engineering/api/v1/crypto/funding/address',
            {
                headers: {
                    Authorization: `Bearer ${LAZER_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )

        res.status(200).json(response.data)
    } catch (e) {
        res.json({ messages: 'invalid request', status: 'error' })
    }
})

const sendCoin = asyncHandler(async (req, res) => {

    const { error, value } = sendCoinSchema.validate(req.body);

    if (error) {
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error.message
                    }
                })
    }

    const { amount, walletAddress, coin, id, userId } = value

    const transaction_payload = {
        amount,
        recipient: walletAddress,
        coin,
        blockchain: 'Binance Smart Chain',
        metadata: {
            id, userId
        }
    };
    try {

        const user = await User.findById({ _id: id });

        if (user && user?.walletBalance >= amount) {
            const response = await lazerpay.Payout.transferCrypto(transaction_payload);

            console.log('Reasponse', response.response);

            res.send(response.response.data)

        } else {
            return res.status(401).json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: 'Insufficient balance'
                    }
                })
        }

    } catch (e) {
        console.log(e);
    }
})


const confirmPaymentWebhook = asyncHandler(async (req, res) => {

    const hash = crypto.createHmac('sha256', LAZER_SECRET_KEY).update(JSON.stringify(req.body), 'utf8').digest('hex');

    if (hash == req.headers['x-lazerpay-signature']) {
        const event = req.body;
        const {
            coin,
            currency,
            amountReceived,
            status,
            type,
            metadata
        } = event;

        const id = metadata.id;

        const user = await User.findById({ _id: id });
        if (user) {
            const transaction = new Transaction({
                coin,
                currency,
                amountReceived,
                status,
                type
            })

            await transaction.save();
            const walletBalance = Number(user.walletBalance) + amountReceived
            user.walletBalance = walletBalance;
            user.transactions.push(transaction);
            await user.save();
        }

    }

    res.sendStatus(200);
})


const getAllTransactions = asyncHandler(async (req, res) => {

    const user = await User.findById({ _id: req.params.id }).populate('transactions')
    if (user) {
        const transactions = user.transactions;
        res.status(200).json({ status: "success", message: 'All user transactions', data: transactions, meta: {} })
    }
})


module.exports = {
    sendCoin,
    getAllWallet,
    confirmPaymentWebhook,
    getAllTransactions,
    getWalletAddress
}