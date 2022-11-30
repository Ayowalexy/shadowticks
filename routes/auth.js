import { secured } from '../middlewares/authenticate.js';
import { seedDB, getAllIdentity, claimIdentity, loginUser } from '../controllers/authControllers.js';
import express from 'express';
const router = express.Router();


router.route('/seed').get(secured, seedDB);
router.route('/all-identity').get(secured, getAllIdentity);
router.route('/identity/:id').get(secured, claimIdentity)
router.route('/login').post(loginUser);

export default router