import express from 'express';
import { generateUrl, addReaction, deleteFeedMessage, deleteRoomMessage } from '../controllers/chat.js';
import { protect } from '../middlewares/authenticate.js';
const router = express.Router();



router.route('/').get(protect, generateUrl);
router.route('/reaction/:id/:userId').post(protect, addReaction);
router.route('/delete-message/:id').delete(protect, deleteFeedMessage);
router.route('/user-message/:id/:receiver/:msgId').delete(protect, deleteRoomMessage)


export default router