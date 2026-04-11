import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Activity, 
  FileText, 
  Bell,
  Wrench,
  Video,
  Music,
  Mic,
  Hexagon,
  Megaphone,
  Calendar,
  Sparkles,
  DollarSign,
  MailPlus,
  CheckCircle2,
  Copyright,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  X,
  LogIn,
  LogOut,
  Mail
} from 'lucide-react';
import { auth, db, googleProvider, signInWithPopup, signOut, sendEmailVerification } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Creators state
  const [creators, setCreators] = useState<any[]>([]);
  const [isCreatorsLoading, setIsCreatorsLoading] = useState(false);
  const [editingCreator, setEditingCreator] = useState<any>(null);
  const [isUpdatingCreator, setIsUpdatingCreator] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<any[]>([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [reviewingApplication, setReviewingApplication] = useState<any>(null);
  const [isUpdatingApplication, setIsUpdatingApplication] = useState(false);

  // Earnings state
  const [earnings, setEarnings] = useState<any[]>([]);
  const [isEarningsLoading, setIsEarningsLoading] = useState(false);
  const [earningsFilters, setEarningsFilters] = useState({ month: '', creatorId: '' });
  
  // Invite form state
  const [inviteForm, setInviteForm] = useState({ channelName: '', email: '', message: '' });
  const [isInviting, setIsInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Manual Claim Modal State
  const [showManualClaimModal, setShowManualClaimModal] = useState(false);
  const [manualClaimForm, setManualClaimForm] = useState({ videoUrl: '', claimant: '', matchType: 'visual', description: '' });

  // Selected Claim State
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [claimDetailsTab, setClaimDetailsTab] = useState<'overview' | 'history'>('overview');
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, actionType: 'release' | 'reinstate' | null}>({isOpen: false, actionType: null});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          // Create user profile if it doesn't exist
          const newProfile = {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: currentUser.email === 'hosenmdjakir629@gmail.com' ? 'admin' : 'creator',
            createdAt: serverTimestamp()
          };
          await setDoc(doc(db, 'users', currentUser.uid), newProfile);
          setUserProfile(newProfile);
          
          // Send verification email for new accounts
          if (!currentUser.emailVerified) {
            sendEmailVerification(currentUser).catch(err => console.error("Error sending verification email:", err));
          }
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && (user.emailVerified || userProfile?.role !== 'admin')) {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (user && activeTab === 'creators') {
      setIsCreatorsLoading(true);
      const q = query(collection(db, 'creators'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const creatorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCreators(creatorsData);
        setIsCreatorsLoading(false);
      }, (error) => {
        console.error("Error fetching creators:", error);
        setIsCreatorsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && activeTab === 'applications') {
      setIsApplicationsLoading(true);
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const appsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setApplications(appsData);
        setIsApplicationsLoading(false);
      }, (error) => {
        console.error("Error fetching applications:", error);
        setIsApplicationsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && activeTab === 'earnings') {
      setIsEarningsLoading(true);
      const q = query(collection(db, 'earnings'), orderBy('month', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const earningsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEarnings(earningsData);
        setIsEarningsLoading(false);
      }, (error) => {
        console.error("Error fetching earnings:", error);
        setIsEarningsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  const platformTools = [
    { id: 'video-distribution', title: 'Video Distribution', description: 'Distribute your videos across YouTube and Facebook', icon: Video, badge: null, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'audio-distribution', title: 'Audio Distribution', description: 'Share your music on 40+ platforms', icon: Music, badge: '+35', color: 'text-sky-500', bg: 'bg-sky-50' },
    { id: 'podcast-distribution', title: 'Podcast Distribution', description: 'Publish your podcasts to all major platforms', icon: Mic, badge: '+20', color: 'text-violet-500', bg: 'bg-violet-50' },
    { id: 'royalty-nft', title: 'Royalty NFT', description: 'Create and manage royalty NFTs for your content', icon: Hexagon, badge: null, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'brand-campaigns', title: 'Brand Campaigns', description: 'Apply for and manage your partnership campaigns', icon: Megaphone, badge: null, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'campaign-calendar', title: 'Campaign Calendar', description: 'Schedule and manage your campaign deliverables', icon: Calendar, badge: null, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'ai-tools', title: 'AI Tools', description: 'Enhance your content with AI-powered tools', icon: Sparkles, badge: null, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'finance-management', title: 'Finance Management', description: 'Track earnings and payments', icon: DollarSign, badge: null, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const initialClaims = [
    { id: 'v_98x2mP1', title: 'Top 10 Tech Gadgets 2026', claimant: 'TechReviews Daily', matchType: 'Visual match (0:45 - 1:12)', status: 'Active', date: 'Apr 08, 2026', deadline: 'Apr 15, 2026', notes: 'Automated visual match detected by Content ID system. Awaiting claimant review.', statusColor: 'bg-emerald-100 text-emerald-700', history: [
      { id: 2, date: 'Apr 08, 2026 11:15 AM', action: 'Notification sent to uploader', user: 'System' },
      { id: 1, date: 'Apr 08, 2026 10:30 AM', action: 'Claim automatically generated by Content ID', user: 'System' }
    ] },
    { id: 'v_45k9Lq2', title: 'My Setup Tour', claimant: 'GamerZone', matchType: 'Audio match (2:10 - 2:40)', status: 'Disputed', date: 'Apr 05, 2026', deadline: 'Apr 12, 2026', notes: 'Uploader disputes the claim citing fair use. Review required within 30 days.', statusColor: 'bg-amber-100 text-amber-700', history: [
      { id: 2, date: 'Apr 07, 2026 02:45 PM', action: 'Uploader filed a dispute (Reason: Fair Use)', user: 'GamerZone' },
      { id: 1, date: 'Apr 05, 2026 09:00 AM', action: 'Claim automatically generated by Content ID', user: 'System' }
    ] },
    { id: 'v_72m4Np8', title: 'Vlog #45: Trip to Bali', claimant: 'TravelWithMe', matchType: 'Melody match (0:15 - 0:30)', status: 'Released', date: 'Apr 01, 2026', deadline: null, notes: 'Claim released manually by claimant after reviewing the context.', statusColor: 'bg-slate-100 text-slate-700', history: [
      { id: 2, date: 'Apr 03, 2026 11:30 AM', action: 'Claim manually released', user: 'Admin (AD)' },
      { id: 1, date: 'Apr 01, 2026 04:20 PM', action: 'Claim automatically generated by Content ID', user: 'System' }
    ] },
  ];
  const [claims, setClaims] = useState(initialClaims);
  
  const isDeadlineClose = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date('2026-04-11'); // Using current context date
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteStatus(null);
    
    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteForm),
      });
      
      if (!response.ok) throw new Error('Failed to send invite');
      
      setInviteStatus({ type: 'success', message: 'Invite sent successfully!' });
      setInviteForm({ channelName: '', email: '', message: '' });
    } catch (error) {
      setInviteStatus({ type: 'error', message: 'Failed to send invite. Please try again.' });
    } finally {
      setIsInviting(false);
    }
  };

  const handleManualClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log("Submitting manual claim:", manualClaimForm);
    alert("Manual claim submitted successfully!");
    setShowManualClaimModal(false);
    setManualClaimForm({ videoUrl: '', claimant: '', matchType: 'visual', description: '' });
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleResendVerification = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        alert("Verification email sent! Please check your inbox.");
      } catch (error) {
        console.error("Error sending verification email:", error);
        alert("Failed to send verification email. Please try again later.");
      }
    }
  };

  const handleUpdateCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCreator) return;
    
    setIsUpdatingCreator(true);
    try {
      const creatorRef = doc(db, 'creators', editingCreator.id);
      await updateDoc(creatorRef, {
        name: editingCreator.name,
        channelName: editingCreator.channelName,
        subscribers: Number(editingCreator.subscribers),
        status: editingCreator.status,
        niche: editingCreator.niche,
        revenue: Number(editingCreator.revenue),
        updatedAt: serverTimestamp()
      });
      setEditingCreator(null);
      alert("Creator profile updated successfully!");
    } catch (error) {
      console.error("Error updating creator:", error);
      alert("Failed to update creator profile.");
    } finally {
      setIsUpdatingCreator(false);
    }
  };

  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApplication) return;
    
    setIsUpdatingApplication(true);
    try {
      const appRef = doc(db, 'applications', reviewingApplication.id);
      await updateDoc(appRef, {
        status: reviewingApplication.status,
        adminNotes: reviewingApplication.adminNotes || '',
        reviewedAt: serverTimestamp(),
        reviewedBy: user?.uid
      });
      setReviewingApplication(null);
      alert("Application updated successfully!");
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application.");
    } finally {
      setIsUpdatingApplication(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading OrbitX Admin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-6">
            O
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">OrbitX Admin</h1>
          <p className="text-slate-600 mb-8">Sign in to manage your MCN dashboard and creators.</p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Verification Banner */}
      {user && !user.emailVerified && userProfile?.role === 'admin' && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <Mail className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-amber-800">
              Your email is not verified. Please verify your email to access administrative features.
            </p>
          </div>
          <button 
            onClick={handleResendVerification}
            className="text-sm font-bold text-amber-700 hover:text-amber-900 underline underline-offset-4"
          >
            Resend verification email
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              O
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">OrbitX Admin</h1>
          </div>
        <nav className="mt-6 flex flex-col gap-1 px-4 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('creators')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'creators' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Creators
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'applications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Applications
          </button>
          <button 
            onClick={() => setActiveTab('invites')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'invites' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <MailPlus className="w-5 h-5 mr-3" />
            Channel Invites
          </button>
          <button 
            onClick={() => setActiveTab('tools')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'tools' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Wrench className="w-5 h-5 mr-3" />
            Platform Tools
          </button>
          <button 
            onClick={() => setActiveTab('copyright')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'copyright' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Copyright className="w-5 h-5 mr-3" />
            Copyright Tools
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'earnings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <DollarSign className="w-5 h-5 mr-3" />
            Earnings
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'logs' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Activity className="w-5 h-5 mr-3" />
            System Logs
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img 
              src={user.photoURL || "https://picsum.photos/seed/admin/100/100"} 
              alt="Admin" 
              className="w-10 h-10 rounded-full border-2 border-slate-100"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user.displayName || 'Admin User'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <h2 className="text-xl font-semibold text-slate-800 capitalize tracking-tight">
            {activeTab === 'tools' ? 'Platform Tools' : activeTab.replace(/-/g, ' ')}
          </h2>
          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full flex items-center justify-center text-white font-medium shadow-sm cursor-pointer hover:shadow-md transition-shadow text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-auto">
          {user && !user.emailVerified && userProfile?.role === 'admin' ? (
            <div className="max-w-2xl mx-auto mt-12 text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Verification Required</h2>
              <p className="text-lg text-slate-600 mb-8">
                To protect our creators and system integrity, all admin accounts must have a verified email address. 
                Please check your inbox for a verification link.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleResendVerification}
                  className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md"
                >
                  Resend Verification Email
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-white border border-slate-200 text-slate-700 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  I've Verified My Email
                </button>
              </div>
              <p className="mt-8 text-sm text-slate-500">
                Can't find the email? Check your spam folder or try resending it.
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Creators</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stats?.totalCreators || '...'}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Applications</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stats?.activeApplications || '...'}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">${stats?.totalRevenue?.toLocaleString() || '...'}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">System Status</h3>
                  <div className="flex items-center mt-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats?.systemStatus || '...'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="text-base font-semibold text-slate-800">Recent Activity</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform duration-300">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Copyright claim deadline approaching</p>
                        <p className="text-xs text-slate-500 mt-0.5">Claim ID: v_45k9Lq2 • Due in 2 days</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">Just now</span>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">New creator application received</p>
                        <p className="text-xs text-slate-500 mt-0.5">Channel: TechReviews Daily</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">2 mins ago</span>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Payout processed</p>
                        <p className="text-xs text-slate-500 mt-0.5">Amount: $4,500 to John Vlogs</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">1 hour ago</span>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform duration-300">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">System update completed</p>
                        <p className="text-xs text-slate-500 mt-0.5">Version 2.4.1 deployed successfully</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">3 hours ago</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {platformTools.map((tool, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveTab(tool.id)}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${tool.bg} ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invites' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Send Channel Invite</h3>
                  <p className="text-slate-500 text-sm mt-1">Invite a new creator to join the OrbitX MCN network.</p>
                </div>
                
                <div className="p-8">
                  {inviteStatus && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center ${inviteStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                      {inviteStatus.type === 'success' && <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500" />}
                      <p className="font-medium">{inviteStatus.message}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleInviteSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="channelName" className="block text-sm font-medium text-slate-700 mb-2">
                          Channel Name
                        </label>
                        <input
                          type="text"
                          id="channelName"
                          required
                          value={inviteForm.channelName}
                          onChange={(e) => setInviteForm({...inviteForm, channelName: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                          placeholder="e.g. TechReviews Daily"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                          placeholder="creator@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                        Custom Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={inviteForm.message}
                        onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                        placeholder="Add a personal note to the invitation email..."
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={isInviting}
                        className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isInviting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Sending Invite...
                          </>
                        ) : (
                          <>
                            <MailPlus className="w-5 h-5 mr-2" />
                            Send Invitation
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Copyright Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage Content ID claims, disputes, and channel whitelists.</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center shadow-sm">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Whitelist Channel
                  </button>
                  <button 
                    onClick={() => setShowManualClaimModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                  >
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Manual Claim
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Claims</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">1,284</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Resolved Claims</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">8,432</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Whitelisted</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">450</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Disputes</h3>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">23</p>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base font-semibold text-slate-800">Recent Content ID Matches</h3>
                  <div className="flex gap-2">
                    <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Disputed</option>
                      <option>Released</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Video Title</th>
                        <th className="px-6 py-4 font-semibold">Claimant (Creator)</th>
                        <th className="px-6 py-4 font-semibold">Matched Content</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {claims.map((claim) => (
                        <tr 
                          key={claim.id} 
                          onClick={() => {
                            setSelectedClaim(claim);
                            setClaimDetailsTab('overview');
                          }}
                          className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-slate-900">{claim.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-slate-500 font-mono">ID: {claim.id}</p>
                                {isDeadlineClose(claim.deadline) && (
                                  <span className="flex items-center text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 uppercase tracking-wider">
                                    <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                                    Urgent
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">{claim.claimant}</td>
                          <td className="px-6 py-4 text-sm text-slate-700">{claim.matchType}</td>
                          <td className="px-6 py-4">
                            <span className={`${claim.statusColor} text-xs font-semibold px-2.5 py-1 rounded-full border border-current/10`}>{claim.status}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{claim.date}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              className="text-indigo-600 group-hover:text-indigo-700 text-sm font-semibold transition-colors"
                            >
                              {claim.status === 'Released' ? 'View' : 'Review'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Claim Details Component */}
              {selectedClaim && (
                <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden mt-6">
                  <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-indigo-900 tracking-tight">Claim Details: {selectedClaim.id}</h3>
                    <button 
                      onClick={() => setSelectedClaim(null)}
                      className="text-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-0">
                    {/* Tabs */}
                    <div className="border-b border-slate-200 px-6 flex gap-6 bg-white">
                      <button 
                        onClick={() => setClaimDetailsTab('overview')}
                        className={`py-3 font-medium text-sm border-b-2 transition-colors ${claimDetailsTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                        Overview
                      </button>
                      <button 
                        onClick={() => setClaimDetailsTab('history')}
                        className={`py-3 font-medium text-sm border-b-2 transition-colors ${claimDetailsTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                        History
                      </button>
                    </div>

                    <div className="p-6">
                      {claimDetailsTab === 'overview' ? (
                        <>
                          {isDeadlineClose(selectedClaim.deadline) && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-red-900">Action Required: Approaching Deadline</p>
                                <p className="text-sm text-red-700 mt-1">
                                  This claim must be reviewed by <span className="font-bold">{selectedClaim.deadline}</span> to avoid automatic resolution.
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <p className="text-sm font-medium text-slate-500 mb-1">Video Title</p>
                              <p className="text-base font-semibold text-slate-900">{selectedClaim.title}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500 mb-1">Claimant</p>
                              <p className="text-base font-semibold text-slate-900">{selectedClaim.claimant}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500 mb-1">Matched Content</p>
                              <p className="text-base font-semibold text-slate-900">{selectedClaim.matchType}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500 mb-1">Date</p>
                              <p className="text-base font-semibold text-slate-900">{selectedClaim.date}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
                              <span className={`${selectedClaim.statusColor} text-xs font-semibold px-2.5 py-1 rounded-full inline-block mt-1`}>
                                {selectedClaim.status}
                              </span>
                            </div>
                            {selectedClaim.deadline && (
                              <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Review Deadline</p>
                                <p className={`text-base font-semibold ${isDeadlineClose(selectedClaim.deadline) ? 'text-red-600' : 'text-slate-900'}`}>
                                  {selectedClaim.deadline}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
                            <p className="text-sm font-semibold text-slate-800 mb-2">Notes & Context</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{selectedClaim.notes}</p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6 mb-6 pl-2 border-l-2 border-slate-100 ml-2">
                          {selectedClaim.history?.map((event: any) => (
                            <div key={event.id} className="relative pl-6">
                              <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-indigo-400 border-4 border-white"></div>
                              <p className="text-sm font-semibold text-slate-900">{event.action}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{event.date} • by {event.user}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setSelectedClaim(null)}
                        className="px-4 py-2 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Close Details
                      </button>
                      {selectedClaim.status === 'Disputed' && (
                        <>
                          <button 
                            onClick={() => setConfirmModal({isOpen: true, actionType: 'release'})}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                          >
                            Release Claim
                          </button>
                          <button 
                            onClick={() => setConfirmModal({isOpen: true, actionType: 'reinstate'})}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                          >
                            Reinstate Claim
                          </button>
                        </>
                      )}
                      {selectedClaim.status === 'Active' && (
                        <button 
                          onClick={() => setConfirmModal({isOpen: true, actionType: 'release'})}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                        >
                          Release Claim
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          )}

          {activeTab === 'creators' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Creators Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage and edit creator profiles and channel information.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Creator</th>
                        <th className="px-6 py-4 font-semibold">Channel</th>
                        <th className="px-6 py-4 font-semibold">Subscribers</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Niche</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isCreatorsLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-500">Loading creators...</p>
                            </div>
                          </td>
                        </tr>
                      ) : creators.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No creators found.
                          </td>
                        </tr>
                      ) : (
                        creators.map((creator) => (
                          <tr key={creator.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={creator.avatarUrl || `https://picsum.photos/seed/${creator.id}/40/40`} 
                                  alt={creator.name} 
                                  className="w-10 h-10 rounded-full border border-slate-200"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{creator.name}</p>
                                  <p className="text-xs text-slate-500">{creator.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <p className="text-sm text-slate-700 font-medium">{creator.channelName || 'N/A'}</p>
                                <p className="text-xs text-slate-400 truncate max-w-[150px]">{creator.channel || 'No link'}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              {creator.subscribers?.toLocaleString() || creator.subs || '0'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-current/10 ${
                                creator.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                creator.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {creator.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{creator.niche || 'General'}</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setEditingCreator(creator)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors"
                              >
                                Edit Profile
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Creator Applications</h3>
                  <p className="text-slate-500 text-sm mt-1">Review and manage new creator applications for the network.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Applicant</th>
                        <th className="px-6 py-4 font-semibold">Channel</th>
                        <th className="px-6 py-4 font-semibold">Subscribers</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Submitted</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isApplicationsLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-500">Loading applications...</p>
                            </div>
                          </td>
                        </tr>
                      ) : applications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No applications found.
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{app.name}</p>
                                <p className="text-xs text-slate-500">{app.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <p className="text-sm text-slate-700 font-medium">{app.channelName}</p>
                                <p className="text-xs text-slate-400 truncate max-w-[150px]">{app.channelUrl || 'No link'}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              {app.subscribers?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-current/10 ${
                                app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                app.status === 'More Info Needed' ? 'bg-amber-100 text-amber-700' : 
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setReviewingApplication(app)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Earnings Reports</h3>
                  <p className="text-slate-500 text-sm mt-1">Monitor monthly ad revenue and brand deal earnings for all creators.</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Ad Revenue</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                    ${earnings.reduce((acc, curr) => acc + (curr.adRevenue || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Brand Deals</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                    ${earnings.reduce((acc, curr) => acc + (curr.brandDealRevenue || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 bg-indigo-50/30">
                  <h3 className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">Gross Earnings</h3>
                  <p className="text-3xl font-bold text-indigo-900 mt-2 tracking-tight">
                    ${earnings.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <select 
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                    value={earningsFilters.month}
                    onChange={(e) => setEarningsFilters({...earningsFilters, month: e.target.value})}
                  >
                    <option value="">All Months</option>
                    {Array.from(new Set(earnings.map(e => e.month))).sort().reverse().map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <select 
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                    value={earningsFilters.creatorId}
                    onChange={(e) => setEarningsFilters({...earningsFilters, creatorId: e.target.value})}
                  >
                    <option value="">All Creators</option>
                    {creators.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Earnings Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Creator</th>
                        <th className="px-6 py-4 font-semibold">Month</th>
                        <th className="px-6 py-4 font-semibold">Ad Revenue</th>
                        <th className="px-6 py-4 font-semibold">Brand Deals</th>
                        <th className="px-6 py-4 font-semibold">Total</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isEarningsLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-500">Loading earnings...</p>
                            </div>
                          </td>
                        </tr>
                      ) : earnings.filter(e => 
                        (!earningsFilters.month || e.month === earningsFilters.month) &&
                        (!earningsFilters.creatorId || e.creatorId === earningsFilters.creatorId)
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No earnings records found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        earnings.filter(e => 
                          (!earningsFilters.month || e.month === earningsFilters.month) &&
                          (!earningsFilters.creatorId || e.creatorId === earningsFilters.creatorId)
                        ).map((record) => {
                          const creator = creators.find(c => c.id === record.creatorId);
                          return (
                            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                    {creator?.name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{creator?.name || 'Unknown Creator'}</p>
                                    <p className="text-xs text-slate-500">{creator?.channelName || 'N/A'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-700 font-medium">{record.month}</td>
                              <td className="px-6 py-4 text-sm text-slate-700">${record.adRevenue?.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-slate-700">${record.brandDealRevenue?.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-900">${record.totalRevenue?.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  record.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  record.status === 'Ready' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                  'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'tools' && activeTab !== 'invites' && activeTab !== 'copyright' && activeTab !== 'creators' && activeTab !== 'applications' && activeTab !== 'earnings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 capitalize tracking-tight">{activeTab.replace(/-/g, ' ')} Module</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                This section is currently under development. Check back later for updates to the {activeTab.replace(/-/g, ' ')} management interface.
              </p>
              {platformTools.some(t => t.id === activeTab) && (
                <button 
                  onClick={() => setActiveTab('tools')}
                  className="px-6 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                >
                  Back to Platform Tools
                </button>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </main>

      {/* Manual Claim Modal */}
      {showManualClaimModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Submit Manual Claim</h3>
              <button onClick={() => setShowManualClaimModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleManualClaimSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Infringing Video URL</label>
                <input 
                  required 
                  type="url" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                  placeholder="https://youtube.com/watch?v=..." 
                  value={manualClaimForm.videoUrl} 
                  onChange={e => setManualClaimForm({...manualClaimForm, videoUrl: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Claimant (Your Creator)</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                  placeholder="Creator Name" 
                  value={manualClaimForm.claimant} 
                  onChange={e => setManualClaimForm({...manualClaimForm, claimant: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Match Type</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                  value={manualClaimForm.matchType} 
                  onChange={e => setManualClaimForm({...manualClaimForm, matchType: e.target.value})}
                >
                  <option value="visual">Visual Match</option>
                  <option value="audio">Audio Match</option>
                  <option value="melody">Melody Match</option>
                  <option value="full">Full Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description / Timestamps</label>
                <textarea 
                  required 
                  rows={3} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none" 
                  placeholder="e.g., 1:20 - 2:30 uses our copyrighted music" 
                  value={manualClaimForm.description} 
                  onChange={e => setManualClaimForm({...manualClaimForm, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowManualClaimModal(false)} 
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Confirm Action</h3>
              <button onClick={() => setConfirmModal({isOpen: false, actionType: null})} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 mr-3 shrink-0" />
                <p className="text-slate-800 font-medium">
                  Are you sure you want to {confirmModal.actionType} this claim?
                </p>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                {confirmModal.actionType === 'release' 
                  ? "Releasing a claim will remove any monetization restrictions on the user's video. This action cannot be easily undone."
                  : "Reinstating a claim will re-apply monetization restrictions. Make sure you have reviewed the dispute carefully."}
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setConfirmModal({isOpen: false, actionType: null})} 
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (selectedClaim) {
                      const updatedClaims = claims.map(c => {
                        if (c.id === selectedClaim.id) {
                          const newStatus = confirmModal.actionType === 'release' ? 'Released' : 'Active';
                          const newColor = confirmModal.actionType === 'release' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700';
                          
                          const newHistoryEvent = {
                            id: Date.now(),
                            date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
                            action: confirmModal.actionType === 'release' ? 'Claim manually released' : 'Claim manually reinstated',
                            user: 'Admin (AD)'
                          };

                          const updated = { 
                            ...c, 
                            status: newStatus, 
                            statusColor: newColor,
                            history: [newHistoryEvent, ...(c.history || [])]
                          };
                          setSelectedClaim(updated);
                          return updated;
                        }
                        return c;
                      });
                      setClaims(updatedClaims);
                    }
                    setConfirmModal({isOpen: false, actionType: null});
                  }} 
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ${confirmModal.actionType === 'release' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  Confirm {confirmModal.actionType === 'release' ? 'Release' : 'Reinstate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Application Modal */}
      {reviewingApplication && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Review Application</h3>
              <button onClick={() => setReviewingApplication(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateApplication} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Applicant Info</p>
                    <p className="text-sm font-bold text-slate-900">{reviewingApplication.name}</p>
                    <p className="text-sm text-slate-500">{reviewingApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Channel Info</p>
                    <p className="text-sm font-bold text-slate-900">{reviewingApplication.channelName}</p>
                    <p className="text-sm text-indigo-600 hover:underline cursor-pointer truncate">{reviewingApplication.channelUrl}</p>
                    <p className="text-sm text-slate-600 mt-1">{reviewingApplication.subscribers?.toLocaleString()} Subscribers • {reviewingApplication.niche}</p>
                  </div>
                  {reviewingApplication.message && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Message</p>
                      <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">"{reviewingApplication.message}"</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Update Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                      value={reviewingApplication.status} 
                      onChange={e => setReviewingApplication({...reviewingApplication, status: e.target.value})}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="More Info Needed">More Info Needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Review Notes</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none" 
                      placeholder="Add internal notes about this application..."
                      value={reviewingApplication.adminNotes || ''} 
                      onChange={e => setReviewingApplication({...reviewingApplication, adminNotes: e.target.value})} 
                    />
                  </div>
                  {reviewingApplication.reviewedAt && (
                    <div className="pt-2">
                      <p className="text-xs text-slate-400">
                        Last reviewed on {reviewingApplication.reviewedAt.toDate ? reviewingApplication.reviewedAt.toDate().toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setReviewingApplication(null)} 
                  className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdatingApplication}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {isUpdatingApplication && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Creator Modal */}
      {editingCreator && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Edit Creator Profile</h3>
              <button onClick={() => setEditingCreator(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateCreator} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={editingCreator.name} 
                    onChange={e => setEditingCreator({...editingCreator, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Channel Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={editingCreator.channelName || ''} 
                    onChange={e => setEditingCreator({...editingCreator, channelName: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subscriber Count</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={editingCreator.subscribers || 0} 
                    onChange={e => setEditingCreator({...editingCreator, subscribers: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={editingCreator.status} 
                    onChange={e => setEditingCreator({...editingCreator, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Content Niche</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={editingCreator.niche || ''} 
                    onChange={e => setEditingCreator({...editingCreator, niche: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Revenue ($)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={editingCreator.revenue || 0} 
                    onChange={e => setEditingCreator({...editingCreator, revenue: e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setEditingCreator(null)} 
                  className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdatingCreator}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {isUpdatingCreator && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default App;
