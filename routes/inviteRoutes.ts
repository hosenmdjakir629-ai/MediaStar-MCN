import express from 'express';
import * as inviteController from '../controllers/inviteController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, inviteController.sendInvite);
router.get('/referrals', authMiddleware, inviteController.getReferrals);
router.post('/track', authMiddleware, inviteController.trackReferral);

export default router;
