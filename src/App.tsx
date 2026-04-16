import React, { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import AdminCreatorManagement, { Creator } from './pages/AdminCreatorManagement';
import CreatorApplication from './pages/CreatorApplication';
import EducationHub from './pages/EducationHub';
import LegalLicensing from './pages/LegalLicensing';
import ContentScheduler from './pages/ContentScheduler';
import Gamification from './pages/Gamification';
import BackupExport from './pages/BackupExport';
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
  Database,
  Trash2,
  BarChart3,
  TrendingUp,
  Plus,
  Trophy,
  X,
  LogIn,
  LogOut,
  Mail,
  Search,
  Play,
  RefreshCw,
  Loader2,
  Lightbulb,
  Zap,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  UserCheck,
  UserPlus,
  PlaySquare,
  BookOpen,
  ShoppingBag,
  FileSignature,
  Edit2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { generateVideoIdeas, optimizeTitle, suggestThumbnails } from './services/geminiService';
import api from './lib/api';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  storage,
  handleFirestoreError,
  OperationType
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, addDoc, serverTimestamp, collection, getDocs, updateDoc, onSnapshot, query, orderBy, where, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext';
import { RegionProvider, useRegion } from './contexts/RegionContext';
import { RightsManagement } from './pages/RightsManagement';
import { RightsTable } from './components/RightsTable';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { region, setRegion, availableRegions } = useRegion();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [youtubeStats, setYoutubeStats] = useState<any>(null);
  const [latestVideos, setLatestVideos] = useState<any[]>([]);
  const [isYoutubeStatsLoading, setIsYoutubeStatsLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Creators state
  const [creators, setCreators] = useState<any[]>([]);
  const [isCreatorsLoading, setIsCreatorsLoading] = useState(false);
  const [editingCreator, setEditingCreator] = useState<any>(null);
  const [editingVideo, setEditingVideo] = useState<any>(null);
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
  const [showAddEarningModal, setShowAddEarningModal] = useState(false);
  const [isAddingEarning, setIsAddingEarning] = useState(false);
  const [newEarning, setNewEarning] = useState({
    creatorId: '',
    channelId: '',
    month: new Date().toISOString().slice(0, 7),
    totalRevenue: '',
    creatorPercentage: 70,
    mcnPercentage: 20,
    bonusPercentage: 10,
    status: 'Accrued'
  });

  // Payouts state
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isPayoutsLoading, setIsPayoutsLoading] = useState(false);
  const [payoutFilters, setPayoutFilters] = useState({ status: '', creatorId: '' });
  const [showCreatePayoutModal, setShowCreatePayoutModal] = useState(false);
  const [newPayout, setNewPayout] = useState({ creatorId: '', amount: '', method: 'Bank Transfer', reference: '' });
  const [isCreatingPayout, setIsCreatingPayout] = useState(false);
  
  // Invite form state
  const [inviteForm, setInviteForm] = useState({ channelName: '', channelUrl: '', email: '', message: '', templateId: '', templateSubject: '', templateBody: '' });
  const [isInviting, setIsInviting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Email Templates state
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [isEmailTemplatesLoading, setIsEmailTemplatesLoading] = useState(false);
  const [showEmailTemplateModal, setShowEmailTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '', variables: ['channelName', 'message', 'inviteLink'] });

  const handleSyncChannel = async () => {
    if (!inviteForm.channelUrl) {
      setInviteStatus({ type: 'error', message: 'Please enter a Channel URL first' });
      return;
    }
    
    setIsSyncing(true);
    // Simulate API delay for a realistic feel
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      const url = inviteForm.channelUrl.toLowerCase();
      let name = '';
      
      // Basic extraction logic for YouTube URLs
      if (url.includes('@')) {
        name = url.split('@')[1].split(/[/?#]/)[0];
      } else if (url.includes('channel/')) {
        name = 'Channel ' + url.split('channel/')[1].substring(0, 8);
      } else if (url.includes('user/')) {
        name = url.split('user/')[1].split(/[/?#]/)[0];
      } else if (url.includes('c/')) {
        name = url.split('c/')[1].split(/[/?#]/)[0];
      } else {
        // Fallback: try to get something from the end of the URL
        const parts = url.split('/').filter(p => p);
        if (parts.length > 0) {
          name = parts[parts.length - 1];
        }
      }
      
      if (name) {
        // Clean up name (capitalize, remove hyphens/dots)
        const formattedName = name
          .split(/[-_.]/)
          .filter(word => word.length > 0)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        setInviteForm(prev => ({ ...prev, channelName: formattedName }));
        setInviteStatus({ type: 'success', message: 'Channel details synced successfully!' });
        setTimeout(() => setInviteStatus(null), 3000);
      } else {
        setInviteStatus({ type: 'error', message: 'Could not extract channel name from URL' });
      }
    } catch (error) {
      setInviteStatus({ type: 'error', message: 'Failed to sync channel details' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Users state (for admin management)
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  // Channels state
  const [channels, setChannels] = useState<any[]>([]);
  const [isChannelsLoading, setIsChannelsLoading] = useState(false);

  // Creator Profile State
  const [creatorProfile, setCreatorProfile] = useState<any>(null);

  // Video Upload State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [blockedCountries, setBlockedCountries] = useState('');
  const [isMonetized, setIsMonetized] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Video Analytics State
  const [videoAnalytics, setVideoAnalytics] = useState<any>(null);
  const [selectedVideoForAnalytics, setSelectedVideoForAnalytics] = useState<any>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

  // Manual Claim Modal State
  const [showManualClaimModal, setShowManualClaimModal] = useState(false);
  const [manualClaimForm, setManualClaimForm] = useState({ videoUrl: '', claimant: '', matchType: 'visual', description: '', contentId: '' });

  // Withdrawal State
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({ amount: '', method: 'Bank Transfer', details: '' });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;
    
    const amountNum = parseFloat(withdrawalForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    
    setIsWithdrawing(true);
    try {
      await api.post('/withdraw/request', {
        amount: amountNum,
        method: withdrawalForm.method,
        details: withdrawalForm.details
      });
      setShowWithdrawalModal(false);
      setWithdrawalForm({ amount: '', method: 'Bank Transfer', details: '' });
      
      // Refresh payouts
      const endpoint = isAdmin ? '/withdraw/all' : '/withdraw/my';
      const res = await api.get(endpoint);
      const data = res.data.map((item: any) => ({
        id: item._id,
        ...item,
        createdAt: { toDate: () => new Date(item.date) },
        timestamp: { toDate: () => new Date(item.date) },
        creatorId: item.userId,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1)
      }));
      setPayouts(data);
    } catch (error) {
      console.error("Withdrawal Error:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };
  const [kycForm, setKycForm] = useState({ idType: 'National ID', idNumber: '', idImage: '' });
  const [isKycSubmitting, setIsKycSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<any>(null);

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    enableContentId: true,
    enablePayouts: true,
    enableInvites: true,
    enableApplications: true
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsKycSubmitting(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        kyc: {
          ...kycForm,
          status: 'Pending',
          submittedAt: serverTimestamp()
        }
      });
      setKycStatus({ type: 'success', message: 'KYC documents submitted successfully for review.' });
    } catch (error) {
      console.error("KYC Error:", error);
      setKycStatus({ type: 'error', message: 'Failed to submit KYC documents.' });
    } finally {
      setIsKycSubmitting(false);
    }
  };
  const [aiNiche, setAiNiche] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeAiTool, setActiveAiTool] = useState<'ideas' | 'optimize' | 'thumbnails' | null>(null);

  const handleGenerateIdeas = async () => {
    if (!aiNiche) return;
    setIsAiLoading(true);
    setActiveAiTool('ideas');
    try {
      const ideas = await generateVideoIdeas(aiNiche);
      setAiResults(ideas);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOptimizeTitle = async () => {
    if (!aiTitle) return;
    setIsAiLoading(true);
    setActiveAiTool('optimize');
    try {
      const titles = await optimizeTitle(aiTitle);
      setAiResults(titles);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSuggestThumbnails = async () => {
    if (!aiTitle) return;
    setIsAiLoading(true);
    setActiveAiTool('thumbnails');
    try {
      const concepts = await suggestThumbnails(aiTitle);
      setAiResults(concepts);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Selected Claim State
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [claimDetailsTab, setClaimDetailsTab] = useState<'overview' | 'history'>('overview');
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, actionType: 'release' | 'reinstate' | null}>({isOpen: false, actionType: null});

  // Email/Password Auth State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  // Role Helpers
  const isAdmin = userProfile?.role === 'admin';
  const isEditor = userProfile?.role === 'editor';
  const isStaff = isAdmin || isEditor;
  const isCreator = userProfile?.role === 'creator';

  const fetchWithJson = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    const text = await response.text();
    if (response.status === 403) {
      throw new Error("Access Forbidden (403). This usually means the API is not enabled or the request was blocked by a security policy.");
    }
    throw new Error(`Expected JSON but received ${contentType || 'unknown'}. This often happens when the server returns an error page. Status: ${response.status}`);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setYoutubeError(null);
    try {
      const data = await fetchWithJson(`/api/youtube/search/${encodeURIComponent(searchQuery)}`);
      if (Array.isArray(data)) {
        setLatestVideos(data);
        setActiveTab('dashboard'); // Switch to dashboard to show results
      } else if (data.error) {
        setYoutubeError(data.error);
      }
    } catch (error) {
      console.error("Search error:", error);
      setYoutubeError(error instanceof Error ? error.message : "Search failed. Please check your network connection.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      setIsAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        localStorage.setItem('token', token);
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
        localStorage.removeItem('token');
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribeUsers: (() => void) | undefined;
    if (user && isAdmin) {
      setIsUsersLoading(true);
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllUsers(usersList);
        setIsUsersLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
        setIsUsersLoading(false);
      });
    }

    // Fetch claims
    let unsubscribeClaims: (() => void) | undefined;
    if (user && isStaff) {
      setIsClaimsLoading(true);
      const claimsQuery = query(collection(db, 'claims'), orderBy('date', 'desc'));
      unsubscribeClaims = onSnapshot(claimsQuery, (snapshot) => {
        const claimsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClaims(claimsList);
        setIsClaimsLoading(false);
      }, (error) => {
        console.error("Error fetching claims:", error);
        setIsClaimsLoading(false);
        // Add user-friendly error notification here if needed
      });
    }

    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeClaims) unsubscribeClaims();
    };
  }, [user, isAdmin, isStaff]);

  useEffect(() => {
    if (user && activeTab === 'contentid') {
      setIsAssetsLoading(true);
      const assetsQuery = isAdmin 
        ? query(collection(db, 'content_id_assets'), orderBy('createdAt', 'desc'))
        : query(collection(db, 'content_id_assets'), where('ownerUid', '==', user.uid), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(assetsQuery, (snapshot) => {
        const assetsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContentIdAssets(assetsList);
        setIsAssetsLoading(false);
      }, (error) => {
        console.error("Error fetching assets:", error);
        setIsAssetsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, activeTab, isAdmin]);

  useEffect(() => {
    if (user && (user.emailVerified || userProfile?.role !== 'admin')) {
      fetchWithJson('/api/admin/stats')
        .then(data => setStats(data))
        .catch(err => console.error("Admin stats fetch error:", err));

      setIsYoutubeStatsLoading(true);
      setYoutubeError(null);
      fetchWithJson('/api/youtube/stats')
        .then(data => {
          if (data.success) {
            setYoutubeStats({ ...data.data, isMock: data.isMock });
          } else {
            setYoutubeError(data.message || 'Failed to fetch YouTube stats');
          }
        })
        .catch(err => {
          console.error("YouTube stats fetch error:", err);
          setYoutubeError(err instanceof Error ? err.message : 'Network error while fetching YouTube stats');
        });

      fetchWithJson('/api/youtube/videos')
        .then(data => {
          if (Array.isArray(data)) {
            setLatestVideos(data);
          } else if (data.error) {
            setYoutubeError(prev => prev || data.error);
          }
        })
        .catch(err => console.error("YouTube videos fetch error:", err))
        .finally(() => setIsYoutubeStatsLoading(false));
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (user && activeTab === 'creators' && isStaff) {
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
  }, [user, activeTab, isStaff]);

  useEffect(() => {
    if (user && activeTab === 'applications' && isStaff) {
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
  }, [user, activeTab, isStaff]);

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

  useEffect(() => {
    if (user && activeTab === 'settings' && isAdmin) {
      const fetchSettings = async () => {
        try {
          const docRef = doc(db, 'platform_settings', 'global');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPlatformSettings(docSnap.data() as any);
          } else {
            // Create default settings if they don't exist
            await setDoc(docRef, platformSettings);
          }
        } catch (error) {
          console.error("Error fetching platform settings:", error);
        }
      };
      fetchSettings();
    }
  }, [user, activeTab, isAdmin]);

  useEffect(() => {
    if (user && (activeTab === 'email-templates' || activeTab === 'invites') && isAdmin) {
      setIsEmailTemplatesLoading(true);
      getDocs(collection(db, 'email_templates'))
        .then(snapshot => {
          const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEmailTemplates(templates as any);
        })
        .catch(err => console.error('Error fetching email templates:', err))
        .finally(() => setIsEmailTemplatesLoading(false));
    }

    if (user && (activeTab === 'payouts' || activeTab === 'withdrawals')) {
      setIsPayoutsLoading(true);
      const endpoint = isAdmin ? '/withdraw/all' : '/withdraw/my';
      api.get(endpoint)
        .then(res => {
          const data = res.data.map((item: any) => ({
            id: item._id,
            ...item,
            // Map MongoDB fields to what the UI expects if necessary
            createdAt: { toDate: () => new Date(item.date) },
            timestamp: { toDate: () => new Date(item.date) },
            creatorId: item.userId,
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1) // 'pending' -> 'Pending'
          }));
          setPayouts(data);
        })
        .catch(err => console.error("Error fetching payouts:", err))
        .finally(() => setIsPayoutsLoading(false));
    }
  }, [user, activeTab, isAdmin]);

  const platformTools = [
    { id: 'video-distribution', title: 'Video Distribution', description: 'Distribute your videos across YouTube and Facebook', icon: Video, badge: null, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'audio-distribution', title: 'Audio Distribution', description: 'Share your music on 40+ platforms', icon: Music, badge: '+35', color: 'text-sky-500', bg: 'bg-sky-50' },
    { id: 'podcast-distribution', title: 'Podcast Distribution', description: 'Publish your podcasts to all major platforms', icon: Mic, badge: '+20', color: 'text-violet-500', bg: 'bg-violet-50' },
    { id: 'ai-ideas', title: 'AI Video Ideas', description: 'Generate viral video ideas for your niche', icon: Lightbulb, badge: 'AI', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'ai-optimize', title: 'AI Title Optimizer', description: 'Optimize your video titles for higher CTR', icon: Zap, badge: 'AI', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'ai-thumbnails', title: 'AI Thumbnail Suggester', description: 'Get professional thumbnail concepts', icon: ImageIcon, badge: 'AI', color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'brand-campaigns', title: 'Brand Campaigns', description: 'Apply for and manage your partnership campaigns', icon: Megaphone, badge: null, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'campaign-calendar', title: 'Campaign Calendar', description: 'Schedule and manage your campaign deliverables', icon: Calendar, badge: null, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'finance-management', title: 'Finance Management', description: 'Track earnings and payments', icon: DollarSign, badge: null, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Content ID state
  const [contentIdAssets, setContentIdAssets] = useState<any[]>([]);
  const [isAssetsLoading, setIsAssetsLoading] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newAsset, setNewAsset] = useState({ title: '', type: 'Audio', policy: 'Monetize', artist: '', isrc: '', status: 'Active', ownerUid: '', videoContentId: '' });
  const [assetValidationErrors, setAssetValidationErrors] = useState<{ [key: string]: string }>({});
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);

  // Copyright state
  const [claims, setClaims] = useState<any[]>([]);
  const [isClaimsLoading, setIsClaimsLoading] = useState(false);

  // Automated Copyright Notifications
  useEffect(() => {
    if (!isStaff || claims.length === 0) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const unnotifiedClaims = claims.filter(c => c.notified === false);
    
    unnotifiedClaims.forEach(async (claim) => {
      // Find creator email
      const creator = creators.find(cre => cre.id === claim.creatorId || cre.channelName === claim.claimant);
      const email = creator?.email || 'creator@example.com';
      const name = creator?.name || 'Creator';

      try {
        // Refresh token before sending
        if (user) {
          const freshToken = await user.getIdToken(true);
          localStorage.setItem('token', freshToken);
        }
        
        console.log(`Automating notification for claim: ${claim.id}`);
        const response = await api.post('/notify/copyright', {
          email,
          name,
          videoTitle: claim.title,
          claimant: claim.claimant,
          matchType: claim.matchType
        });

        if (response.status === 200 || response.status === 201) {
          // Update claim as notified in Firestore
          await updateDoc(doc(db, 'claims', claim.id), {
            notified: true,
            history: [
              { 
                id: Date.now(), 
                date: new Date().toLocaleString(), 
                action: 'Automated notification sent to creator', 
                user: 'System' 
              },
              ...(claim.history || [])
            ]
          });
        }
      } catch (error) {
        console.error("Failed to send automated notification:", error);
      }
    });
  }, [claims, creators, isStaff, user]);
  
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
      const payload = { ...inviteForm };
      if (inviteForm.templateId) {
        const template = emailTemplates.find(t => t.id === inviteForm.templateId);
        if (template) {
          payload.templateSubject = template.subject;
          payload.templateBody = template.body;
        }
      }

      const response = await api.post('/invites', payload);
      
      if (response.status !== 200 && response.status !== 201) throw new Error('Failed to send invite');
      
      setInviteStatus({ type: 'success', message: 'Invite sent successfully!' });
      setInviteForm({ channelName: '', channelUrl: '', email: '', message: '', templateId: '', templateSubject: '', templateBody: '' });
    } catch (error) {
      setInviteStatus({ type: 'error', message: 'Failed to send invite. Please try again.' });
    } finally {
      setIsInviting(false);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Client-side validation
    const errors: { [key: string]: string } = {};
    if (!newAsset.title.trim()) errors.title = "Asset title is required";
    if (!newAsset.artist.trim()) errors.artist = "Artist / Primary Owner is required";
    
    // Optional: Validate ISRC format if provided
    if (newAsset.isrc && !/^[A-Z]{2}-?[A-Z0-9]{3}-?\d{2}-?\d{5}$/i.test(newAsset.isrc)) {
      errors.isrc = "Invalid ISRC format (e.g. US-S1Z-24-00001)";
    }

    if (Object.keys(errors).length > 0) {
      setAssetValidationErrors(errors);
      return;
    }

    setAssetValidationErrors({});
    setIsCreatingAsset(true);
    try {
      await addDoc(collection(db, 'content_id_assets'), {
        ...newAsset,
        status: newAsset.status || 'Active',
        createdAt: serverTimestamp(),
        ownerUid: newAsset.ownerUid || user.uid
      });
      setShowAddAssetModal(false);
      setNewAsset({ title: '', type: 'Audio', policy: 'Monetize', artist: '', isrc: '', status: 'Active', ownerUid: '', videoContentId: '' });
    } catch (error) {
      console.error("Error adding asset:", error);
      alert("Failed to add asset. Please try again.");
    } finally {
      setIsCreatingAsset(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    setAssetToDelete(assetId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAsset = async () => {
    if (!assetToDelete) return;
    try {
      await deleteDoc(doc(db, 'content_id_assets', assetToDelete));
      setShowDeleteConfirm(false);
      setAssetToDelete(null);
    } catch (error) {
      console.error("Error deleting asset:", error);
      alert("Failed to delete asset. Please try again.");
    }
  };

  const handleManualClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log("Submitting manual claim:", manualClaimForm);
    alert("Manual claim submitted successfully!");
    setShowManualClaimModal(false);
    setManualClaimForm({ videoUrl: '', claimant: '', matchType: 'visual', description: '', contentId: '' });
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsProcessingAuth(true);

    try {
      if (authMode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        
        // Create user profile in Firestore
        const newProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: displayName,
          photoURL: null,
          role: userCredential.user.email === 'hosenmdjakir629@gmail.com' ? 'admin' : 'creator',
          createdAt: serverTimestamp()
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
        setUserProfile(newProfile);
        
        await sendEmailVerification(userCredential.user);
        alert("Account created! A verification email has been sent to your inbox.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError(error.message || "An error occurred during authentication.");
    } finally {
      setIsProcessingAuth(false);
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

  const handleUpdatePayoutStatus = async (payoutId: string, newStatus: string) => {
    try {
      await api.patch(`/withdraw/${payoutId}/status`, { status: newStatus });
      // Refresh payouts
      const endpoint = isAdmin ? '/withdraw/all' : '/withdraw/my';
      const res = await api.get(endpoint);
      const data = res.data.map((item: any) => ({
        id: item._id,
        ...item,
        createdAt: { toDate: () => new Date(item.date) },
        timestamp: { toDate: () => new Date(item.date) },
        creatorId: item.userId,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1)
      }));
      setPayouts(data);
    } catch (error) {
      console.error("Error updating payout status:", error);
    }
  };
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role.");
    }
  };

  // Creator Profile & Video Upload Logic
  useEffect(() => {
    if (user && isCreator) {
      const q = query(collection(db, 'creators'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (!snapshot.empty) {
          setCreatorProfile({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          // If no creator profile exists for this user, create one
          try {
            const newCreator = {
              uid: user.uid,
              name: user.displayName || 'New Creator',
              email: user.email,
              status: 'Pending',
              createdAt: serverTimestamp(),
              videos: []
            };
            const docRef = await addDoc(collection(db, 'creators'), newCreator);
            setCreatorProfile({ id: docRef.id, ...newCreator });
          } catch (error) {
            console.error("Error creating creator profile:", error);
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user, isCreator]);

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !user || !creatorProfile) return;

    setIsUploadingVideo(true);
    setUploadProgress(0);

    try {
      const videoId = Date.now().toString();
      
      // Upload Video
      const videoStorageRef = ref(storage, `videos/${user.uid}/${videoId}_${videoFile.name}`);
      const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);

      // Upload Thumbnail if provided
      let thumbnailUrl = '';
      if (thumbnailFile) {
        const thumbnailStorageRef = ref(storage, `thumbnails/${user.uid}/${videoId}_${thumbnailFile.name}`);
        const thumbnailUploadTask = await uploadBytesResumable(thumbnailStorageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(thumbnailUploadTask.ref);
      }

      videoUploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error("Upload failed:", error);
          alert("Video upload failed: " + error.message);
          setIsUploadingVideo(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(videoUploadTask.snapshot.ref);
          
          const videoData = {
            id: videoId,
            title: videoTitle || videoFile.name,
            url: downloadURL,
            thumbnailUrl: thumbnailUrl,
            blockedCountries: blockedCountries.split(',').map(c => c.trim()).filter(c => c !== ''),
            isMonetized,
            uploadedAt: new Date().toISOString(),
            size: videoFile.size,
            status: 'Ready'
          };

          try {
            await updateDoc(doc(db, 'creators', creatorProfile.id), {
              videos: arrayUnion(videoData)
            });

            // Initialize analytics for the new video
            await addDoc(collection(db, 'videoAnalytics'), {
              videoId: videoId,
              creatorId: user.uid,
              views: 0,
              watchTime: 0,
              likes: 0,
              lastUpdated: new Date().toISOString()
            });

            setVideoFile(null);
            setThumbnailFile(null);
            setVideoTitle('');
            setBlockedCountries('');
            setIsMonetized(true);
            setUploadProgress(0);
            alert("Video uploaded successfully!");
          } catch (error) {
            console.error("Error updating creator profile:", error);
            alert("Failed to update profile with video info.");
          } finally {
            setIsUploadingVideo(false);
          }
        }
      );
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("An error occurred during upload: " + error.message);
      setIsUploadingVideo(false);
    }
  };

  const fetchVideoAnalytics = async (video: any) => {
    if (!user) return;
    setIsAnalyticsLoading(true);
    setSelectedVideoForAnalytics(video);
    
    try {
      const q = query(
        collection(db, 'videoAnalytics'), 
        where('videoId', '==', video.id)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setVideoAnalytics(snapshot.docs[0].data());
      } else {
        // Initialize analytics if not found (for demo/fallback)
        const initialAnalytics = {
          videoId: video.id,
          creatorId: user.uid,
          views: Math.floor(Math.random() * 5000) + 100,
          watchTime: Math.floor(Math.random() * 200) + 10,
          likes: Math.floor(Math.random() * 300) + 20,
          lastUpdated: new Date().toISOString()
        };
        await addDoc(collection(db, 'videoAnalytics'), initialAnalytics);
        setVideoAnalytics(initialAnalytics);
      }
    } catch (error) {
      console.error("Error fetching video analytics:", error);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  const handleDeleteVideo = async (video: any) => {
    if (!user || !creatorProfile) return;
    
    if (!window.confirm(`Are you sure you want to delete "${video.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // 1. Delete from Storage
      // We can use ref(storage, url) to get the reference from the download URL
      const videoRef = ref(storage, video.url);
      await deleteObject(videoRef);

      // 2. Remove from Firestore
      await updateDoc(doc(db, 'creators', creatorProfile.id), {
        videos: arrayRemove(video)
      });

      alert("Video deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting video:", error);
      // If the file doesn't exist in storage, we should still try to remove it from Firestore
      if (error.code === 'storage/object-not-found') {
        try {
          await updateDoc(doc(db, 'creators', creatorProfile.id), {
            videos: arrayRemove(video)
          });
          alert("Video record removed (file was not found in storage).");
          return;
        } catch (fsError) {
          console.error("Error removing record from Firestore:", fsError);
        }
      }
      alert("Failed to delete video: " + error.message);
    }
  };

  const handleUpdateCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCreator) return;
    
    setIsUpdatingCreator(true);
    try {
      const creatorRef = doc(db, 'creators', editingCreator.id);
      await updateDoc(creatorRef, {
        name: editingCreator.name || '',
        channelName: editingCreator.channelName || '',
        subscribers: Number(editingCreator.subscribers) || 0,
        status: editingCreator.status || 'Pending',
        niche: editingCreator.niche || '',
        revenue: Number(editingCreator.revenue) || 0,
        adminNotes: editingCreator.adminNotes || '',
        payoutMethod: editingCreator.payoutMethod || '',
        payoutDetails: editingCreator.payoutDetails || '',
        updatedAt: serverTimestamp()
      });
      
      // Notify creator about payout update
      try {
        await api.post('/notify/payout', {
          email: editingCreator.email,
          name: editingCreator.name,
          amount: 'N/A',
          method: editingCreator.payoutMethod,
          status: 'Updated',
          reference: editingCreator.payoutDetails
        });
      } catch (notifyError) {
        console.error("Error notifying creator:", notifyError);
      }

      setEditingCreator(null);
      alert("Creator profile updated successfully!");
    } catch (error) {
      console.error("Error updating creator:", error);
      alert("Failed to update creator profile.");
    } finally {
      setIsUpdatingCreator(false);
    }
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo || !creatorProfile) return;
    try {
      const creatorRef = doc(db, 'creators', creatorProfile.id);
      const updatedVideos = creatorProfile.videos.map((v: any) => 
        v.id === editingVideo.id ? editingVideo : v
      );
      await updateDoc(creatorRef, {
        videos: updatedVideos
      });
      setCreatorProfile({...creatorProfile, videos: updatedVideos});
      setEditingVideo(null);
      alert("Video updated successfully!");
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video.");
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

      // Send email notification
      try {
        await api.post('/notify/application', {
          name: reviewingApplication.name,
          email: reviewingApplication.email,
          channelName: reviewingApplication.channelName,
          status: reviewingApplication.status,
          adminNotes: reviewingApplication.adminNotes
        });
      } catch (notifyError) {
        console.error("Failed to send notification:", notifyError);
      }

      setReviewingApplication(null);
      alert("Application updated and notification sent!");
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application.");
    } finally {
      setIsUpdatingApplication(false);
    }
  };

  const handleSavePlatformSettings = async () => {
    setIsSavingSettings(true);
    try {
      await updateDoc(doc(db, 'platform_settings', 'global'), {
        ...platformSettings,
        updatedAt: serverTimestamp()
      });
      alert("Platform settings saved successfully.");
    } catch (error) {
      console.error("Error saving platform settings:", error);
      alert("Failed to save platform settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveEmailTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      alert("Name, Subject, and Body are required.");
      return;
    }
    
    try {
      if (editingTemplate) {
        await updateDoc(doc(db, 'email_templates', editingTemplate.id), {
          ...newTemplate,
          updatedAt: serverTimestamp()
        });
        setEmailTemplates(emailTemplates.map(t => t.id === editingTemplate.id ? { ...t, ...newTemplate } : t));
      } else {
        const docRef = await addDoc(collection(db, 'email_templates'), {
          ...newTemplate,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setEmailTemplates([...emailTemplates, { id: docRef.id, ...newTemplate }]);
      }
      setShowEmailTemplateModal(false);
      setEditingTemplate(null);
      setNewTemplate({ name: '', subject: '', body: '', variables: ['channelName', 'message', 'inviteLink'] });
    } catch (error) {
      console.error("Error saving email template:", error);
      alert("Failed to save email template.");
    }
  };

  const handleDeleteEmailTemplate = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await deleteDoc(doc(db, 'email_templates', id));
      setEmailTemplates(emailTemplates.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting email template:", error);
      alert("Failed to delete email template.");
    }
  };

  const handleCreatePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayout.creatorId || !newPayout.amount) return;

    setIsCreatingPayout(true);
    try {
      await setDoc(doc(collection(db, 'payouts')), {
        ...newPayout,
        amount: Number(newPayout.amount),
        status: 'Pending',
        timestamp: serverTimestamp(),
        createdBy: user?.uid
      });

      // Send email notification to creator
      const creator = creators.find(c => c.id === newPayout.creatorId);
      if (creator && creator.email) {
        try {
          await api.post('/notify/payout', {
            email: creator.email,
            name: creator.name,
            amount: newPayout.amount,
            method: newPayout.method,
            status: 'Pending',
            reference: newPayout.reference
          });
        } catch (notifyError) {
          console.error("Failed to send notification:", notifyError);
        }
      }

      setShowCreatePayoutModal(false);
      setNewPayout({ creatorId: '', amount: '', method: 'Bank Transfer', reference: '' });
      alert("Payout record created and notification sent!");
    } catch (error) {
      console.error("Error creating payout:", error);
      alert("Failed to create payout record.");
    } finally {
      setIsCreatingPayout(false);
    }
  };

  const handleAddEarning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEarning.creatorId || !newEarning.totalRevenue) return;

    setIsAddingEarning(true);
    try {
      const response = await api.post('/earnings/add', {
        ...newEarning,
        totalRevenue: Number(newEarning.totalRevenue),
        creatorPercentage: Number(newEarning.creatorPercentage),
        mcnPercentage: Number(newEarning.mcnPercentage),
        bonusPercentage: Number(newEarning.bonusPercentage)
      });

      setShowAddEarningModal(false);
      setNewEarning({
        creatorId: '',
        channelId: '',
        month: new Date().toISOString().slice(0, 7),
        totalRevenue: '',
        creatorPercentage: 70,
        mcnPercentage: 20,
        bonusPercentage: 10,
        status: 'Accrued'
      });
      alert("Earning record added and split calculated successfully!");
    } catch (error: any) {
      console.error("Error adding earning:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to add earning";
      alert("Failed to add earning record: " + errorMsg);
    } finally {
      setIsAddingEarning(false);
    }
  };

  const handleNotifyCopyright = async (claim: any) => {
    // For demo purposes, we'll use a placeholder email if not found
    const creator = creators.find(c => c.id === claim.creatorId || c.channelName === claim.claimant);
    const creatorEmail = creator?.email || 'creator@example.com';
    const creatorName = creator?.name || 'Creator';
    
    try {
      const response = await api.post('/notify/copyright', {
        email: creatorEmail,
        name: creatorName,
        videoTitle: claim.title,
        claimant: claim.claimant,
        matchType: claim.matchType
      });
      if (response.status === 200 || response.status === 201) {
        // Update claim as notified in Firestore if it wasn't already
        if (!claim.notified) {
          await updateDoc(doc(db, 'claims', claim.id), {
            notified: true,
            history: [
              { 
                id: Date.now(), 
                date: new Date().toLocaleString(), 
                action: 'Manual notification sent to creator', 
                user: 'Admin (AD)' 
              },
              ...(claim.history || [])
            ]
          });
        }
        alert("Copyright notification sent to creator!");
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send notification.");
    }
  };

  const handleSimulateDetection = async () => {
    if (!isStaff) return;
    
    const randomCreator = creators[Math.floor(Math.random() * creators.length)] || { id: 'test-creator', name: 'Test Creator', channelName: 'Test Channel' };
    const claimId = `v_${Math.random().toString(36).substr(2, 7)}`;
    const newClaim = {
      id: claimId,
      title: `New Video ${Math.floor(Math.random() * 100)}`,
      claimant: 'Copyright Holder Inc.',
      matchType: 'Audio match (1:00 - 1:30)',
      status: 'Active',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      notes: 'Automatically detected by OrbitX Network LTD Content ID Simulation.',
      statusColor: 'bg-emerald-100 text-emerald-700',
      notified: false,
      creatorId: randomCreator.id,
      history: [
        { id: 1, date: new Date().toLocaleString(), action: 'Claim automatically generated by Content ID Simulation', user: 'System' }
      ]
    };

    try {
      await setDoc(doc(db, 'claims', claimId), newClaim);
      alert("New copyright claim detected and added to system. Automation will now process the notification.");
    } catch (error) {
      console.error("Error simulating detection:", error);
      alert("Failed to simulate detection.");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading OrbitX Network LTD...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://picsum.photos/seed/orbitx/1920/1080?blur=10')] bg-cover bg-center">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-6">
            O
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">OrbitX Network LTD</h1>
          <p className="text-slate-600 mb-8">
            {authMode === 'login' ? 'Sign in to manage your MCN dashboard.' : 'Create an account to join OrbitX Network LTD.'}
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            {authMode === 'signup' && (
              <div>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {authError && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                {authError}
              </p>
            )}

            <button 
              type="submit"
              disabled={isProcessingAuth}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessingAuth && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-semibold">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm mb-6"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>

          <p className="text-sm text-slate-600">
            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setAuthError(null);
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              {authMode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Verification Banner */}
      {user && !user.emailVerified && isStaff && (
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">OrbitX Network LTD</h1>
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
            onClick={() => setActiveTab('youtube-integration')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'youtube-integration' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Video className="w-5 h-5 mr-3" />
            YouTube Integration
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'earnings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <DollarSign className="w-5 h-5 mr-3" />
            Earnings
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('brand-deals')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'brand-deals' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Megaphone className="w-5 h-5 mr-3" />
            Brand Deals
          </button>
          <button 
            onClick={() => setActiveTab('rights-management')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'rights-management' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <FileSignature className="w-5 h-5 mr-3" />
            Rights Management
          </button>
          {platformSettings.enableContentId && (
            <button 
              onClick={() => setActiveTab('copyright')}
              className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'copyright' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Copyright className="w-5 h-5 mr-3" />
              Copyright
            </button>
          )}
          <button 
            onClick={() => setActiveTab('team')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'team' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Team
          </button>
          <button 
            onClick={() => setActiveTab('education')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'education' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Education Hub
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'marketplace' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            Marketplace
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>

          {isStaff && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Staff Admin</p>
              <button 
                onClick={() => setActiveTab('creators')}
                className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'creators' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Users className="w-5 h-5 mr-3" />
                Creators
              </button>
              {platformSettings.enableApplications && (
                <button 
                  onClick={() => setActiveTab('applications')}
                  className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'applications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  Applications
                  {applications.filter(a => a.status === 'Pending').length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {applications.filter(a => a.status === 'Pending').length}
                    </span>
                  )}
                </button>
              )}
              {platformSettings.enableInvites && (
                <button 
                  onClick={() => setActiveTab('invites')}
                  className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'invites' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <UserPlus className="w-5 h-5 mr-3" />
                  Invites
                </button>
              )}
              {platformSettings.enablePayouts && (
                <button 
                  onClick={() => setActiveTab('payouts')}
                  className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'payouts' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <DollarSign className="w-5 h-5 mr-3" />
                  Payouts
                </button>
              )}
              <button 
                onClick={() => setActiveTab('email-templates')}
                className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'email-templates' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Mail className="w-5 h-5 mr-3" />
                Email Templates
              </button>
            </div>
          )}
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
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search YouTube content..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </form>
          </div>
          <div className="flex items-center gap-5">
            {isStaff && (
              <div className="flex items-center gap-2 mr-4">
                <button 
                  onClick={() => setShowAddEarningModal(true)}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Earning Report
                </button>
                <button 
                  onClick={() => setShowCreatePayoutModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Create Payout
                </button>
              </div>
            )}
            {/* Region Selector */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-lg">{region.flag}</span>
              <select 
                value={region.code} 
                onChange={(e) => setRegion(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                {availableRegions.map(r => (
                  <option key={r.code} value={r.code}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-sm font-bold text-indigo-600">{currency.symbol}</span>
              <select 
                value={currency.code} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                {availableCurrencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>

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
          {user && !user.emailVerified && isStaff ? (
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
              {activeTab === 'application' && (
                <CreatorApplication user={user} />
              )}
              {activeTab === 'admin-dashboard' && (
                <AdminDashboard />
              )}
              {activeTab === 'creator-dashboard' && (
                <CreatorDashboard user={user} />
              )}
              {activeTab === 'youtube-integration' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">YouTube Integration</h3>
                    <p className="text-slate-500">Manage your YouTube channel connection and sync data.</p>
                  </div>
                  {youtubeStats && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                            <img src={youtubeStats.thumbnails?.default?.url} alt={youtubeStats.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{youtubeStats.title}</h3>
                            <p className="text-xs text-slate-500 font-medium">Primary Network Channel</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-6">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subscribers</p>
                          <p className="text-2xl font-bold text-slate-900">{parseInt(youtubeStats.statistics?.subscriberCount).toLocaleString()}</p>
                        </div>
                        <div className="p-6">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Views</p>
                          <p className="text-2xl font-bold text-slate-900">{parseInt(youtubeStats.statistics?.viewCount).toLocaleString()}</p>
                        </div>
                        <div className="p-6">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Videos</p>
                          <p className="text-2xl font-bold text-slate-900">{parseInt(youtubeStats.statistics?.videoCount).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {latestVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {latestVideos.map((video: any) => (
                        <div key={video.id.videoId || video.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                          <div className="aspect-video relative overflow-hidden">
                            <img src={video.snippet.thumbnails.high?.url} alt={video.snippet.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{video.snippet.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Network Analytics</h3>
                    <p className="text-slate-500">Detailed performance metrics across all channels and regions.</p>
                  </div>
                  {/* Removed RegionAnalytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Growth</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { name: 'Jan', revenue: 4000 },
                            { name: 'Feb', revenue: 3000 },
                            { name: 'Mar', revenue: 2000 },
                            { name: 'Apr', revenue: 2780 },
                            { name: 'May', revenue: 1890 },
                            { name: 'Jun', revenue: 2390 },
                            { name: 'Jul', revenue: 3490 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Top Niches</h3>
                      <div className="space-y-6">
                        {[
                          { name: 'Gaming', percentage: 45, color: 'bg-indigo-500' },
                          { name: 'Vlogs', percentage: 25, color: 'bg-emerald-500' },
                          { name: 'Tech', percentage: 15, color: 'bg-amber-500' },
                          { name: 'Music', percentage: 10, color: 'bg-rose-500' },
                        ].map((niche) => (
                          <div key={niche.name}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-700">{niche.name}</span>
                              <span className="text-xs font-bold text-slate-500">{niche.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${niche.color}`} style={{ width: `${niche.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'brand-deals' && (
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
                  <h2 className="text-xl font-bold text-slate-900">Brand Deals</h2>
                  <p className="text-slate-500">Coming soon.</p>
                </div>
              )}
              {activeTab === 'team' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Team Management</h3>
                    <p className="text-slate-500">Manage staff members and their roles within the MCN.</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                          <th className="px-6 py-4 font-semibold">Name</th>
                          <th className="px-6 py-4 font-semibold">Email</th>
                          <th className="px-6 py-4 font-semibold">Role</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {allUsers.filter(u => u.role === 'admin' || u.role === 'editor').map((staff) => (
                          <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{staff.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{staff.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${staff.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                                {staff.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="flex items-center text-xs text-emerald-600 font-medium">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* Marketplace removed */}
              {activeTab === 'education' && (
                <EducationHub />
              )}
              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Settings</h3>
                    <p className="text-slate-500">Manage your account preferences and system configuration.</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                          <p className="text-xs text-slate-500">Receive updates about your channel and earnings.</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                          <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'scheduler' && (
                <ContentScheduler />
              )}
              {activeTab === 'gamification' && (
                <Gamification />
              )}
              {activeTab === 'backup' && (
                <BackupExport />
              )}
              {activeTab === 'rights-management' && (
                <div className="space-y-6">
                  <RightsManagement />
                  <RightsTable rights={[]} />
                </div>
              )}
              {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Creators</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">138+</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Applications</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">138+</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">100K+</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">System Status</h3>
                  <div className="flex items-center mt-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">Active</p>
                  </div>
                </div>
              </div>

              {/* Revenue & Growth Chart */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Growth</h3>
                      <p className="text-xs text-slate-500">Monthly revenue performance across the network</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Jan', revenue: 4000 },
                        { name: 'Feb', revenue: 3000 },
                        { name: 'Mar', revenue: 2000 },
                        { name: 'Apr', revenue: 2780 },
                        { name: 'May', revenue: 1890 },
                        { name: 'Jun', revenue: 2390 },
                        { name: 'Jul', revenue: 3490 },
                      ]}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fill: '#94a3b8'}}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fill: '#94a3b8'}}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">Top Niches</h3>
                  <div className="space-y-6">
                    {[
                      { name: 'Gaming', percentage: 45, color: 'bg-indigo-500' },
                      { name: 'Vlogs', percentage: 25, color: 'bg-emerald-500' },
                      { name: 'Tech', percentage: 15, color: 'bg-amber-500' },
                      { name: 'Music', percentage: 10, color: 'bg-rose-500' },
                      { name: 'Others', percentage: 5, color: 'bg-slate-400' },
                    ].map((niche) => (
                      <div key={niche.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-700">{niche.name}</span>
                          <span className="text-xs font-bold text-slate-500">{niche.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${niche.color} transition-all duration-1000`} 
                            style={{ width: `${niche.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {youtubeError && (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">YouTube Data API Not Enabled</h3>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      We couldn't connect to the YouTube Data API. This usually happens when the API is not enabled in your Google Cloud project.
                    </p>
                    <p className="text-xs text-amber-700 mt-2 leading-relaxed font-semibold">
                      To fix this:
                    </p>
                    <ol className="text-xs text-amber-700 mt-1 list-decimal list-inside leading-relaxed">
                      <li>Go to the <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google Cloud Console</a>.</li>
                      <li>Ensure your project is selected.</li>
                      <li>Click "Enable" to activate the YouTube Data API v3.</li>
                      <li>Wait a few minutes and refresh this page.</li>
                    </ol>
                    <div className="mt-4 flex gap-3">
                      <a 
                        href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider underline"
                      >
                        Enable API
                      </a>
                      <a 
                        href="https://console.cloud.google.com/apis/credentials" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider underline"
                      >
                        Check Credentials
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {youtubeStats && (
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                        <img src={youtubeStats.thumbnails?.default?.url} alt={youtubeStats.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{youtubeStats.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">Primary Network Channel</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                      youtubeStats.isMock 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {youtubeStats.isMock ? <AlertTriangle className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {youtubeStats.isMock ? 'Demo Mode' : 'YouTube Live Data'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-6">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subscribers</p>
                      <p className="text-2xl font-bold text-slate-900">{parseInt(youtubeStats.statistics?.subscriberCount).toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1 text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[10px] font-bold">Real-time growth</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Views</p>
                      <p className="text-2xl font-bold text-slate-900">{parseInt(youtubeStats.statistics?.viewCount).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Lifetime channel views</p>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Videos</p>
                      <p className="text-2xl font-bold text-slate-900">{parseInt(youtubeStats.statistics?.videoCount).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Uploaded to primary channel</p>
                    </div>
                  </div>
                  {youtubeStats.isMock && (
                    <div className="px-6 py-3 bg-amber-50/50 border-t border-slate-100 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <p className="text-[10px] font-medium text-amber-700">
                        The YouTube Data API is not enabled in your Google Cloud project. Showing demo data. 
                        <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener noreferrer" className="ml-1 underline">Enable API</a>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {latestVideos.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-800">Latest Channel Content</h3>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestVideos.map((video: any) => (
                      <div key={video.id.videoId || video.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url} 
                            alt={video.snippet.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-red-600 shadow-lg">
                              <Play className="w-6 h-6 fill-current" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                            {video.snippet.title}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-medium">
                              {new Date(video.snippet.publishedAt).toLocaleDateString()}
                            </span>
                            <a 
                              href={`https://www.youtube.com/watch?v=${video.id.videoId}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider"
                            >
                              Watch Now
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

          {activeTab === 'ai-ideas' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Video Ideas Generator</h3>
                    <p className="text-slate-500 text-sm">Generate viral video concepts for your YouTube niche.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text"
                    placeholder="Enter your niche (e.g. Tech, Gaming, Cooking)..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    value={aiNiche}
                    onChange={(e) => setAiNiche(e.target.value)}
                  />
                  <button 
                    onClick={handleGenerateIdeas}
                    disabled={isAiLoading || !aiNiche}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Generate Ideas
                  </button>
                </div>
              </div>

              {aiResults && activeAiTool === 'ideas' && (
                <div className="grid grid-cols-1 gap-6">
                  {aiResults.map((idea: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-indigo-200 transition-all">
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{idea.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{idea.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai-optimize' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Title Optimizer</h3>
                    <p className="text-slate-500 text-sm">Optimize your video titles for maximum CTR and SEO.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text"
                    placeholder="Enter your current video title..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    value={aiTitle}
                    onChange={(e) => setAiTitle(e.target.value)}
                  />
                  <button 
                    onClick={handleOptimizeTitle}
                    disabled={isAiLoading || !aiTitle}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Optimize Title
                  </button>
                </div>
              </div>

              {aiResults && activeAiTool === 'optimize' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold text-slate-900">Optimized Alternatives</h4>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {aiResults.map((title: string, idx: number) => (
                      <div key={idx} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-all">
                        <p className="text-sm font-medium text-slate-700">{title}</p>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(title);
                          }}
                          className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai-thumbnails' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Thumbnail Suggester</h3>
                    <p className="text-slate-500 text-sm">Get creative thumbnail concepts for your video.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text"
                    placeholder="Enter your video title..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    value={aiTitle}
                    onChange={(e) => setAiTitle(e.target.value)}
                  />
                  <button 
                    onClick={handleSuggestThumbnails}
                    disabled={isAiLoading || !aiTitle}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Suggest Concepts
                  </button>
                </div>
              </div>

              {aiResults && activeAiTool === 'thumbnails' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiResults.map((concept: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                      <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm">{concept.concept}</h4>
                      </div>
                      <div className="p-4 flex-1 space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Visuals</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{concept.visuals}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Text Overlay</p>
                          <p className="text-xs font-bold text-indigo-600">{concept.text}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Colors</p>
                          <p className="text-xs text-slate-600">{concept.colors}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'invites' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Send Channel Invite</h3>
                  <p className="text-slate-500 text-sm mt-1">Invite a new creator to join the OrbitX Network LTD.</p>
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
                      <label htmlFor="channelUrl" className="block text-sm font-medium text-slate-700 mb-2">
                        Channel URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          id="channelUrl"
                          required
                          value={inviteForm.channelUrl}
                          onChange={(e) => setInviteForm({...inviteForm, channelUrl: e.target.value})}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                          placeholder="https://www.youtube.com/@channelname"
                        />
                        <button
                          type="button"
                          onClick={handleSyncChannel}
                          disabled={isSyncing}
                          className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
                          title="Sync channel details from URL"
                        >
                          {isSyncing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">Sync</span>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="templateId" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Template
                      </label>
                      <select
                        id="templateId"
                        value={inviteForm.templateId}
                        onChange={(e) => setInviteForm({...inviteForm, templateId: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white"
                      >
                        <option value="">Default Template</option>
                        {emailTemplates.map(template => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </select>
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
                  <button 
                    onClick={handleSimulateDetection}
                    className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors flex items-center shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Simulate Detection
                  </button>
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
                      {isClaimsLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-500">Loading claims...</p>
                            </div>
                          </td>
                        </tr>
                      ) : claims.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No copyright claims found.
                          </td>
                        </tr>
                      ) : (
                        claims.map((claim) => (
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
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900">{claim.title}</p>
                                  {claim.notified && (
                                    <span className="flex items-center text-[9px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                                      <Bell className="w-2 h-2 mr-1" />
                                      Notified
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-slate-500 font-mono">ID: {claim.id}</p>
                                  {isDeadlineClose(claim.deadline) && (
                                    <span className="flex items-center text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wider animate-pulse">
                                      <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                                      Urgent
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <p className="text-sm text-slate-700 font-medium">{claim.claimant}</p>
                                {creators.find(c => c.id === claim.creatorId) && (
                                  <p className="text-[10px] text-slate-400">Creator: {creators.find(c => c.id === claim.creatorId)?.name}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">{claim.matchType}</td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                claim.status === 'Active' ? 'bg-red-50 text-red-700 border-red-100' :
                                claim.status === 'Disputed' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                                {claim.status === 'Active' && <ShieldAlert className="w-3 h-3" />}
                                {claim.status === 'Disputed' && <AlertTriangle className="w-3 h-3" />}
                                {claim.status === 'Released' && <CheckCircle2 className="w-3 h-3" />}
                                {claim.status}
                              </div>
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
                        ))
                      )}
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
                              <p className="text-sm font-medium text-slate-500 mb-1">Content ID</p>
                              <p className="text-base font-semibold text-slate-900">{selectedClaim.contentId || 'N/A'}</p>
                            </div>
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
                      <button 
                        onClick={() => handleNotifyCopyright(selectedClaim)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-2"
                      >
                        <Bell className="w-4 h-4" />
                        Notify Creator
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          )}

          {activeTab === 'contentid' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Content ID Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage your original assets and digital fingerprints.</p>
                </div>
                <button 
                  onClick={() => setShowAddAssetModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Add New Asset
                </button>
              </div>

              {/* Asset Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Assets</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{contentIdAssets.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active References</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{contentIdAssets.filter(a => a.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Monetized Assets</h3>
                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{contentIdAssets.filter(a => a.policy === 'Monetize').length}</p>
                </div>
              </div>

              {/* Assets Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base font-semibold text-slate-800">Asset Library</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Asset Title</th>
                        <th className="px-6 py-4 font-semibold">Asset ID</th>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Artist / Owner</th>
                        <th className="px-6 py-4 font-semibold">ISRC</th>
                        <th className="px-6 py-4 font-semibold">Video Content ID</th>
                        <th className="px-6 py-4 font-semibold">Policy</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Last Updated</th>
                        <th className="px-6 py-4 font-semibold">Owner UID</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isAssetsLoading ? (
                        <tr>
                          <td colSpan={11} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-500">Loading assets...</p>
                            </div>
                          </td>
                        </tr>
                      ) : contentIdAssets.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="px-6 py-12 text-center text-slate-500">
                            No assets found in your library.
                          </td>
                        </tr>
                      ) : (
                        contentIdAssets.map((asset) => (
                          <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-slate-900">{asset.title}</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                              {asset.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${asset.type === 'Audio' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                {asset.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">{asset.artist}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                              {asset.isrc || '—'}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                              {asset.videoContentId || '—'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${asset.policy === 'Monetize' ? 'bg-emerald-50 text-emerald-600' : asset.policy === 'Block' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                                {asset.policy}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${asset.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                <span className="text-sm text-slate-700">{asset.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {asset.createdAt?.toDate ? asset.createdAt.toDate().toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                              {asset.ownerUid || '—'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-3">
                                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold">
                                  Manage
                                </button>
                                <button 
                                  onClick={() => handleDeleteAsset(asset.id)}
                                  className="text-red-600 hover:text-red-700 text-sm font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
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
                        <th className="px-6 py-4 font-semibold">Payout Info</th>
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
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-900">{creator.name}</p>
                                    {creator.adminNotes && (
                                      <div className="group/note relative">
                                        <FileText className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover/note:opacity-100 transition-opacity pointer-events-none z-30">
                                          {creator.adminNotes.length > 100 ? creator.adminNotes.substring(0, 100) + '...' : creator.adminNotes}
                                        </div>
                                      </div>
                                    )}
                                  </div>
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
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {creator.payoutOption ? (
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900">{creator.payoutOption}</span>
                                  <span className="text-xs text-slate-500 truncate max-w-[120px]">{creator.payoutDetails}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Not set</span>
                              )}
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

          {activeTab === 'channels' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Channel Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage linked YouTube channels.</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                <p className="text-slate-500">Channel management interface is under development.</p>
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
                {isStaff && (
                  <button 
                    onClick={() => setShowAddEarningModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Earning
                  </button>
                )}
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
                        <th className="px-6 py-4 font-semibold">Total Revenue</th>
                        <th className="px-6 py-4 font-semibold">Creator Share</th>
                        <th className="px-6 py-4 font-semibold">MCN Share</th>
                        <th className="px-6 py-4 font-semibold">Bonus Pool</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isEarningsLoading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
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
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
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
                              <td className="px-6 py-4 text-sm font-bold text-slate-900">${record.totalRevenue?.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-emerald-600 font-semibold">
                                ${record.creatorShare?.toLocaleString()}
                                <span className="text-[10px] text-slate-400 ml-1">({record.creatorPercentage}%)</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">
                                ${record.mcnShare?.toLocaleString()}
                                <span className="text-[10px] text-slate-400 ml-1">({record.mcnPercentage}%)</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-amber-600 font-semibold">
                                ${record.bonusPool?.toLocaleString()}
                                <span className="text-[10px] text-slate-400 ml-1">({record.bonusPercentage}%)</span>
                              </td>
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

          {activeTab === 'withdrawals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">My Withdrawals</h3>
                  <p className="text-slate-500 text-sm mt-1">Request and track your earnings withdrawals.</p>
                </div>
                <button 
                  onClick={() => setShowWithdrawalModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Amount</th>
                        <th className="px-6 py-4 font-semibold">Method</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payouts.filter(p => p.creatorId === user?.uid).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            You haven't made any withdrawal requests yet.
                          </td>
                        </tr>
                      ) : (
                        payouts.filter(p => p.creatorId === user?.uid).map((payout) => (
                          <tr key={payout.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">${payout.amount?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">{payout.method}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                payout.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                payout.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                payout.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                                'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              }`}>
                                {payout.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {payout.createdAt?.toDate ? payout.createdAt.toDate().toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[200px]">{payout.details}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Payout Management</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage and track creator withdrawal requests and payments.</p>
                </div>
                <button 
                  onClick={() => setShowCreatePayoutModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  New Payout
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <select 
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                    value={payoutFilters.status}
                    onChange={(e) => setPayoutFilters({...payoutFilters, status: e.target.value})}
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <select 
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                    value={payoutFilters.creatorId}
                    onChange={(e) => setPayoutFilters({...payoutFilters, creatorId: e.target.value})}
                  >
                    <option value="">All Creators</option>
                    {creators.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payouts Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-semibold">Creator</th>
                        <th className="px-6 py-4 font-semibold">Amount</th>
                        <th className="px-6 py-4 font-semibold">Method</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Reference</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isPayoutsLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-500">Loading payouts...</p>
                            </div>
                          </td>
                        </tr>
                      ) : payouts.filter(p => 
                        (!payoutFilters.status || p.status === payoutFilters.status) &&
                        (!payoutFilters.creatorId || p.creatorId === payoutFilters.creatorId)
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No payout records found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        payouts.filter(p => 
                          (!payoutFilters.status || p.status === payoutFilters.status) &&
                          (!payoutFilters.creatorId || p.creatorId === payoutFilters.creatorId)
                        ).map((payout) => {
                          const creator = creators.find(c => c.id === payout.creatorId);
                          return (
                            <tr key={payout.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                    {creator?.name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{creator?.name || 'Unknown Creator'}</p>
                                    <p className="text-xs text-slate-500">{creator?.email || 'N/A'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-900">${payout.amount?.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-slate-700">{payout.method}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  payout.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  payout.status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                  payout.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                                  'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {payout.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {payout.timestamp?.toDate ? payout.timestamp.toDate().toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500 font-mono">{payout.reference || '---'}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {(payout.status === 'Pending' || payout.status === 'Processing') && (
                                    <>
                                      <button 
                                        onClick={() => handleUpdatePayoutStatus(payout.id, 'Paid')}
                                        className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-bold hover:bg-emerald-100 transition-colors"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => handleUpdatePayoutStatus(payout.id, 'Rejected')}
                                        className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100 transition-colors"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <Search className="w-4 h-4" />
                                  </button>
                                </div>
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

          {activeTab === 'email-templates' && isAdmin && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Email Templates</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage templates for invites and notifications.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingTemplate(null);
                    setNewTemplate({ name: '', subject: '', body: '', variables: ['channelName', 'message', 'inviteLink'] });
                    setShowEmailTemplateModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-sm text-slate-500">
                        <th className="px-6 py-4 font-semibold">Template Name</th>
                        <th className="px-6 py-4 font-semibold">Subject</th>
                        <th className="px-6 py-4 font-semibold">Variables</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isEmailTemplatesLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-500">Loading templates...</p>
                            </div>
                          </td>
                        </tr>
                      ) : emailTemplates.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                            No email templates found.
                          </td>
                        </tr>
                      ) : (
                        emailTemplates.map((template) => (
                          <tr key={template.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-600">{template.subject}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {template.variables?.map((v: string) => (
                                  <span key={v} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono">
                                    {v}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-3">
                                <button 
                                  onClick={() => {
                                    setEditingTemplate(template);
                                    setNewTemplate({
                                      name: template.name,
                                      subject: template.subject,
                                      body: template.body,
                                      variables: template.variables || ['channelName', 'message', 'inviteLink']
                                    });
                                    setShowEmailTemplateModal(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit Template"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteEmailTemplate(template.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Template"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Settings & Administration</h3>
                <p className="text-slate-500 text-sm mt-1">Manage system preferences and user permissions.</p>
              </div>

              {/* Platform Settings Section (Admin Only) */}
              {isAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-slate-900">Platform Features</h4>
                    </div>
                    <button
                      onClick={handleSavePlatformSettings}
                      disabled={isSavingSettings}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                        <p className="text-xs text-slate-500">Disable access for all non-admin users.</p>
                      </div>
                      <div 
                        onClick={() => setPlatformSettings({...platformSettings, maintenanceMode: !platformSettings.maintenanceMode})}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${platformSettings.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${platformSettings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Content ID System</p>
                        <p className="text-xs text-slate-500">Enable or disable the Content ID management features.</p>
                      </div>
                      <div 
                        onClick={() => setPlatformSettings({...platformSettings, enableContentId: !platformSettings.enableContentId})}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${platformSettings.enableContentId ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${platformSettings.enableContentId ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Payout System</p>
                        <p className="text-xs text-slate-500">Allow creators to request withdrawals.</p>
                      </div>
                      <div 
                        onClick={() => setPlatformSettings({...platformSettings, enablePayouts: !platformSettings.enablePayouts})}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${platformSettings.enablePayouts ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${platformSettings.enablePayouts ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Creator Invitations</p>
                        <p className="text-xs text-slate-500">Enable sending invites to new creators.</p>
                      </div>
                      <div 
                        onClick={() => setPlatformSettings({...platformSettings, enableInvites: !platformSettings.enableInvites})}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${platformSettings.enableInvites ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${platformSettings.enableInvites ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Creator Applications</p>
                        <p className="text-xs text-slate-500">Allow new creators to submit applications.</p>
                      </div>
                      <div 
                        onClick={() => setPlatformSettings({...platformSettings, enableApplications: !platformSettings.enableApplications})}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${platformSettings.enableApplications ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${platformSettings.enableApplications ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Verification Section */}
              {isCreator && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-slate-900">KYC Verification</h4>
                  </div>
                  <div className="p-6">
                    {userProfile?.kyc?.status === 'Verified' ? (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-4 text-emerald-800">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                        <div>
                          <p className="font-bold">Account Verified</p>
                          <p className="text-xs">Your identity has been successfully verified.</p>
                        </div>
                      </div>
                    ) : userProfile?.kyc?.status === 'Pending' ? (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-4 text-amber-800">
                        <Clock className="w-6 h-6 text-amber-500" />
                        <div>
                          <p className="font-bold">Verification Pending</p>
                          <p className="text-xs">Our team is currently reviewing your documents.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleKycSubmit} className="space-y-4">
                        {kycStatus && (
                          <div className={`p-4 rounded-lg text-sm font-medium ${kycStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                            {kycStatus.message}
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ID Type</label>
                            <select 
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                              value={kycForm.idType}
                              onChange={(e) => setKycForm({...kycForm, idType: e.target.value})}
                            >
                              <option value="National ID">National ID</option>
                              <option value="Passport">Passport</option>
                              <option value="Driving License">Driving License</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ID Number</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="Enter your ID number"
                              value={kycForm.idNumber}
                              onChange={(e) => setKycForm({...kycForm, idNumber: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload ID Document (Image URL)</label>
                          <div className="flex gap-2">
                            <input 
                              type="url"
                              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="Paste image URL of your ID"
                              value={kycForm.idImage}
                              onChange={(e) => setKycForm({...kycForm, idImage: e.target.value})}
                              required
                            />
                            <button 
                              type="submit"
                              disabled={isKycSubmitting}
                              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                              {isKycSubmitting ? 'Submitting...' : 'Submit KYC'}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-slate-900">User Management</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                          <th className="px-6 py-4 font-semibold">User</th>
                          <th className="px-6 py-4 font-semibold">Email</th>
                          <th className="px-6 py-4 font-semibold">Role</th>
                          <th className="px-6 py-4 font-semibold">Joined</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {isUsersLoading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm text-slate-500">Loading users...</p>
                              </div>
                            </td>
                          </tr>
                        ) : allUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                          </tr>
                        ) : (
                          allUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={u.photoURL || `https://picsum.photos/seed/${u.uid}/40/40`} 
                                    alt={u.name} 
                                    className="w-8 h-8 rounded-full border border-slate-200"
                                  />
                                  <p className="text-sm font-semibold text-slate-900">{u.name || 'Anonymous'}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                  u.role === 'editor' ? 'bg-amber-100 text-amber-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <select 
                                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                  disabled={u.email === 'hosenmdjakir629@gmail.com'} // Prevent self-demotion of super admin
                                >
                                  <option value="admin">Admin</option>
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                  <option value="creator">Creator</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {isCreator && creatorProfile && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                      <PlaySquare className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-slate-900">YouTube Channel Link</h4>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Channel URL</label>
                        <input 
                          type="text"
                          value={creatorProfile.youtubeChannelUrl || ''}
                          onChange={(e) => setCreatorProfile({...creatorProfile, youtubeChannelUrl: e.target.value})}
                          placeholder="https://youtube.com/@yourchannel"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Channel Name</label>
                        <input 
                          type="text"
                          value={creatorProfile.channelName || ''}
                          onChange={(e) => setCreatorProfile({...creatorProfile, channelName: e.target.value})}
                          placeholder="Your Channel Name"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            const creatorRef = doc(db, 'creators', creatorProfile.id);
                            await updateDoc(creatorRef, {
                              youtubeChannelUrl: creatorProfile.youtubeChannelUrl || '',
                              channelName: creatorProfile.channelName || ''
                            });
                            alert("YouTube channel linked successfully!");
                          } catch (error) {
                            console.error("Error linking YouTube channel:", error);
                            alert("Failed to link YouTube channel.");
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Save Channel Link
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-slate-900">Payout Settings</h4>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payout Method</label>
                        <select 
                          value={creatorProfile.payoutOption || 'Bank Transfer'}
                          onChange={(e) => setCreatorProfile({...creatorProfile, payoutOption: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="PayPal">PayPal</option>
                          <option value="Bkash">Bkash</option>
                          <option value="Nagad">Nagad</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payout Details</label>
                        <input 
                          type="text"
                          value={creatorProfile.payoutDetails || ''}
                          onChange={(e) => setCreatorProfile({...creatorProfile, payoutDetails: e.target.value})}
                          placeholder="Enter account number or email"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            const creatorRef = doc(db, 'creators', creatorProfile.id);
                            await updateDoc(creatorRef, {
                              payoutOption: creatorProfile.payoutOption || 'Bank Transfer',
                              payoutDetails: creatorProfile.payoutDetails || ''
                            });
                            alert("Payout settings updated successfully!");
                          } catch (error) {
                            console.error("Error updating payout settings:", error);
                            alert("Failed to update payout settings.");
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Save Payout Settings
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4">System Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                      <p className="text-xs text-slate-500">Receive alerts for new applications and payouts.</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                      <p className="text-xs text-slate-500">Disable public application forms during maintenance.</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videos' && isCreator && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tight">My Video Uploads</h3>
                  <p className="text-slate-500 text-sm mt-1">Upload and manage your video content for the platform.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-indigo-600" />
                      Upload New Video
                    </h4>
                    <form onSubmit={handleVideoUpload} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Video Title</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                          placeholder="Enter video title"
                          value={videoTitle}
                          onChange={e => setVideoTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Video File</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            required
                            accept="video/*"
                            className="hidden"
                            id="video-upload"
                            onChange={e => setVideoFile(e.target.files?.[0] || null)}
                          />
                          <label 
                            htmlFor="video-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Video className="w-8 h-8 text-slate-400 mb-2" />
                              <p className="text-sm text-slate-500 font-medium">
                                {videoFile ? videoFile.name : 'Click to select video'}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">MP4, MOV, AVI up to 500MB</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Thumbnail</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            id="thumbnail-upload"
                            onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                          />
                          <label 
                            htmlFor="thumbnail-upload"
                            className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all"
                          >
                            <div className="flex flex-col items-center justify-center pt-3 pb-4">
                              <Sparkles className="w-6 h-6 text-slate-400 mb-1" />
                              <p className="text-sm text-slate-500 font-medium">
                                {thumbnailFile ? thumbnailFile.name : 'Click to select thumbnail'}
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Blocked Countries (comma separated)</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                          placeholder="e.g. US, GB, CA"
                          value={blockedCountries}
                          onChange={e => setBlockedCountries(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="monetization-toggle"
                          checked={isMonetized}
                          onChange={e => setIsMonetized(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="monetization-toggle" className="text-sm font-medium text-slate-700">Enable Monetization</label>
                      </div>

                      {isUploadingVideo && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium text-slate-500">
                            <span>Uploading...</span>
                            <span>{Math.round(uploadProgress)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div 
                              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={isUploadingVideo || !videoFile}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isUploadingVideo ? 'Uploading...' : 'Upload Video'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Video List */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                      <h4 className="font-semibold text-slate-800">Your Uploaded Videos</h4>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {!creatorProfile?.videos || creatorProfile.videos.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                          <Video className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-500">No videos uploaded yet.</p>
                        </div>
                      ) : (
                        [...creatorProfile.videos].reverse().map((video: any) => (
                          <div key={video.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                <Video className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{video.title}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(video.uploadedAt).toLocaleDateString()}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {(video.size / (1024 * 1024)).toFixed(1)} MB
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-end gap-1">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                                  video.status === 'Live' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {video.status}
                                </span>
                                <div className="flex gap-1">
                                  {video.isMonetized !== false ? (
                                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-bold uppercase rounded border border-indigo-100 flex items-center gap-0.5">
                                      <DollarSign className="w-2 h-2" /> Monetized
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-bold uppercase rounded border border-slate-200 flex items-center gap-0.5">
                                      <ShieldAlert className="w-2 h-2" /> Demonetized
                                    </span>
                                  )}
                                  {video.blockedCountries && video.blockedCountries.length > 0 && (
                                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[8px] font-bold uppercase rounded border border-red-100 flex items-center gap-0.5">
                                      <ShieldAlert className="w-2 h-2" /> {video.blockedCountries.length} Blocked
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => fetchVideoAnalytics(video)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="View Analytics"
                                >
                                  <BarChart3 className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => setEditingVideo(video)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="Edit Video"
                                >
                                  <Settings className="w-5 h-5" />
                                </button>
                                <a 
                                  href={video.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="View Video"
                                >
                                  <Sparkles className="w-5 h-5" />
                                </a>
                                <button 
                                  onClick={() => handleDeleteVideo(video)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete Video"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Video Analytics View */}
                  {selectedVideoForAnalytics && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <BarChart3 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">Video Analytics</h4>
                            <p className="text-xs text-slate-500">{selectedVideoForAnalytics.title}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedVideoForAnalytics(null)}
                          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                      
                      {isAnalyticsLoading ? (
                        <div className="p-12 text-center">
                          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p className="text-slate-500 text-sm">Fetching latest metrics...</p>
                        </div>
                      ) : videoAnalytics ? (
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Views</p>
                              <div className="flex items-end justify-between mt-2">
                                <p className="text-2xl font-bold text-slate-900">{videoAnalytics.views.toLocaleString()}</p>
                                <TrendingUp className="w-4 h-4 text-emerald-500 mb-1" />
                              </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Watch Time (Hrs)</p>
                              <div className="flex items-end justify-between mt-2">
                                <p className="text-2xl font-bold text-slate-900">{videoAnalytics.watchTime.toLocaleString()}</p>
                                <Activity className="w-4 h-4 text-indigo-500 mb-1" />
                              </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Likes</p>
                              <div className="flex items-end justify-between mt-2">
                                <p className="text-2xl font-bold text-slate-900">{videoAnalytics.likes.toLocaleString()}</p>
                                <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <p className="text-sm text-indigo-700">
                              This video is performing <strong>12% better</strong> than your average content. Keep it up!
                            </p>
                          </div>
                          
                          <div className="mt-4 text-right">
                            <p className="text-[10px] text-slate-400 italic">
                              Last updated: {new Date(videoAnalytics.lastUpdated).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center text-slate-500">
                          Failed to load analytics data.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'tools' && activeTab !== 'invites' && activeTab !== 'copyright' && activeTab !== 'creators' && activeTab !== 'applications' && activeTab !== 'earnings' && activeTab !== 'payouts' && activeTab !== 'settings' && activeTab !== 'videos' && (
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Content ID</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                  placeholder="e.g., CONTENT_ID_123" 
                  value={manualClaimForm.contentId} 
                  onChange={e => setManualClaimForm({...manualClaimForm, contentId: e.target.value})} 
                />
              </div>
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

      {/* Withdrawal Modal */}
      {showWithdrawalConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Confirm Withdrawal</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to request a withdrawal of <strong>${withdrawalForm.amount}</strong> via <strong>{withdrawalForm.method}</strong>?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => { setShowWithdrawalConfirm(false); setShowWithdrawalModal(true); }}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async (e) => {
                  setShowWithdrawalConfirm(false);
                  await handleWithdrawalSubmit(e as any);
                }}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Request Withdrawal</h3>
              <button onClick={() => setShowWithdrawalModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowWithdrawalModal(false); setShowWithdrawalConfirm(true); }} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount ($)</label>
                <input 
                  type="number"
                  required
                  min="50"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  placeholder="Min $50.00"
                  value={withdrawalForm.amount}
                  onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Method</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  value={withdrawalForm.method}
                  onChange={(e) => setWithdrawalForm({...withdrawalForm, method: e.target.value})}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="bKash">bKash</option>
                  <option value="Payoneer">Payoneer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Crypto (USDT)">Crypto (USDT)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Details</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                  placeholder="Enter account number, bank details, or wallet address..."
                  value={withdrawalForm.details}
                  onChange={(e) => setWithdrawalForm({...withdrawalForm, details: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isWithdrawing}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : <DollarSign className="w-5 h-5" />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEmailTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{editingTemplate ? 'Edit Template' : 'Create Template'}</h3>
              <button onClick={() => setShowEmailTemplateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEmailTemplate} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
                  <input 
                    type="text" 
                    required
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    placeholder="e.g., Standard Invite"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Subject</label>
                  <input 
                    type="text" 
                    required
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="e.g., Exclusive Invitation to Join OrbitX MCN - {{channelName}}"
                  />
                  <p className="text-xs text-slate-500 mt-1">Available variables: {'{{channelName}}'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Body (HTML)</label>
                  <textarea 
                    required
                    rows={10}
                    value={newTemplate.body}
                    onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                    placeholder="<p>Hello {{channelName}},</p>..."
                  ></textarea>
                  <p className="text-xs text-slate-500 mt-1">Available variables: {'{{channelName}}'}, {'{{message}}'}, {'{{inviteLink}}'}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowEmailTemplateModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  {editingTemplate ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreatePayoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Create New Payout</h3>
              <button onClick={() => setShowCreatePayoutModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePayout} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Creator</label>
                  <select 
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={newPayout.creatorId} 
                    onChange={e => setNewPayout({...newPayout, creatorId: e.target.value})}
                  >
                    <option value="">Select a creator...</option>
                    {creators.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.channelName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    placeholder="0.00"
                    value={newPayout.amount} 
                    onChange={e => setNewPayout({...newPayout, amount: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Method</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    value={newPayout.method} 
                    onChange={e => setNewPayout({...newPayout, method: e.target.value})}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Wise">Wise</option>
                    <option value="Crypto">Crypto (USDT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Reference / Transaction ID</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-mono text-sm" 
                    placeholder="TXN_123456789"
                    value={newPayout.reference} 
                    onChange={e => setNewPayout({...newPayout, reference: e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowCreatePayoutModal(false)} 
                  className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreatingPayout}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {isCreatingPayout && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Create Payout
                </button>
              </div>
            </form>
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
                    disabled={!isAdmin}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`} 
                    value={editingCreator.revenue || 0} 
                    onChange={e => setEditingCreator({...editingCreator, revenue: e.target.value})} 
                  />
                  {!isAdmin && <p className="text-[10px] text-slate-400 mt-1">Only administrators can edit financial data.</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Payout Method</label>
                  <select 
                    disabled={!isAdmin}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    value={editingCreator.payoutMethod || ''}
                    onChange={e => setEditingCreator({...editingCreator, payoutMethod: e.target.value})}
                  >
                    <option value="">Select Method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="bKash">bKash</option>
                    <option value="Payoneer">Payoneer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Crypto (USDT)">Crypto (USDT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Payout Details</label>
                  <input 
                    type="text"
                    disabled={!isAdmin}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    placeholder="Account number, wallet address, etc."
                    value={editingCreator.payoutDetails || ''}
                    onChange={e => setEditingCreator({...editingCreator, payoutDetails: e.target.value})}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Administrative Notes</label>
                <textarea 
                  rows={4}
                  disabled={!isAdmin}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none ${!isAdmin ? 'bg-slate-50 cursor-not-allowed' : ''}`} 
                  placeholder="Add internal notes about management and performance..."
                  value={editingCreator.adminNotes || ''} 
                  onChange={e => setEditingCreator({...editingCreator, adminNotes: e.target.value})} 
                />
                {!isAdmin && <p className="text-[10px] text-slate-400 mt-1">Only administrators can edit internal notes.</p>}
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

      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Edit Video: {editingVideo.title}</h3>
              <button onClick={() => setEditingVideo(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateVideo} className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="monetization-toggle"
                  checked={editingVideo.isMonetized ?? true}
                  onChange={e => setEditingVideo({...editingVideo, isMonetized: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="monetization-toggle" className="text-sm font-medium text-slate-700">Enable Monetization</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Blocked Countries (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                  placeholder="e.g. US, GB, CA"
                  value={editingVideo.blockedCountries?.join(', ') || ''}
                  onChange={e => setEditingVideo({...editingVideo, blockedCountries: e.target.value.split(',').map(c => c.trim()).filter(c => c !== '')})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditingVideo(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Earning Modal */}
      {showAddEarningModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Add New Earning Report</h3>
              <button onClick={() => setShowAddEarningModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddEarning} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Creator</label>
                  <select 
                    required
                    value={newEarning.creatorId}
                    onChange={(e) => setNewEarning({...newEarning, creatorId: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  >
                    <option value="">Choose a creator...</option>
                    {creators.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.channelName})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                    <input 
                      type="month" 
                      required
                      value={newEarning.month}
                      onChange={(e) => setNewEarning({...newEarning, month: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Revenue ($)</label>
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      value={newEarning.totalRevenue}
                      onChange={(e) => setNewEarning({...newEarning, totalRevenue: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Split Engine Configuration (%)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Creator</label>
                      <input 
                        type="number" 
                        value={newEarning.creatorPercentage}
                        onChange={(e) => setNewEarning({...newEarning, creatorPercentage: Number(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">MCN</label>
                      <input 
                        type="number" 
                        value={newEarning.mcnPercentage}
                        onChange={(e) => setNewEarning({...newEarning, mcnPercentage: Number(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Bonus</label>
                      <input 
                        type="number" 
                        value={newEarning.bonusPercentage}
                        onChange={(e) => setNewEarning({...newEarning, bonusPercentage: Number(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className={newEarning.creatorPercentage + newEarning.mcnPercentage + newEarning.bonusPercentage === 100 ? 'text-emerald-600' : 'text-red-600'}>
                      Total: {newEarning.creatorPercentage + newEarning.mcnPercentage + newEarning.bonusPercentage}%
                    </span>
                    {newEarning.creatorPercentage + newEarning.mcnPercentage + newEarning.bonusPercentage !== 100 && (
                      <span className="text-red-600">Must equal 100%</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select 
                    value={newEarning.status}
                    onChange={(e) => setNewEarning({...newEarning, status: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  >
                    <option value="Accrued">Accrued</option>
                    <option value="Ready">Ready</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddEarningModal(false)} 
                  className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isAddingEarning || (newEarning.creatorPercentage + newEarning.mcnPercentage + newEarning.bonusPercentage !== 100)}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center"
                >
                  {isAddingEarning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : 'Add Earning Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Asset Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Delete Asset</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this asset? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => { setShowDeleteConfirm(false); setAssetToDelete(null); }}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteAsset}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Add New Asset</h3>
              <button onClick={() => { setShowAddAssetModal(false); setAssetValidationErrors({}); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddAsset} className="p-8 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Asset Title</label>
                  <input 
                    type="text" 
                    value={newAsset.title}
                    onChange={(e) => {
                      setNewAsset({...newAsset, title: e.target.value});
                      if (assetValidationErrors.title) {
                        const newErrors = {...assetValidationErrors};
                        delete newErrors.title;
                        setAssetValidationErrors(newErrors);
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${assetValidationErrors.title ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none`}
                    placeholder="e.g. Summer Vibes (Original Mix)"
                  />
                  {assetValidationErrors.title && <p className="text-red-500 text-xs mt-1">{assetValidationErrors.title}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Asset Type</label>
                    <select 
                      value={newAsset.type}
                      onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    >
                      <option value="Audio">Audio</option>
                      <option value="Video">Video</option>
                      <option value="Audiovisual">Audiovisual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Match Policy</label>
                    <select 
                      value={newAsset.policy}
                      onChange={(e) => setNewAsset({...newAsset, policy: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    >
                      <option value="Monetize">Monetize</option>
                      <option value="Block">Block</option>
                      <option value="Track">Track</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Artist / Primary Owner</label>
                  <input 
                    type="text" 
                    value={newAsset.artist}
                    onChange={(e) => {
                      setNewAsset({...newAsset, artist: e.target.value});
                      if (assetValidationErrors.artist) {
                        const newErrors = {...assetValidationErrors};
                        delete newErrors.artist;
                        setAssetValidationErrors(newErrors);
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${assetValidationErrors.artist ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none`}
                    placeholder="e.g. DJ OrbitX"
                  />
                  {assetValidationErrors.artist && <p className="text-red-500 text-xs mt-1">{assetValidationErrors.artist}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ISRC / Custom ID (Optional)</label>
                  <input 
                    type="text" 
                    value={newAsset.isrc}
                    onChange={(e) => {
                      setNewAsset({...newAsset, isrc: e.target.value});
                      if (assetValidationErrors.isrc) {
                        const newErrors = {...assetValidationErrors};
                        delete newErrors.isrc;
                        setAssetValidationErrors(newErrors);
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${assetValidationErrors.isrc ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all outline-none`}
                    placeholder="e.g. US-S1Z-24-00001"
                  />
                  {assetValidationErrors.isrc && <p className="text-red-500 text-xs mt-1">{assetValidationErrors.isrc}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                      value={newAsset.status}
                      onChange={(e) => setNewAsset({...newAsset, status: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner UID (Optional)</label>
                    <input 
                      type="text" 
                      value={newAsset.ownerUid}
                      onChange={(e) => setNewAsset({...newAsset, ownerUid: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      placeholder="Creator's UID"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Video Content ID (Optional)</label>
                  <input 
                    type="text" 
                    value={newAsset.videoContentId}
                    onChange={(e) => setNewAsset({...newAsset, videoContentId: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="e.g. vid_12345"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => { setShowAddAssetModal(false); setAssetValidationErrors({}); }} 
                  className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreatingAsset}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center"
                >
                  {isCreatingAsset ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : 'Create Asset'}
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

export default function App() {
  return (
    <CurrencyProvider>
      <RegionProvider>
        <AppContent />
      </RegionProvider>
    </CurrencyProvider>
  );
}
