import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function ConnectYouTube() {
  const handleConnect = async () => {
    try {
      const response = await fetch('/api/youtube/auth/url');
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to get auth URL");
      }
    } catch (error) {
      console.error("Error connecting YouTube:", error);
    }
  };

  return (
    <button onClick={handleConnect} className="bg-red-600 text-white px-4 py-2 rounded">
      Connect YouTube Channel
    </button>
  );
}
