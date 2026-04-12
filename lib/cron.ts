import { Agenda, Job } from 'agenda';

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
      // await agenda.every('1 minute', 'test job');
    } catch (error) {
      console.error('Failed to start Agenda:', error);
    }
  } else {
    console.warn('Agenda not initialized: MONGO_URI is missing or invalid');
  }
};
