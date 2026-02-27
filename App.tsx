import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CreatorsView from './components/CreatorsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import AIStrategist from './components/AIStrategist';
import IntegrationsView from './components/IntegrationsView';
import SupportView from './components/SupportView';
import OnboardingModal from './components/OnboardingModal';
import PayoutsView from './components/PayoutsView';
import SystemLogsView from './components/SystemLogsView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import HomePage from './components/HomePage';
import { TabView, AnalyticsData, Creator } from './types';
import { Bell, Search, User, Menu, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('orbitx_token');
  });
  const [showLogin, setShowLogin] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.DASHBOARD);
  
  const [creators, setCreators] = useState<Creator[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creatorsRes, analyticsRes] = await Promise.all([
          fetch('/api/creators'),
          fetch('/api/analytics')
        ]);
        
        if (creatorsRes.ok && analyticsRes.ok) {
          const [creatorsData, analyticsData] = await Promise.all([
            creatorsRes.json(),
            analyticsRes.json()
          ]);
          setCreators(creatorsData);
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error("Error fetching data from API", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
        // Check if user has seen onboarding only after login
        const hasOnboarded = localStorage.getItem('mediastar_has_onboarded');
        if (!hasOnboarded) {
        setShowOnboarding(true);
        }
    }
  }, [isAuthenticated]);

  const handleLogin = (status: boolean) => {
      setIsAuthenticated(status);
      setShowLogin(false);
  };

  const handleLogout = () => {
      localStorage.removeItem('orbitx_token');
      setIsAuthenticated(false);
      setShowOnboarding(false);
      setCurrentTab(TabView.DASHBOARD);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('mediastar_has_onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleAddCreator = async (data?: Partial<Creator>) => {
    const newCreatorData = {
      name: data?.name || 'New Creator',
      channelName: data?.channelName || 'New Channel',
      subscribers: data?.subscribers || 0,
      totalViews: 0,
      videoCount: 0,
      revenue: 0,
      niche: data?.niche || 'General',
      avatarUrl: data?.avatarUrl || `https://picsum.photos/100?random=${Date.now()}`,
      status: 'Pending',
      trend: 'flat',
      linkedChannelHandle: data?.linkedChannelHandle
    };

    try {
      const response = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCreatorData),
      });
      if (response.ok) {
        const savedCreator = await response.json();
        setCreators([savedCreator, ...creators]);
      }
    } catch (error) {
      console.error("Error adding creator to API", error);
    }
  };

  const handleDeleteCreator = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this creator?')) {
      try {
        const response = await fetch(`/api/creators/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCreators(creators.filter(c => c.id !== id));
        }
      } catch (error) {
        console.error("Error deleting creator from API", error);
      }
    }
  };

  const handleUpdateCreator = async (updatedCreator: Creator) => {
    try {
      const response = await fetch(`/api/creators/${updatedCreator.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCreator),
      });
      if (response.ok) {
        setCreators(creators.map(c => c.id === updatedCreator.id ? updatedCreator : c));
      }
    } catch (error) {
      console.error("Error updating creator in API", error);
    }
  };

  const renderContent = () => {
    if (isLoadingData) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="w-12 h-12 border-4 border-orbit-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Syncing with MediaStar MCN Database...</p>
        </div>
      );
    }

    switch (currentTab) {
      case TabView.DASHBOARD:
        return <DashboardView data={analytics} creators={creators} onViewCreators={() => setCurrentTab(TabView.CREATORS)} />;
      case TabView.CREATORS:
        return <CreatorsView creators={creators} onAddCreator={handleAddCreator} onDeleteCreator={handleDeleteCreator} onUpdateCreator={handleUpdateCreator} />;
      case TabView.ANALYTICS:
        return <AnalyticsView data={analytics} />;
      case TabView.PAYOUTS:
        return <PayoutsView />;
      case TabView.SETTINGS:
        return <SettingsView />;
      case TabView.AI_STRATEGIST:
        return <AIStrategist creators={creators} />;
      case TabView.INTEGRATIONS:
        return <IntegrationsView />;
      case TabView.SUPPORT: return <SupportView />;
      case TabView.SYSTEM_LOGS:
        return <SystemLogsView />;
      case TabView.ADMIN_PANEL:
        return <AdminView />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Work in progress... (Minimal App)
          </div>
        );
    }
  };

  if (!isAuthenticated) {
      if (showLogin) {
          return <LoginView onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
      }
      return <HomePage onLoginClick={() => setShowLogin(true)} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-orbit-900 text-white font-sans selection:bg-orbit-500 selection:text-white flex animate-fade-in relative overflow-hidden">
        
        {/* Ambient Background - World Class Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-purple-600/5 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>

        {isSidebarOpen && (
          <Sidebar 
            currentTab={currentTab} 
            onTabChange={(tab) => {
              setCurrentTab(tab);
              if (window.innerWidth <= 1024) setIsSidebarOpen(false);
            }} 
            onLogout={handleLogout} 
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && window.innerWidth <= 1024 && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen && window.innerWidth > 1024 ? 'lg:ml-64' : 'ml-0'} relative z-10 overflow-auto`}>
          {/* Header - Glassmorphism */}
          <header className="h-20 bg-orbit-900/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className={`p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors ${isSidebarOpen && window.innerWidth > 1024 ? 'hidden' : 'block'}`}
              >
                <Menu size={20} />
              </button>
               <h2 className="text-xl sm:text-2xl font-bold text-white capitalize tracking-tight drop-shadow-sm truncate max-w-[150px] sm:max-w-none">
                {currentTab.toLowerCase().replace('_', ' ')}
              </h2>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative hidden md:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orbit-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/20 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-orbit-500 focus:bg-black/40 transition-all w-64 backdrop-blur-sm" 
                />
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-white/5">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-orbit-900 shadow-lg shadow-red-500/50"></span>
              </button>
              
              <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">Network Admin</p>
                  <p className="text-xs text-gray-500">MediaStar MCN HQ</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 p-[2px] relative group cursor-pointer shadow-lg shadow-indigo-500/20">
                   <div className="w-full h-full bg-orbit-900 rounded-full overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded-full backdrop-blur-[1px]" onClick={handleLogout}>
                         <LogOut size={16} className="text-white" />
                   </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-8">
            {renderContent()}
          </div>
        </main>
        
        {/* Onboarding Modal Overlay */}
        {showOnboarding && <OnboardingModal onComplete={handleCompleteOnboarding} />}
      </div>
    </HashRouter>
  );
};

export default App;
