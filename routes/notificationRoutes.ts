import express from 'express';
import * as notificationController from '../controllers/notificationController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/application', authMiddleware, adminMiddleware, notificationController.notifyApplication);
router.post('/payout', authMiddleware, adminMiddleware, notificationController.notifyPayout);
router.post('/copyright', authMiddleware, adminMiddleware, notificationController.notifyCopyright);

export default router;
