import express from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/creators', adminController.getAllCreators);
router.get('/withdrawals', adminController.getAllWithdrawals);
router.patch('/withdrawals/:id', adminController.updateWithdrawalStatus);
router.get('/logs', adminController.getSystemLogs);
router.get('/fraud', adminController.getFraudAlerts);
router.get('/overrides', adminController.getManualOverrides);

export default router;
