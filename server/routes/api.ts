import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OrbitX MCN Backend is running smoothly' });
});

// Email confirmation endpoint
router.post('/send-confirmation', async (req, res) => {
  const { name, email, channelName, subscribers } = req.body;
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({ error: 'SMTP configuration missing' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: '"OrbitX MCN" <noreply@orbitx.com>',
      to: email,
      subject: 'Your OrbitX MCN Application is Received ✅',
      text: `Hi ${name},\n\nThank you for applying to join OrbitX MCN!\nWe have received your application and will review it shortly.\n\nYouTube Channel: ${channelName}\nSubscribers: ${subscribers}\n\nYou will get an update once your application is approved.\n\n– Team OrbitX MCN`,
    });
    res.json({ message: 'Email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
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

// YouTube Channel Data Proxy
router.get('/youtube/channel/:handle', async (req, res) => {
  const { handle } = req.params;
  const apiKey = process.env.YOUTUBE_API_KEY;
  const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;

  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API key not configured on server' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      // Step 1: Search for channel ID
      const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(cleanHandle)}&type=channel&key=${apiKey}`;
      const searchRes = await fetch(searchUrl, { signal: controller.signal });
      
      if (!searchRes.ok) {
        const errorData = await searchRes.json();
        return res.status(searchRes.status).json({ error: 'YouTube Search API error', details: errorData });
      }

      const searchData = await searchRes.json() as any;

      let channelId = '';
      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].id.channelId;
      } else {
        // Try forHandle if search fails
        const handleUrl = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&forHandle=${encodeURIComponent(cleanHandle)}&key=${apiKey}`;
        const handleRes = await fetch(handleUrl, { signal: controller.signal });
        if (handleRes.ok) {
          const handleData = await handleRes.json() as any;
          if (handleData.items && handleData.items.length > 0) {
            return res.json(handleData.items[0]);
          }
        }
        return res.status(404).json({ error: 'Channel not found' });
      }

      // Step 2: Get channel details
      const detailsUrl = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
      const detailsRes = await fetch(detailsUrl, { signal: controller.signal });
      
      if (!detailsRes.ok) {
        const errorData = await detailsRes.json();
        return res.status(detailsRes.status).json({ error: 'YouTube Details API error', details: errorData });
      }

      const detailsData = await detailsRes.json() as any;
      
      if (detailsData.items && detailsData.items.length > 0) {
        res.json(detailsData.items[0]);
      } else {
        res.status(404).json({ error: 'Channel details not found' });
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      console.warn('YouTube Proxy: Fetch aborted or timed out');
      return res.status(504).json({ error: 'Request to YouTube API was aborted or timed out' });
    }
    console.error('YouTube Proxy Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching YouTube data' });
  }
});

export default router;
