import { Agenda, Job } from 'agenda';
import runMonitor from '../cron/monitor';

const MONGO_URI = process.env.MONGO_URI || '';

export let agenda: Agenda | null = null;

const isValidMongoUri = (uri: string) => {
  return uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'));
};

if (isValidMongoUri(MONGO_URI)) {
  try {
    agenda = new Agenda({
      db: { address: MONGO_URI, collection: 'agendaJobs' },
    } as any);

    agenda.define('test job', async (job: Job) => {
      console.log('Agenda test job running...');
    });

    agenda.define('video-publish', async (job: Job) => {
      const data = job.attrs.data as any;
      const { userId, videoId, tokens, videoData, videoUrl } = data;
      console.log(`Publishing video ${videoId} for user ${userId}...`);
      
      try {
        // In a real app, you'd fetch the video stream from S3/Storage
        // and call googleAuth.uploadVideo
        console.log(`Successfully published video: ${videoData.title}`);
        
        // Update status in DB (simulated)
      } catch (error) {
        console.error(`Failed to publish video ${videoId}:`, error);
        throw error;
      }
    });

    agenda.define('orbitx-monitor', async (job: Job) => {
      console.log('Running OrbitX Monitor...');
      await runMonitor();
    });
  } catch (error) {
    console.error('❌ Failed to initialize Agenda:', error);
    agenda = null;
  }
}

export const startAgenda = async () => {
  if (agenda) {
    try {
      await agenda.start();
      console.log('Agenda started');
      await agenda.every('10 minutes', 'orbitx-monitor');
    } catch (error) {
      console.error('Failed to start Agenda:', error);
    }
  } else {
    console.warn('Agenda not initialized: MONGO_URI is missing or invalid');
  }
};
