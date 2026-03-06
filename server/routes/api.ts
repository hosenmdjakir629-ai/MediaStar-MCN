import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OrbitX MCN Backend is running smoothly' });
});

// Example endpoint for system statistics
router.get('/stats', (req, res) => {
  res.json({
    totalCreators: 150,
    activeCampaigns: 12,
    monthlyRevenue: 45000,
    systemStatus: 'Operational'
  });
});

// Example endpoint that accepts data
router.post('/echo', (req, res) => {
  const data = req.body;
  res.json({
    message: 'Data received successfully',
    receivedData: data,
    timestamp: new Date().toISOString()
  });
});

export default router;
