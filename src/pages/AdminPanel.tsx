import { useEffect, useState } from "react";
import { collection, onSnapshot, query, updateDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import MainLayout from "../layout/MainLayout";
import { logAdminActivity } from "../lib/logger";

interface PendingChannel {
  id: string;
  name: string;
  youtubeChannelId: string;
  status: string;
}

export default function AdminPanel() {
  const [pendingChannels, setPendingChannels] = useState<PendingChannel[]>([]);

  useEffect(() => {
    const q = query(collection(db, "channels"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as PendingChannel))
        .filter((c) => c.status === "Pending");
      setPendingChannels(data);
    });
    return () => unsubscribe();
  }, []);

  const [channelToApprove, setChannelToApprove] = useState<{id: string, name: string} | null>(null);

  const approveChannel = async (id: string, name: string) => {
    await updateDoc(doc(db, "channels", id), { status: "Active" });
    await logAdminActivity("Approve Channel", `Approved channel: ${name}`);
    setChannelToApprove(null);
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Pending Channel Approvals</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3">Channel Name</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingChannels.map((channel) => (
              <tr key={channel.id} className="border-b">
                <td className="py-3">{channel.name}</td>
                <td className="py-3">
                  <button 
                    onClick={() => setChannelToApprove({id: channel.id, name: channel.name})}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {channelToApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Approval</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to approve channel <strong>{channelToApprove.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setChannelToApprove(null)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => approveChannel(channelToApprove.id, channelToApprove.name)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded text-sm font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
