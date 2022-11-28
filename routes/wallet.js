const express = require('express');
const router = express.Router();
const { sendCoin, getAllWallet, confirmPaymentWebhook, getAllTransactions, getWalletAddress } = require('../controllers/wallet');
const { protect } = require('../middlewares/authenticate')

router.route('/send').post(protect, sendCoin);
router.route('/').get(protect, getAllWallet)
router.route('/address').get(protect, getWalletAddress)
router.route('/payment').post(confirmPaymentWebhook);
router.route('/transactions/:id').get(protect, getAllTransactions)


module.exports = router

// https://swapplug.herokuapp.com/api/v1/coins/webhook/payment