import React from 'react';
import { LayoutDashboard, Users, BarChart3, BrainCircuit, Settings, LogOut, Rocket, Wallet, Blocks, Headphones, X, Terminal, ShieldCheck } from 'lucide-react';
import { TabView } from '../types';

interface SidebarProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
  onLogout: () => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, onLogout, onClose }) => {
  const navItems = [
    { id: TabView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: TabView.CREATORS, label: 'Creators', icon: Users },
    { id: TabView.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: TabView.PAYOUTS, label: 'Payouts', icon: Wallet },
    { id: TabView.AI_STRATEGIST, label: 'OrbitX MCN AI Strategy', icon: BrainCircuit },
    { id: TabView.INTEGRATIONS, label: 'Integrations', icon: Blocks },
    { id: TabView.SUPPORT, label: 'Support Center', icon: Headphones },
    { id: TabView.SYSTEM_LOGS, label: 'System Logs', icon: Terminal },
    { id: TabView.ADMIN_PANEL, label: 'Admin Panel', icon: ShieldCheck },
    { id: TabView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to logout?')) {
        onLogout(); 
    }
  };

  return (
    <div className="w-64 bg-orbit-900/90 backdrop-blur-xl h-screen flex flex-col border-r border-orbit-700/50 fixed left-0 top-0 z-30 shadow-2xl animate-slide-in-left">
      <div className="p-6 flex items-center justify-between border-b border-orbit-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Rocket className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              <span className="font-bold">OrbitX MCN</span>
              <span className="text-[10px] text-gray-500 block font-medium">Powered by MediaStar</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">CMS Network</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'text-white shadow-lg shadow-orbit-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-orbit-500 to-indigo-600 opacity-100" />
              )}
              <Icon size={20} className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
              <span className="font-medium relative z-10">{item.label}</span>
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full blur-sm" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-orbit-700/50 bg-black/10">
        <button 
          onClick={handleLogoutClick}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;