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
import PlaceholderView from './components/PlaceholderView';
import PayoutsView from './components/PayoutsView';
import SystemLogsView from './components/SystemLogsView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import HomePage from './components/HomePage';
import CreatorDashboardView from './components/CreatorDashboardView';
import EarningsView from './components/EarningsView';
import ContentIDView from './components/ContentIDView';
import { TabView, AnalyticsData, Creator, EarningsRecord, PayoutRequest } from './types';
import { Bell, Search, User, Menu, LogOut } from 'lucide-react';
import { auth, db, logOut, handleFirestoreError, OperationType } from './src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'viewer' | 'creator'>('viewer');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.DASHBOARD);
  
  const [creators, setCreators] = useState<Creator[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [earnings, setEarnings] = useState<EarningsRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const handleUncaughtError = (event: ErrorEvent) => {
      if (event.error instanceof Error && (event.error.name === 'AbortError' || event.error.message.toLowerCase().includes('aborted'))) {
        console.warn("Uncaught request aborted:", event.error.message);
        event.preventDefault();
      }
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof Error && (event.reason.name === 'AbortError' || event.reason.message.toLowerCase().includes('aborted'))) {
        console.warn("Unhandled promise rejection (aborted):", event.reason.message);
        event.preventDefault();
      }
    };
    window.addEventListener('error', handleUncaughtError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleUncaughtError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAdmin(user.email === 'hosenmdjakir629@gmail.com');
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // Create user document if it doesn't exist
            const userData: any = {
              uid: user.uid,
              email: user.email,
              role: user.email === 'hosenmdjakir629@gmail.com' ? 'admin' : 'creator'
            };
            if (user.displayName) userData.name = user.displayName;
            if (user.photoURL) userData.photoURL = user.photoURL;
            
            await setDoc(userRef, userData);
            setUserRole(userData.role);
            if (userData.role === 'creator') {
              setCurrentTab(TabView.CREATOR_DASHBOARD);
            }
          } else {
            const role = userSnap.data().role as 'admin' | 'viewer' | 'creator';
            setUserRole(role);
            if (role === 'creator' && currentTab === TabView.DASHBOARD) {
              setCurrentTab(TabView.CREATOR_DASHBOARD);
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      }
      setIsAuthenticated(!!user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);

    const unsubscribeCreators = onSnapshot(collection(db, 'creators'), (snapshot) => {
      const creatorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Creator));
      setCreators(creatorsData);
      setIsLoadingData(false);
    }, (error) => {
      setIsLoadingData(false);
      handleFirestoreError(error, OperationType.LIST, 'creators');
    });

    const unsubscribeAnalytics = onSnapshot(collection(db, 'analytics'), (snapshot) => {
      const analyticsData = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as AnalyticsData));
      setAnalytics(analyticsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'analytics');
    });

    const unsubscribeEarnings = onSnapshot(collection(db, 'earnings'), (snapshot) => {
      const earningsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EarningsRecord));
      setEarnings(earningsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'earnings');
    });

    const unsubscribePayouts = onSnapshot(collection(db, 'payouts'), (snapshot) => {
      const payoutsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayoutRequest));
      setPayouts(payoutsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'payouts');
    });

    return () => {
      unsubscribeCreators();
      unsubscribeAnalytics();
      unsubscribeEarnings();
      unsubscribePayouts();
    };
  }, [isAuthReady, isAuthenticated]);

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

  const [pendingTab, setPendingTab] = useState<TabView | null>(null);

  const handleLogin = (status: boolean) => {
      // Auth state is handled by onAuthStateChanged
      setShowLogin(false);
      if (pendingTab) {
        setCurrentTab(pendingTab);
        setPendingTab(null);
      }
  };

  const handleLogout = async () => {
      try {
        await logOut();
        setShowOnboarding(false);
        setCurrentTab(TabView.DASHBOARD);
        setPendingTab(null);
      } catch (error) {
        if (error instanceof Error && error.message.toLowerCase().includes('aborted')) {
          console.warn("Logout aborted.");
        } else {
          console.error("Logout failed", error);
        }
      }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('mediastar_has_onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleAddCreator = async (data?: Partial<Creator>) => {
    if (!auth.currentUser) return;
    
    const newCreatorData = {
      name: data?.name || 'New Creator',
      channelName: data?.channelName || 'New Channel',
      subscribers: data?.subscribers || 0,
      totalViews: data?.totalViews || 0,
      videoCount: data?.videoCount || 0,
      revenue: 0,
      niche: data?.niche || 'General',
      avatarUrl: data?.avatarUrl || `https://picsum.photos/100?random=${Date.now()}`,
      status: data?.status || 'Pending',
      trend: 'flat',
      subscriberHistory: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000)),
      linkedChannelHandle: data?.linkedChannelHandle || '',
      youtubeChannelId: data?.youtubeChannelId || '',
      isVerified: data?.isVerified || false,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser.uid
    };

    try {
      await addDoc(collection(db, 'creators'), newCreatorData);
      await addDoc(collection(db, 'logs'), {
        timestamp: new Date().toISOString(),
        action: 'CREATOR_ADDED',
        details: `Added creator: ${newCreatorData.name} (${newCreatorData.channelName})`,
        user: auth.currentUser.displayName || 'Admin',
        userId: auth.currentUser.uid
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'creators');
    }
  };

  const handleDeleteCreator = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this creator?')) {
      try {
        const creatorToDelete = creators.find(c => c.id === id);
        await deleteDoc(doc(db, 'creators', id));
        if (creatorToDelete && auth.currentUser) {
          await addDoc(collection(db, 'logs'), {
            timestamp: new Date().toISOString(),
            action: 'CREATOR_DELETED',
            details: `Deleted creator: ${creatorToDelete.name}`,
            user: auth.currentUser.displayName || 'Admin',
            userId: auth.currentUser.uid
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `creators/${id}`);
      }
    }
  };

  const handleUpdateCreator = async (updatedCreator: Creator) => {
    try {
      const { id, ...dataToUpdate } = updatedCreator;
      await updateDoc(doc(db, 'creators', id), dataToUpdate as any);
      if (auth.currentUser) {
        await addDoc(collection(db, 'logs'), {
          timestamp: new Date().toISOString(),
          action: 'CREATOR_UPDATED',
          details: `Updated creator: ${updatedCreator.name}`,
          user: auth.currentUser.displayName || 'Admin',
          userId: auth.currentUser.uid
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `creators/${updatedCreator.id}`);
    }
  };

  const handleAddPayout = async (payout: Omit<PayoutRequest, 'id'>) => {
    try {
      await addDoc(collection(db, 'payouts'), payout);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'payouts');
    }
  };

  const handleUpdatePayout = async (id: string, updates: Partial<PayoutRequest>) => {
    try {
      await updateDoc(doc(db, 'payouts', id), updates);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `payouts/${id}`);
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
        return <CreatorsView isAdmin={isAdmin} creators={creators} onAddCreator={handleAddCreator} onDeleteCreator={handleDeleteCreator} onUpdateCreator={handleUpdateCreator} />;
      case TabView.ANALYTICS:
        return <AnalyticsView data={analytics} />;
      case TabView.PAYOUTS:
        return <PayoutsView isAdmin={isAdmin} payouts={payouts} onAddPayout={handleAddPayout} onUpdatePayout={handleUpdatePayout} availableBalance={earnings.reduce((acc, e) => acc + (e.status === 'Ready' ? e.totalRevenue : 0), 0)} />;
      case TabView.SETTINGS:
        return <SettingsView onNavigate={setCurrentTab} />;
      case TabView.AI_STRATEGIST:
        return <AIStrategist creators={creators} />;
      case TabView.INTEGRATIONS:
        return <IntegrationsView />;
      case TabView.SUPPORT: return <SupportView />;
      case TabView.SYSTEM_LOGS:
        return <SystemLogsView />;
      case TabView.ADMIN_PANEL:
        return userRole === 'admin' ? <AdminView /> : <div className="p-8 text-red-400">Access Denied</div>;
      case TabView.REPORTS:
        return <PlaceholderView title="Performance Reports" />;
      case TabView.MARKETPLACE:
        return <PlaceholderView title="Marketplace" />;
      case TabView.RESOURCES:
        return <PlaceholderView title="Resources" />;
      case TabView.CONTENT_ID:
        return <ContentIDView />;
      case TabView.RECRUITMENT:
        return <PlaceholderView title="Recruitment" />;
      case TabView.AI_TOOLS:
        return <PlaceholderView title="AI Tools" />;
      case TabView.ONBOARDING:
        return <PlaceholderView title="Onboarding Workflow" />;
      case TabView.CALENDAR:
        return <PlaceholderView title="Content Calendar & Planner" />;
      case TabView.LEADERBOARD:
        return <PlaceholderView title="Leaderboard" />;
      case TabView.NOTIFICATIONS:
        return <PlaceholderView title="Notifications" />;
      case TabView.ADVANCED_FINANCIALS:
        return <PlaceholderView title="Advanced Financial Analytics" />;
      case TabView.CRM:
        return <PlaceholderView title="Recruitment CRM" />;
      case TabView.MULTI_PLATFORM:
        return <PlaceholderView title="Multi-Platform Analytics" />;
      case TabView.CHAT:
        return <PlaceholderView title="Admin-Creator Chat" />;
      case TabView.RBAC:
        return <PlaceholderView title="Role-Based Access Control" />;
      case TabView.CREATOR_DASHBOARD:
        return userRole === 'creator' ? <CreatorDashboardView /> : <div className="p-8 text-red-400">Access Denied</div>;
      case TabView.CREATOR_ANALYTICS:
        return userRole === 'creator' ? <PlaceholderView title="Creator Analytics" /> : <div className="p-8 text-red-400">Access Denied</div>;
      case TabView.CREATOR_CONTENT:
        return userRole === 'creator' ? <PlaceholderView title="Content Management" /> : <div className="p-8 text-red-400">Access Denied</div>;
      case TabView.CREATOR_COMMUNITY:
        return userRole === 'creator' ? <PlaceholderView title="Community & Comments" /> : <div className="p-8 text-red-400">Access Denied</div>;
      case TabView.CREATOR_MONETIZATION:
        return userRole === 'creator' ? <EarningsView earnings={earnings} payouts={payouts} onAddPayout={handleAddPayout} availableBalance={earnings.reduce((acc, e) => acc + (e.status === 'Ready' ? e.totalRevenue : 0), 0)} /> : <div className="p-8 text-red-400">Access Denied</div>;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Work in progress... (Minimal App)
          </div>
        );
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-orbit-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orbit-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
      if (showLogin) {
          return <LoginView onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
      }
      return <HomePage 
        onLoginClick={() => setShowLogin(true)} 
        onLogin={(tab) => {
          if (tab) setPendingTab(tab);
          setShowLogin(true);
        }} 
      />;
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
            userRole={userRole}
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
                {currentTab?.toLowerCase().replace('_', ' ') || 'Dashboard'}
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
              
              {isAdmin && (
                <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/10">
                  <button 
                    onClick={() => {
                      setUserRole('admin');
                      setCurrentTab(TabView.DASHBOARD);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${userRole === 'admin' ? 'bg-orbit-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => {
                      setUserRole('creator');
                      setCurrentTab(TabView.CREATOR_DASHBOARD);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${userRole === 'creator' ? 'bg-orbit-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Creator
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{auth.currentUser?.displayName || 'Network Admin'}</p>
                  <p className="text-xs text-gray-500">MediaStar MCN HQ</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 p-[2px] relative group cursor-pointer shadow-lg shadow-indigo-500/20">
                   <div className="w-full h-full bg-orbit-900 rounded-full overflow-hidden">
                      <img src={auth.currentUser?.photoURL || "https://i.pravatar.cc/150?u=admin"} alt="Admin" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
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
