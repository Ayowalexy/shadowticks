import express from 'express';
import { generateUrl, addReaction, deleteFeedMessage, deleteRoomMessage, } from '../controllers/chat.js';
import { protect } from '../middlewares/authenticate.js';
import { viewMessage, addImageToMessage } from '../controllers/chat.js';
const router = express.Router();



router.route('/').get(protect, generateUrl);
router.route('/reaction/:id/:userId').post(protect, addReaction);
router.route('/delete-message/:id').delete(protect, deleteFeedMessage);
router.route('/user-message/:id/:receiver/:msgId').delete(protect, deleteRoomMessage)
router.route('/message/:id')
    .put(protect, viewMessage)
    .post(protect, addImageToMessage)

export default router