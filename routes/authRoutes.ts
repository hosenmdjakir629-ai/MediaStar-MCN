import express from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify', authController.verifyEmail);
router.post('/resend-verification', authMiddleware, authController.resendVerification);

export default router;
