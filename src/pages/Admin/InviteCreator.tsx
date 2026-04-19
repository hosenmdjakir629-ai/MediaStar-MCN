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
    setIsLoading(true);
    try {
      const token = uuidv4();
      await addDoc(collection(db, "invites"), {
        email,
        token,
        status: "pending",
        role,
        createdAt: serverTimestamp(),
      });
      console.log(`Invite link: ${window.location.origin}/signup?token=${token}`);
      // In a real app, integrate email sending here via emailService.ts
      alert("Invite created! (Check console for link)");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Failed to create invite");
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
