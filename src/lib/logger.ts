import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

export const logAdminActivity = async (action: string, details: string) => {
  if (!auth.currentUser) return;

  try {
    await addDoc(collection(db, "logs"), {
      timestamp: serverTimestamp(),
      action,
      details,
      user: auth.currentUser.email || "Unknown",
      userId: auth.currentUser.uid,
    });
  } catch (error) {
    console.error("Error logging admin activity:", error);
  }
};
