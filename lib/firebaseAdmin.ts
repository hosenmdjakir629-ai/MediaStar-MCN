import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
  });
}

export const adminAuth = admin.auth();
// Initialize Firestore with the specific database ID from config
export const adminDb = getFirestore(admin.app(), firebaseConfig.firestoreDatabaseId || '(default)');
