import express from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.post('/kyc', authMiddleware, userController.updateKYC);
router.get('/all', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/creators', userController.getCreators);

export default router;
