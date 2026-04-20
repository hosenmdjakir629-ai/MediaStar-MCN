import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import MainLayout from "../../layout/MainLayout";

export default function InviteCreator() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("creator");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be logged in to create invites.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/invites', { // Call the backend API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
        },
        body: JSON.stringify({
          email,
          role,
          channelName: 'OrbitX MCN'
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to send invite');
      }

      alert("Invite sent successfully!");
      setEmail("");
    } catch (error: any) {
      console.error(error);
      alert(`Failed to send invite: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold p-8">Invite Creator</h2>
      <form onSubmit={handleInvite} className="p-8 space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Creator Email" required className="border p-2 w-full rounded" />
        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 rounded">
          {isLoading ? "Sending..." : "Create Invite"}
        </button>
      </form>
    </MainLayout>
  );
}
