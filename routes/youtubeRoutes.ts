import express from 'express';
import * as youtubeController from '../controllers/youtubeController';

const router = express.Router();

router.get('/auth/url', youtubeController.getAuthUrlEndpoint);
router.get('/auth/callback', youtubeController.authCallback);
router.get('/stats', youtubeController.getStats);
router.get('/videos', youtubeController.getVideos);
router.get('/search/:query', youtubeController.searchVideos);
router.post('/mcn', youtubeController.getMcnChannels);

export default router;
