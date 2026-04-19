import express from 'express';
import * as aiChatController from '../controllers/aiChatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', authMiddleware, aiChatController.chat);

export default router;
