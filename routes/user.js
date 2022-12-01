import { getUserDetails } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authenticate.js';
import express from  'express';

const router = express.Router();

router.route('/:id').get(protect, getUserDetails);

export default router