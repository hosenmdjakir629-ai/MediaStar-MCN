import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where, orderBy, limit, getDocFromServer, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signOut, 
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  serverTimestamp,
  arrayUnion
};

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("✅ Firebase connection successful");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();
