import { adminDb } from './lib/firebaseAdmin.js';

async function testFirestore() {
  try {
    console.log("Testing Firestore access...");
    const snapshot = await adminDb.collection('email_templates').limit(1).get();
    console.log("Successfully accessed Firestore. Documents:", snapshot.size);
  } catch (error) {
    console.error("Firestore test failed:", error);
  }
}

testFirestore();
