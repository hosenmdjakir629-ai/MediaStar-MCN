import express from 'express';
import * as channelController from '../controllers/channelController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my', authMiddleware, channelController.getMyChannels);
router.post('/link', authMiddleware, channelController.linkChannel);

export default router;
