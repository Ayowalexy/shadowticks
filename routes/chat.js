const express = require('express');
const router = express.Router();
const { generateUrl } = require('../controllers/chat');
const { protect } = require('../middlewares/authenticate')

router.route('/').get(protect, generateUrl);


module.exports = router