import { useState, useEffect } from "react";
import { MessageSquare, Bell, Zap } from "lucide-react";
import api from "@/lib/api";

export function RealTimeDashboard() {
  const [views, setViews] = useState(12450);
  const [subs, setSubs] = useState(85200);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New comment on 'Viral Tips'", time: "2m ago" },
    { id: 2, message: "Brand deal request received", time: "15m ago" },
  ]);

  // Poll real-time updates
  useEffect(() => {
    const fetchRealTimeStats = async () => {
      try {
        const res = await api.get('/youtube/stats');
        if (res.data.success) {
          setViews(parseInt(res.data.data.statistics.viewCount));
          setSubs(parseInt(res.data.data.statistics.subscriberCount));
        }
      } catch (error) {
        console.error("Error polling real-time stats:", error);
      }
    };

    // Initial fetch
    fetchRealTimeStats();

    // Poll every 30 seconds
    const interval = setInterval(fetchRealTimeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live Analytics */}
      <div className="lg:col-span-2 bg-[#141414] p-6 rounded-xl border border-[#262626]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Zap className="text-[#FF2D2D] w-5 h-5" /> Live Analytics
          </h2>
          <span className="text-xs text-[#FF2D2D] font-bold animate-pulse">● LIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#262626]">
            <p className="text-sm text-[#A1A1A1]">Current Views</p>
            <p className="text-3xl font-bold text-white">{views.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#262626]">
            <p className="text-sm text-[#A1A1A1]">Subscribers</p>
            <p className="text-3xl font-bold text-white">{subs.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Instant Notifications */}
      <div className="bg-[#141414] p-6 rounded-xl border border-[#262626]">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
          <Bell className="text-[#6366f1] w-5 h-5" /> Notifications
        </h2>
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className="text-sm border-b border-[#262626] pb-2">
              <p className="text-white">{n.message}</p>
              <p className="text-xs text-[#A1A1A1]">{n.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat Support */}
      <div className="lg:col-span-3 bg-[#141414] p-6 rounded-xl border border-[#262626]">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
          <MessageSquare className="text-[#10b981] w-5 h-5" /> Live Support Chat
        </h2>
        <div className="h-48 bg-[#1A1A1A] rounded-lg p-4 mb-4 overflow-y-auto border border-[#262626]">
          <p className="text-sm text-[#A1A1A1]"><strong>Support:</strong> Hello! How can I help you today?</p>
        </div>
        <div className="flex gap-2">
          <input type="text" className="flex-1 bg-[#1A1A1A] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF2D2D]" placeholder="Type your message..." />
          <button className="bg-[#10b981] text-white px-4 py-2 rounded-lg hover:bg-[#059669] transition-colors">Send</button>
        </div>
      </div>
    </div>
  );
}
