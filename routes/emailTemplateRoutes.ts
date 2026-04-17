import express from 'express';
import { 
  getAllTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate 
} from '../controllers/emailTemplateController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected and admin only
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllTemplates);
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
