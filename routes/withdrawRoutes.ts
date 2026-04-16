import express from 'express';
import * as withdrawController from '../controllers/withdrawController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my', authMiddleware, withdrawController.getMyWithdrawals);
router.get('/all', authMiddleware, adminMiddleware, withdrawController.getWithdrawals);
router.post('/calculate', authMiddleware, withdrawController.calculateWithdrawalFees);
router.post('/request', authMiddleware, withdrawController.requestWithdraw);
router.patch('/:id/status', authMiddleware, adminMiddleware, withdrawController.updateWithdrawalStatus);

export default router;
