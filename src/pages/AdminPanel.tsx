import { useEffect, useState } from "react";
import { collection, onSnapshot, query, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import MainLayout from "../layout/MainLayout";
import { Users, ShieldCheck, Wallet, MailPlus, Settings } from "lucide-react";

// Sub-components as placeholder definitions for clarity
const TabButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all font-semibold ${active ? 'border-[#39FF14] text-white' : 'border-transparent text-[#A1A1A1] hover:text-white'}`}
  >
    <Icon size={18} /> {label}
  </button>
);

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Channels");
  const [pendingChannels, setPendingChannels] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "channels"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((c: any) => c.status === "Pending");
      setPendingChannels(data);
    });
    return () => unsubscribe();
  }, []);

  const approveChannel = async (id: string) => {
    await updateDoc(doc(db, "channels", id), { status: "Active" });
  };

  return (
    <MainLayout>
      <div className="p-8 bg-black min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Admin Control Hub</h2>
        
        {/* --- Tabs --- */}
        <div className="flex border-b border-white/10 mb-8">
          <TabButton active={activeTab === "Channels"} icon={ShieldCheck} label="Channel Approvals" onClick={() => setActiveTab("Channels")} />
          <TabButton active={activeTab === "Users"} icon={Users} label="User Management" onClick={() => setActiveTab("Users")} />
          <TabButton active={activeTab === "Withdrawals"} icon={Wallet} label="Payout Review" onClick={() => setActiveTab("Withdrawals")} />
          <TabButton active={activeTab === "Invites"} icon={MailPlus} label="Invite Creator" onClick={() => setActiveTab("Invites")} />
        </div>

        {/* --- Tab Content --- */}
        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-3xl shadow-sm">
          {activeTab === "Channels" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-6">Pending Approvals</h3>
              {pendingChannels.length === 0 ? <p className="text-[#A1A1A1]">No pending approvals.</p> : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-white/5">
                    {pendingChannels.map((channel: any) => (
                      <tr key={channel.id}>
                        <td className="py-4">{channel.name}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => approveChannel(channel.id)} className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#39FF14]/90">Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {activeTab === "Invites" && (
            <div className="text-[#A1A1A1]"> {/* Placeholder for Invite Creator integrated view */}
              <h3 className="text-xl font-semibold text-white mb-4">Send New Invite</h3>
              <p>Navigate to the <a href="/admin/invite-creator" className="text-[#D4AF37] underline">Admin Invite Creator page</a> to manage invitations.</p>
            </div>
          )}
          {/* Add other tab contents here similarly */}
          {activeTab !== "Channels" && activeTab !== "Invites" && (
             <div className="text-center py-10 text-[#A1A1A1]">Feature for {activeTab} is coming soon.</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
