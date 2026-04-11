import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(cors());
  app.use(express.json());

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'OrbitX MCN Backend is running' });
  });

  app.get('/api/admin/stats', (req, res) => {
    res.json({
      totalCreators: 156,
      activeApplications: 23,
      totalRevenue: 45000,
      systemStatus: 'Healthy'
    });
  });

  app.get('/api/youtube/stats', async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.CHANNEL_ID;

    if (!apiKey || !channelId) {
      return res.status(400).json({ 
        success: false, 
        message: 'YouTube API Key or Channel ID not configured' 
      });
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('YouTube API Error Response:', JSON.stringify(errorData, null, 2));
        throw new Error(`YouTube API responded with status: ${response.status}. Reason: ${errorData.error?.message || 'Unknown'}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Channel not found' 
        });
      }

      const channel = data.items[0];
      res.json({
        success: true,
        data: {
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
          statistics: channel.statistics
        }
      });
    } catch (error) {
      console.error('Error fetching YouTube stats:', error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch YouTube statistics' 
      });
    }
  });

  // Alias for user request
  app.get('/api/channel', async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.CHANNEL_ID;
    if (!apiKey || !channelId) return res.status(400).json({ error: 'Not configured' });
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`);
      const data = await response.json();
      if (data.items && data.items[0]) res.json(data.items[0]);
      else res.status(404).json({ error: 'Not found' });
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // 🎬 Latest Videos
  app.get("/api/youtube/videos", async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.CHANNEL_ID;
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('YouTube API Videos Error:', JSON.stringify(errorData, null, 2));
        return res.status(response.status).json({ 
          error: `YouTube API Error: ${errorData.error?.message || 'Unknown'}` 
        });
      }

      const data = await response.json();
      res.json(data.items || []);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Alias for user request
  app.get("/api/videos", async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.CHANNEL_ID;
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data.items || []);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // 🔍 Search Videos
  app.get("/api/youtube/search/:query", async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    try {
      const q = encodeURIComponent(req.params.query);
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${q}&part=snippet&maxResults=6`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('YouTube API Search Error:', JSON.stringify(errorData, null, 2));
        return res.status(response.status).json({ 
          error: `YouTube API Error: ${errorData.error?.message || 'Unknown'}` 
        });
      }

      const data = await response.json();
      res.json(data.items || []);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Alias for user request
  app.get("/api/search/:query", async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    try {
      const q = encodeURIComponent(req.params.query);
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${q}&part=snippet&maxResults=6`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data.items || []);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });

  // 🧠 MCN Multi Channel
  app.post("/api/youtube/mcn", async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    try {
      const ids = req.body.channels || [];
      let results = [];
      for (let id of ids) {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`YouTube API MCN Error for ${id}:`, JSON.stringify(errorData, null, 2));
          continue; // Skip failed channels
        }

        const data = await response.json();
        if (data.items && data.items[0]) {
          results.push(data.items[0]);
        }
      }
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Example endpoint for creators
  app.get('/api/creators', (req, res) => {
    res.json([
      { id: '1', name: 'John Doe', channelName: 'John Vlogs', subscribers: 1500000 },
      { id: '2', name: 'Jane Smith', channelName: 'Jane Gaming', subscribers: 2500000 }
    ]);
  });

  // Endpoint for channel invites
  app.post('/api/invites', async (req, res) => {
    const { channelName, email, message } = req.body;
    
    console.log(`Received invite request for ${channelName} (${email})`);
    
    try {
      const mailOptions = {
        from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <invites@orbitx.com>',
        to: email,
        subject: `Exclusive Invitation to Join OrbitX MCN - ${channelName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4f46e5; margin: 0;">OrbitX MCN</h1>
            </div>
            <h2 style="color: #1f2937;">You're Invited!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hello <strong>${channelName}</strong> team,</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">We have been closely following your channel's growth and we are incredibly impressed by the quality of your content. We would love to invite you to join the OrbitX Multi-Channel Network.</p>
            
            ${message ? `
            <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #4f46e5; margin: 20px 0; border-radius: 4px;">
              <strong style="color: #374151;">A personal note from our team:</strong><br/><br/>
              <span style="color: #4b5563; font-style: italic;">"${message}"</span>
            </div>` : ''}
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">As part of OrbitX, you'll get access to:</p>
            <ul style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              <li>Premium Content ID protection</li>
              <li>Exclusive brand sponsorship opportunities</li>
              <li>Advanced analytics and AI tools</li>
              <li>Dedicated partner support</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://orbitx-mcn.com/apply" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Review Invitation & Apply</a>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">We look forward to potentially working together to take your channel to the next level!</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Best regards,<br/><strong>The OrbitX Team</strong></p>
          </div>
        `
      };

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log(`Invite email sent successfully to ${email}`);
      } else {
        console.log('⚠️ SMTP credentials not configured. Email would have been sent:');
        console.log(`To: ${email}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('(Check server logs for full HTML content)');
      }

      res.json({ success: true, message: 'Invite sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email invite' });
    }
  });

  // Notification endpoints
  app.post('/api/notify/application', async (req, res) => {
    const { name, email, channelName, status, adminNotes } = req.body;
    try {
      const mailOptions = {
        from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <notifications@orbitx.com>',
        to: email,
        subject: `OrbitX Application Update: ${status}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Application Status Update</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your application for <strong>${channelName}</strong> has been updated to: <strong style="color: #4f46e5;">${status}</strong>.</p>
            ${adminNotes ? `<div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;"><strong>Admin Notes:</strong><br/>${adminNotes}</div>` : ''}
            <p>If you have any questions, please reply to this email.</p>
            <p>Best regards,<br/>The OrbitX Team</p>
          </div>
        `
      };
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false });
    }
  });

  app.post('/api/notify/payout', async (req, res) => {
    const { email, name, amount, method, status, reference } = req.body;
    try {
      const mailOptions = {
        from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <finance@orbitx.com>',
        to: email,
        subject: `OrbitX Payout Update: ${status}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #10b981;">Payout Notification</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>A payout of <strong>$${amount}</strong> via <strong>${method}</strong> has been updated to: <strong>${status}</strong>.</p>
            ${reference ? `<p><strong>Reference:</strong> ${reference}</p>` : ''}
            <p>Thank you for being part of OrbitX!</p>
            <p>Best regards,<br/>The OrbitX Finance Team</p>
          </div>
        `
      };
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false });
    }
  });

  app.post('/api/notify/copyright', async (req, res) => {
    const { email, name, videoTitle, claimant, matchType } = req.body;
    try {
      const mailOptions = {
        from: process.env.SMTP_USER ? `"OrbitX MCN" <${process.env.SMTP_USER}>` : '"OrbitX MCN" <legal@orbitx.com>',
        to: email,
        subject: `Urgent: Copyright Claim Detected - ${videoTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ef4444; border-radius: 8px;">
            <h2 style="color: #ef4444;">Copyright Claim Notification</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Our system has detected a copyright claim on your video: <strong>${videoTitle}</strong>.</p>
            <div style="background: #fee2e2; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>Claimant:</strong> ${claimant}</p>
              <p><strong>Match Type:</strong> ${matchType}</p>
            </div>
            <p>Please log in to your dashboard to review the claim and take necessary action.</p>
            <p>Best regards,<br/>The OrbitX Legal Team</p>
          </div>
        `
      };
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false });
    }
  });

  // 404 for API routes
  app.use('/api/*all', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
