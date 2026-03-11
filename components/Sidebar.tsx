import React from 'react';
import { LayoutDashboard, Users, BarChart3, BrainCircuit, Settings, LogOut, Rocket, Wallet, Blocks, Headphones, X, Terminal, ShieldCheck, FileText, Share2, FolderOpen, AlertTriangle, UserPlus, Sparkles, UserCheck, Calendar, Trophy, BellRing, PieChart, UserSearch, Globe, MessageSquare, Lock, Video, MessageCircle, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TabView } from '../types';

interface SidebarProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
  onLogout: () => void;
  onClose?: () => void;
  userRole: 'admin' | 'viewer' | 'creator';
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, onLogout, onClose, userRole }) => {
  const adminNavItems = [
    { id: TabView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: TabView.CREATORS, label: 'Creators', icon: Users },
    { id: TabView.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: TabView.REPORTS, label: 'Performance Reports', icon: FileText },
    { id: TabView.MARKETPLACE, label: 'Marketplace', icon: Share2 },
    { id: TabView.RESOURCES, label: 'Resources', icon: FolderOpen },
    { id: TabView.CONTENT_ID, label: 'Content ID Claims', icon: AlertTriangle },
    { id: TabView.RECRUITMENT, label: 'Recruitment', icon: UserPlus },
    { id: TabView.PAYOUTS, label: 'Payouts', icon: Wallet },
    { id: TabView.AI_STRATEGIST, label: 'AI Strategy', icon: BrainCircuit },
    { id: TabView.AI_TOOLS, label: 'AI Tools', icon: Sparkles },
    { id: TabView.INTEGRATIONS, label: 'Integrations', icon: Blocks },
    { id: TabView.SUPPORT, label: 'Support Center', icon: Headphones },
    { id: TabView.SYSTEM_LOGS, label: 'System Logs', icon: Terminal },
    { id: TabView.ADMIN_PANEL, label: 'Admin Panel', icon: ShieldCheck },
    { id: TabView.SETTINGS, label: 'Settings', icon: Settings },
    { id: TabView.ONBOARDING, label: 'Onboarding', icon: UserCheck },
    { id: TabView.CALENDAR, label: 'Content Calendar', icon: Calendar },
    { id: TabView.LEADERBOARD, label: 'Leaderboard', icon: Trophy },
    { id: TabView.NOTIFICATIONS, label: 'Notifications', icon: BellRing },
    { id: TabView.ADVANCED_FINANCIALS, label: 'Financial Analytics', icon: PieChart },
    { id: TabView.CRM, label: 'Recruitment CRM', icon: UserSearch },
    { id: TabView.MULTI_PLATFORM, label: 'Multi-Platform', icon: Globe },
    { id: TabView.CHAT, label: 'Admin-Creator Chat', icon: MessageSquare },
    { id: TabView.RBAC, label: 'Access Control', icon: Lock },
    { id: TabView.CREATOR_DASHBOARD, label: 'Creator Dashboard (Preview)', icon: Video },
  ];

  const creatorNavItems = [
    { id: TabView.CREATOR_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: TabView.CREATOR_ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { id: TabView.CREATOR_CONTENT, label: 'Content', icon: Video },
    { id: TabView.CREATOR_COMMUNITY, label: 'Community', icon: MessageCircle },
    {id: TabView.CREATOR_MONETIZATION, label: 'Monetization', icon: DollarSign },
    { id: TabView.PAYOUTS, label: 'Payouts', icon: Wallet },
    { id: TabView.AI_STRATEGIST, label: 'AI Strategist', icon: BrainCircuit },
    { id: TabView.RESOURCES, label: 'Resources', icon: FolderOpen },
    { id: TabView.SUPPORT, label: 'Support', icon: Headphones },
    { id: TabView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const navItems = userRole === 'creator' ? creatorNavItems : adminNavItems;

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to logout?')) {
        onLogout(); 
    }
  };

  return (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-64 bg-orbit-900/90 backdrop-blur-xl h-screen flex flex-col border-r border-orbit-700/50 fixed left-0 top-0 z-30 shadow-2xl"
    >
      <div className="p-6 flex items-center justify-between border-b border-orbit-700/50">
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
          >
            <Rocket className="text-white w-5 h-5" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              <span className="font-bold">OrbitX</span>
              <span className="text-[10px] text-gray-500 block font-medium">Powered by MediaStar</span>
            </h1>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'text-white shadow-lg shadow-orbit-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-orbit-500 to-indigo-600 opacity-100" 
                />
              )}
              <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
              <span className="font-medium text-sm relative z-10">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/40 rounded-l-full blur-[1px]" 
                />
              )}
            </motion.button>
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
    </motion.div>
  );
};

export default Sidebar;