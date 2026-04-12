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
    console.warn('⚠️ Invalid or missing MONGO_URI. MongoDB connection skipped.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    // Exit process on connection failure if URI was provided but failed
    process.exit(1);
  }
};
