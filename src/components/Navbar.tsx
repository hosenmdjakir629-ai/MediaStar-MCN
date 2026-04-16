import { Bell, Search, User } from "lucide-react";

export function Navbar() {
  return (
    <div className="bg-[#0D0D0D] border-b border-[#262626] p-4 flex justify-between items-center px-6">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] w-4 h-4" />
        <input 
            type="text" 
            placeholder="Search channels, earnings..." 
            className="w-full bg-[#1A1A1A] border border-[#262626] text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-[#FF2D2D] transition-all"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="text-[#A1A1A1] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
