import express from 'express';
import * as applicationController from '../controllers/applicationController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/', applicationController.getAllApplications);
router.post('/', applicationController.createApplication);
router.patch('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

export default router;
