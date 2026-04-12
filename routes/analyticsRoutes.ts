import express from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/global', analyticsController.getGlobalAnalytics);
router.get('/channel/:channelId', analyticsController.getChannelAnalytics);

export default router;
