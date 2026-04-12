import express from 'express';
import * as earningsController from '../controllers/earningsController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my', authMiddleware, earningsController.getMyEarnings);
router.get('/user/:id', authMiddleware, adminMiddleware, earningsController.getEarnings);
router.post('/add', authMiddleware, adminMiddleware, earningsController.addEarning);
router.get('/network', authMiddleware, adminMiddleware, earningsController.getNetworkEarnings);

export default router;
