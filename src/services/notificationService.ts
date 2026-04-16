import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export const sendInAppNotification = async (userId: string, message: string, type: string) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      message,
      type,
      read: false,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending in-app notification:", error);
  }
};
