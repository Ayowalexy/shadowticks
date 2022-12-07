
import { protect } from '../middlewares/authenticate.js';
import { sendCoin, getAllWallet, confirmPaymentWebhook, getAllTransactions, getWalletAddress, transferCoin } from '../controllers/wallet.js';
import express from 'express'
const router = express.Router();

router.route('/send').post(protect, sendCoin);
router.route('/').get(protect, getAllWallet)
router.route('/address').get(protect, getWalletAddress)
router.route('/payment').post(confirmPaymentWebhook);
router.route('/transactions/:id').get(protect, getAllTransactions)
router.route('/transfer/:id').post(protect, transferCoin)


export default router

// https://swapplug.herokuapp.com/api/v1/coins/webhook/payment