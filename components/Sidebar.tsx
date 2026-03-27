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
    { id: TabView.AI_TOOLS, label: 'AI Tools', icon: Sparkles },
    { id: TabView.INTEGRATIONS, label: 'Integrations', icon: Blocks },
    { id: TabView.SUPPORT, label: 'Support Center', icon: Headphones },
    { id: TabView.SYSTEM_LOGS, label: 'System Logs', icon: Terminal },
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
    { id: TabView.RESOURCES, label: 'Resources', icon: FolderOpen },
    { id: TabView.SUPPORT, label: 'Support', icon: Headphones },
    { id: TabView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const navItems = userRole === 'creator' ? creatorNavItems : adminNavItems;

  const handleLogoutClick = () => {
    onLogout(); 
  };

  return (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-64 glass-panel h-screen flex flex-col fixed left-0 top-0 z-30 shadow-2xl"
    >
      <div className="p-8 flex flex-col items-center border-b border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-orbit-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 1.2, ease: "anticipate" }}
          className="w-16 h-16 orbit-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-orbit-500/40 mb-4 relative z-10"
        >
          <Rocket className="text-white w-8 h-8" />
        </motion.div>
        
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-black orbit-text-gradient font-display tracking-tighter">
            OrbitX
          </h1>
          <p className="text-[9px] text-surface-500 font-black tracking-[0.3em] uppercase mt-1">
            MediaStar MCN
          </p>
        </div>
        
        <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 text-surface-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-4 px-5 py-3 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                isActive
                  ? 'text-white'
                  : 'text-surface-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 orbit-gradient shadow-xl shadow-orbit-500/20" 
                />
              )}
              <Icon size={18} className={`relative z-10 transition-all duration-500 ${isActive ? 'text-white scale-110' : 'text-surface-600 group-hover:text-white group-hover:scale-110'}`} />
              <span className={`text-xs font-black relative z-10 font-display uppercase tracking-widest transition-all duration-500 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/10">
        <button 
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center space-x-3 px-5 py-4 rounded-2xl text-surface-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-500 group border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black font-display uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;