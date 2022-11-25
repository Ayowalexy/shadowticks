const express = require('express');
const router = express.Router();
const { sendCoin } = require('../controllers/wallet');
const { protect } = require('../middlewares/authenticate')

router.route('/send').post(protect, sendCoin);


module.exports = router