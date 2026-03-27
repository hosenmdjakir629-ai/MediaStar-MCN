import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { TabView, AnalyticsData, Creator, EarningsRecord, PayoutRequest } from './types';
import { Bell, Search, User, Menu, LogOut } from 'lucide-react';
import { auth, db, logOut, handleFirestoreError, OperationType } from './src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, getDocs, getDocFromServer, query, where } from 'firebase/firestore';
import ErrorBoundary from './components/ErrorBoundary';

import { motion, AnimatePresence } from 'motion/react';

const DashboardView = lazy(() => import('./components/DashboardView'));
const CreatorsView = lazy(() => import('./components/CreatorsView'));
const AnalyticsView = lazy(() => import('./components/AnalyticsView'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const IntegrationsView = lazy(() => import('./components/IntegrationsView'));
const SupportView = lazy(() => import('./components/SupportView'));
const OnboardingModal = lazy(() => import('./components/OnboardingModal'));
const PlaceholderView = lazy(() => import('./components/PlaceholderView'));
const PayoutsView = lazy(() => import('./components/PayoutsView'));
const SystemLogsView = lazy(() => import('./components/SystemLogsView'));
const LoginView = lazy(() => import('./components/LoginView'));
const HomePage = lazy(() => import('./components/HomePage'));
const CreatorDashboardView = lazy(() => import('./components/CreatorDashboardView'));
const EarningsView = lazy(() => import('./components/EarningsView'));
const ContentIDView = lazy(() => import('./components/ContentIDView'));
const PaymentPage = lazy(() => import('./components/PaymentPage'));

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'viewer' | 'creator'>('viewer');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.DASHBOARD);
  
  const [creators, setCreators] = useState<Creator[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [earnings, setEarnings] = useState<EarningsRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const handleUncaughtError = (event: ErrorEvent) => {
      const err = event.error;
      if (err && (err.name === 'AbortError' || err.message?.toLowerCase().includes('aborted') || err.message?.includes('The user aborted a request'))) {
        console.debug("Uncaught request aborted:", err.message);
        event.preventDefault();
      }
    };
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason && (reason.name === 'AbortError' || reason.message?.toLowerCase().includes('aborted') || reason.message?.includes('The user aborted a request'))) {
        console.debug("Unhandled promise rejection (aborted):", reason.message);
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
    const testConnection = async () => {
      try {
        console.log("Testing Firestore connection...");
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firestore connection test successful.");
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Firestore connection failed: the client is offline. Please check your Firebase configuration.");
        }
        // Other errors are expected if the document doesn't exist, which is fine for a connection test.
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    console.log("Auth state listener starting...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed. User:", user?.uid, "Email:", user?.email);
      if (user) {
        setIsAdmin(user.email === 'support.orbitxmcn.digital@gmail.com');
        try {
          const userRef = doc(db, 'users', user.uid);
          console.log("Fetching user document:", userRef.path);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            console.log("User document does not exist. Creating...");
            const userData: any = {
              uid: user.uid,
              email: user.email,
              role: user.email === 'support.orbitxmcn.digital@gmail.com' ? 'admin' : 'creator',
              createdAt: new Date().toISOString()
            };
            if (user.displayName) userData.name = user.displayName;
            if (user.photoURL) userData.photoURL = user.photoURL;
            
            await setDoc(userRef, userData);
            setUserRole(userData.role);
            if (userData.role === 'creator') {
              setCurrentTab(TabView.CREATOR_DASHBOARD);
            }
            console.log("User document created.");
          } else {
            const data = userSnap.data();
            console.log("User document exists:", data);
            const role = data.role as 'admin' | 'viewer' | 'creator';
            setUserRole(role);
            if (role === 'creator' && currentTab === TabView.DASHBOARD) {
              setCurrentTab(TabView.CREATOR_DASHBOARD);
            }
          }
        } catch (error) {
          console.error("Error in auth state listener:", error);
          // Don't re-throw here to avoid crashing the app, but log it.
          // handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      }
      setIsAuthenticated(!!user);
      setIsAuthReady(true);
      console.log("Auth ready. Authenticated:", !!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);

    const creatorsRef = collection(db, 'creators');
    const creatorsQuery = isAdmin ? creatorsRef : query(creatorsRef, where('uid', '==', auth.currentUser?.uid));

    const unsubscribeCreators = onSnapshot(creatorsQuery, (snapshot) => {
      const creatorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Creator));
      setCreators(creatorsData);
      setIsLoadingData(false);
    }, (error) => {
      setIsLoadingData(false);
      handleFirestoreError(error, OperationType.LIST, 'creators');
    });

    const analyticsRef = collection(db, 'analytics');
    const unsubscribeAnalytics = onSnapshot(analyticsRef, (snapshot) => {
      const analyticsData = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as AnalyticsData));
      setAnalytics(analyticsData);
    }, (error) => {
      // Analytics might be admin-only, handle gracefully
      if (isAdmin) handleFirestoreError(error, OperationType.LIST, 'analytics');
    });

    const earningsRef = collection(db, 'earnings');
    const earningsQuery = isAdmin ? earningsRef : query(earningsRef, where('creatorId', '==', auth.currentUser?.uid));
    const unsubscribeEarnings = onSnapshot(earningsQuery, (snapshot) => {
      const earningsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EarningsRecord));
      setEarnings(earningsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'earnings');
    });

    const payoutsRef = collection(db, 'payouts');
    const payoutsQuery = isAdmin ? payoutsRef : query(payoutsRef, where('creatorId', '==', auth.currentUser?.uid));
    const unsubscribePayouts = onSnapshot(payoutsQuery, (snapshot) => {
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
      } catch (error: any) {
        if (error && (error.name === 'AbortError' || error.message?.toLowerCase().includes('aborted') || error.message?.includes('The user aborted a request'))) {
          console.debug("Logout aborted.");
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
        return <SettingsView onNavigate={setCurrentTab} userRole={userRole} creators={creators} onUpdateCreator={handleUpdateCreator} />;
      case TabView.INTEGRATIONS:
        return <IntegrationsView />;
      case TabView.SUPPORT: return <SupportView />;
      case TabView.SYSTEM_LOGS:
        return <SystemLogsView />;
      case TabView.REPORTS:
        return <PlaceholderView title="Performance Reports" />;
      case TabView.MARKETPLACE:
        return <PlaceholderView title="Marketplace" />;
      case TabView.RESOURCES:
        return <PlaceholderView title="Resources" />;
      case TabView.CONTENT_ID:
        return <ContentIDView />;
      case TabView.PAYMENT:
        return <PaymentPage />;
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
        return userRole === 'creator' ? <CreatorDashboardView creators={creators} analytics={analytics} earnings={earnings} payouts={payouts} /> : <div className="p-8 text-red-400">Access Denied</div>;
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

  const renderMainContent = () => {
    if (!isAuthenticated) {
      if (showLogin) {
        return (
          <Suspense fallback={<div className="min-h-screen bg-orbit-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orbit-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <LoginView onLogin={handleLogin} onBack={() => setShowLogin(false)} />
          </Suspense>
        );
      }
      if (showPaymentPage) {
        return (
          <Suspense fallback={<div className="min-h-screen bg-orbit-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orbit-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <PaymentPage />
          </Suspense>
        );
      }
      return (
        <Suspense fallback={<div className="min-h-screen bg-orbit-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orbit-500 border-t-transparent rounded-full animate-spin"></div></div>}>
          <HomePage 
            onLoginClick={() => setShowLogin(true)} 
            onLogin={(tab) => {
              if (tab) setPendingTab(tab);
              setShowLogin(true);
            }} 
            onGetStarted={() => setShowPaymentPage(true)}
          />
        </Suspense>
      );
    }

    return (
      <HashRouter>
        <div className="min-h-screen bg-surface-950 text-white font-sans selection:bg-orbit-500 selection:text-white flex animate-fade-in relative overflow-hidden">
          
          {/* Ambient Background - World Class Glows */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-orbit-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-fuchsia-600/5 rounded-full blur-[100px] mix-blend-screen"></div>
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
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'} relative z-10 overflow-auto custom-scrollbar`}>
            {/* Header - Glassmorphism */}
            <header className="h-20 bg-surface-950/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                  className={`p-2 text-surface-400 hover:text-white bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all ${isSidebarOpen ? 'lg:hidden' : 'block'}`}
                >
                  <Menu size={20} />
                </button>
                 <h2 className="text-xl sm:text-2xl font-bold text-white capitalize tracking-tight drop-shadow-sm truncate max-w-[150px] sm:max-w-none font-display">
                  {currentTab?.toLowerCase().replace('_', ' ') || 'Dashboard'}
                </h2>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="relative hidden md:block group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-orbit-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Global search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-surface-300 focus:outline-none focus:border-orbit-500 focus:bg-black/40 transition-all w-64 backdrop-blur-sm font-display" 
                  />
                </div>
                
                <button className="relative p-2 text-surface-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/5">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-orbit-500 rounded-full border-2 border-surface-950 shadow-lg shadow-orbit-500/50"></span>
                </button>
                
                {isAdmin && (
                  <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/10 backdrop-blur-md">
                    <button 
                      onClick={() => {
                        setUserRole('admin');
                        setCurrentTab(TabView.DASHBOARD);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${userRole === 'admin' ? 'bg-orbit-500 text-white shadow-lg shadow-orbit-500/20' : 'text-surface-400 hover:text-white'}`}
                    >
                      Admin
                    </button>
                    <button 
                      onClick={() => {
                        setUserRole('creator');
                        setCurrentTab(TabView.CREATOR_DASHBOARD);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${userRole === 'creator' ? 'bg-orbit-500 text-white shadow-lg shadow-orbit-500/20' : 'text-surface-400 hover:text-white'}`}
                    >
                      Creator
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white font-display">{auth.currentUser?.displayName || 'Network Admin'}</p>
                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">MediaStar MCN HQ</p>
                  </div>
                  <div className="w-10 h-10 rounded-full orbit-gradient p-[2px] relative group cursor-pointer shadow-lg shadow-orbit-500/20">
                     <div className="w-full h-full bg-surface-950 rounded-full overflow-hidden">
                        <img src={auth.currentUser?.photoURL || "https://i.pravatar.cc/150?u=admin"} alt="Admin" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                     </div>
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity" onClick={handleLogout}>
                           <LogOut size={16} className="text-white" />
                     </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-4 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Suspense fallback={
                    <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
                      <div className="w-10 h-10 border-4 border-orbit-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-500 text-sm">Loading view...</p>
                    </div>
                  }>
                    {renderContent()}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
          
          {/* Onboarding Modal Overlay */}
          {showOnboarding && <OnboardingModal onComplete={handleCompleteOnboarding} />}
        </div>
      </HashRouter>
    );
  };

  return (
    <ErrorBoundary>
      {renderMainContent()}
    </ErrorBoundary>
  );
};

export default App;
