import express from 'express';
import { generateUrl, addReaction } from '../controllers/chat.js';
import { protect } from '../middlewares/authenticate.js';
const router = express.Router();



router.route('/').get(protect, generateUrl);
router.route('/reaction/:id').post(protect, addReaction)


export default router