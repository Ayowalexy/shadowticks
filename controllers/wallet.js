// const Lazerpay = require('lazerpay-node-sdk').default;


import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import crypto from 'crypto';
import { sendCoinSchema, sendSchema } from '../middlewares/schema.js';
import Transaction from '../models/transactions.js';
import Lazerpay from 'lazerpay-node-sdk';
import axios from 'axios';


const LPayer = Lazerpay.default;

const LAZER_SECRET_KEY = process.env.LAZER_PAY_SK;
const LAZER_PUBLIC_KEY = process.env.LAZER_PAY_PK;
const lazerpay = new LPayer(LAZER_PUBLIC_KEY, LAZER_SECRET_KEY)




const getAllWallet = expressAsyncHandler(async (req, res) => {
    try {
        const response = await lazerpay.Misc.getAcceptedCoins();
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
})


const getWalletAddress = expressAsyncHandler(async (req, res) => {

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

const sendCoin = expressAsyncHandler(async (req, res) => {

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


const confirmPaymentWebhook = expressAsyncHandler(async (req, res) => {

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


const getAllTransactions = expressAsyncHandler(async (req, res) => {

    const user = await User.findById({ _id: req.params.id }).populate('transactions')
    if (user) {
        const transactions = user.transactions;
        res.status(200).json({ status: "success", message: 'All user transactions', data: transactions, meta: {} })
    }
})


const transferCoin = expressAsyncHandler(async (req, res) => {

    const { error, value } = sendSchema.validate(req.body);

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

    const user = await User.findById({_id: req.params.id})
    const receiver = await User.findById({_id: value.receiverId})

    if(user && receiver){
        if(user?.walletBalance >= value.amount){
            receiver.walletBalance = Number(receiver.walletBalance) + Number(value.amount);
            user.walletBalance = Number(user.walletBalance) - Number(value.amount);
            await receiver.save();
            await user.save();
            res.status(200).json({ status: "success", message: 'Amount transfered', walletBalance: user.walletBalance, meta: {} })
        } else {
            res.status(401).json({ status: "error", message: 'invalid data', meta: {error: "insufficient balance"} })
        }
    } else {
        res.status(401).json({ status: "error", message: 'invalid data', meta: {error: "user does not exist"} })
    }
})


export {
    sendCoin,
    getAllWallet,
    confirmPaymentWebhook,
    getAllTransactions,
    getWalletAddress,
    transferCoin
}