import express from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.patch('/withdrawals/:id', adminController.updateWithdrawalStatus);

export default router;
