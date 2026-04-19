import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { initSocket } from './lib/socket';
import { startAgenda } from './lib/cron';
import { connectMongoDB } from './config/db';

// Modular Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import channelRoutes from './routes/channelRoutes';
import earningsRoutes from './routes/earningsRoutes';
import withdrawRoutes from './routes/withdrawRoutes';
import youtubeRoutes from './routes/youtubeRoutes';
import inviteRoutes from './routes/inviteRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import copyrightRoutes from './routes/copyrightRoutes';
import applicationRoutes from './routes/applicationRoutes';
import emailTemplateRoutes from './routes/emailTemplateRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Initialize Socket.io
  initSocket(httpServer);

  // Connect to MongoDB
  await connectMongoDB();

  // Start Agenda
  await startAgenda();

  app.use(cors());
  app.use(express.json());

  // Mount Modular Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/channels', channelRoutes);
  app.use('/api/earnings', earningsRoutes);
  app.use('/api/withdraw', withdrawRoutes);
  app.use('/api/youtube', youtubeRoutes);
  app.use('/api/invites', inviteRoutes);
  app.use('/api/notify', notificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/copyright', copyrightRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/email-templates', emailTemplateRoutes);
  app.use('/api/ai', aiRoutes);

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'OrbitX MCN Backend is running' });
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

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
