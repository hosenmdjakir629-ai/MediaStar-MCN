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
