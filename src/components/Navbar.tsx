import { Bell, Search, User } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, text: "New claim detected on 'Deep House Mix'", time: "2m ago" },
    { id: 2, text: "Revenue update: $140.00 processed", time: "1h ago" },
    { id: 3, text: "Dispute closed on 'Tutorial: UE5'", time: "3h ago" },
  ];

  return (
    <div className="bg-[#0D0D0D] border-b border-[#262626] p-4 flex justify-between items-center px-6">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] w-4 h-4" />
        <input 
            type="text" 
            placeholder="Search channels, earnings..." 
            className="w-full bg-[#1A1A1A] border border-[#262626] text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-[#D4AF37] transition-all"
        />
      </div>
      <div className="flex items-center gap-4 relative">
        <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-[#A1A1A1] hover:text-[#D4AF37] transition-colors relative"
        >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#39FF14] rounded-full border-2 border-[#0D0D0D]"></span>
        </button>

        {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-[#0A0A0A] border border-[#262626] rounded-2xl shadow-2xl p-4 z-50">
                <h4 className="text-white font-semibold mb-4 px-2">Notifications</h4>
                <div className="space-y-4">
                    {notifications.map(n => (
                        <div key={n.id} className="p-3 bg-[#1A1A1A] rounded-lg hover:border-[#D4AF37] border border-transparent transition-all">
                            <p className="text-xs text-white">{n.text}</p>
                            <span className="text-[10px] text-[#A1A1A1]">{n.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
