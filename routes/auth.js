const express = require('express');
const router = express.Router();
const { secured } = require('../middlewares/authenticate')
const { seedDB, getAllIdentity, claimIdentity, loginUser } = require('../controllers/authControllers');


router.route('/seed').get(secured, seedDB);
router.route('/all-identity').get(secured, getAllIdentity);
router.route('/identity/:id').get(secured, claimIdentity)
router.route('/login').post(loginUser);


module.exports = router