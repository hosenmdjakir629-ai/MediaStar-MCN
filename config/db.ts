import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let db: Firestore | null = null;
let auth: Auth | null = null;

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');

if (fs.existsSync(configPath)) {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    console.log('✅ Firebase Initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
  }
} else {
  console.warn('⚠️ firebase-applet-config.json not found. Firebase features will be disabled.');
}

export { db, auth };

// MongoDB Setup (Mongoose)
export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri || (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://'))) {
    console.error('❌ MONGO_URI is missing or invalid. Please check your environment variables.');
    return;
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    // Do not exit, allow the app to run in a degraded state or try to reconnect
  }
};
