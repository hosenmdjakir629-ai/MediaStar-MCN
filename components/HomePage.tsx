import React, { useEffect, useState, lazy, Suspense } from 'react';
const CreatorSubmitForm = lazy(() => import('./CreatorSubmitForm'));
import { Rocket, ArrowRight, Zap, Globe, Shield, BarChart3, CheckCircle, Play, Users, Wallet, BrainCircuit, ChevronRight, Music, FileText, Layers, Scale, DollarSign, Headphones, Check, HelpCircle, MessageSquare, Send, ChevronDown, ChevronUp, Phone, X, CreditCard, RefreshCw, Copy, ExternalLink, TrendingUp, Briefcase, Menu, UserCheck, Calendar, Trophy, BellRing, PieChart, UserSearch, Lock, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { TabView } from '../types';

interface HomePageProps {
  onLoginClick: () => void;
  onLogin?: (tab?: TabView) => void;
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onLogin, onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  
  // FAQ State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const FAQS = [
    { q: "What are the requirements to join OrbitX MCN?", a: "We typically look for channels with at least 1,000 subscribers and 4,000 watch hours, adhering to YouTube's monetization policies. However, we review high-potential channels individually." },
    { q: "What is the revenue share model?", a: "Our standard contract starts at an 80/20 split (80% to you). High-performing partners can qualify for 90/10 or even 95/5 splits based on monthly view count." },
    { q: "How often do I get paid?", a: "We offer monthly payouts by default between the 21st and 26th. Qualifying growth partners can receive weekly payouts. We support Bank Transfer and PayPal." },
    { q: "Can you help with copyright claims?", a: "Yes! Our Content ID team manually handles dispute resolution, protecting your content from piracy and helping you claim revenue from third-party re-uploads." },
    { q: "Is there a lock-in contract?", a: "We offer flexible 30-day rolling contracts for our Starter plan. Growth and Enterprise plans may have specific terms to unlock advanced funding and dedicated support." },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans selection:bg-orbit-500 selection:text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-orbit-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{animationDelay: '2s'}}></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-surface-950/80 backdrop-blur-xl border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket className="text-white w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              <span className="font-bold">OrbitX MCN</span>
              <span className="text-sm font-medium ml-2 opacity-80">- Powered by MediaStar</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition-colors cursor-pointer">Features</a>
            <a href="#advanced-features" onClick={(e) => scrollToSection(e, 'advanced-features')} className="hover:text-white transition-colors cursor-pointer">Advanced</a>
            <a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="hover:text-white transition-colors cursor-pointer">Tools</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</a>
            <a href="#support" onClick={(e) => scrollToSection(e, 'support')} className="hover:text-white transition-colors cursor-pointer">Support</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="px-5 py-2.5 text-sm font-bold text-white hover:text-indigo-300 transition-colors hidden sm:block"
            >
              Log In
            </button>
            <motion.a 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/8801927694437"
              target="_blank"
              rel="noreferrer"
              className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <span className="hidden xs:block">Book Free Consultation</span>
              <span className="xs:hidden">Book</span>
              <ArrowRight size={16} />
            </motion.a>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-orbit-900/95 backdrop-blur-xl border-b border-white/10 py-8 px-6 space-y-6 animate-fade-in">
            <div className="flex flex-col space-y-6">
              <a href="#features" onClick={(e) => { scrollToSection(e, 'features'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-gray-300 hover:text-white">Features</a>
              <a href="#tools" onClick={(e) => { scrollToSection(e, 'tools'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-gray-300 hover:text-white">Tools</a>
              <a href="#pricing" onClick={(e) => { scrollToSection(e, 'pricing'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-gray-300 hover:text-white">Pricing</a>
              <a href="#support" onClick={(e) => { scrollToSection(e, 'support'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-gray-300 hover:text-white">Support</a>
              <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-indigo-400">Log In</button>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/8801927694437"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-bold text-center shadow-lg shadow-emerald-500/20"
              >
                Book Free Consultation
              </motion.a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-gradient-to-br from-surface-950 to-orbit-950">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Accepting New Creators for 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-9xl font-display uppercase tracking-tighter mb-8 leading-[0.85] text-white"
          >
            Empowering the Next Generation of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">YouTube Creators</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join 100+ creators with 10M+ subscribers and unlock brand deals, collaborations, and global growth opportunities.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(16, 185, 129, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/8801927694437"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3"
            >
              <Phone size={20} className="text-white" />
              <span>Free Consultation</span>
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 pointer-events-none"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Explore Network</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* Core Value Pillars - Bento Grid Style */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display uppercase mb-4">Why Top Creators Choose OrbitX MCN</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We don't just manage channels; we build sustainable media businesses for the world's most ambitious creators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-colors"></div>
              <div>
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={28} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Instant Growth Acceleration</h3>
                <p className="text-gray-400 max-w-md">Access proprietary algorithms and cross-promotion networks that have helped our partners gain over 500M+ subscribers combined.</p>
              </div>
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-orbit-900" alt="Creator" loading="lazy" decoding="async" />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">+2,400 Creators Joined</span>
              </div>
            </motion.div>

            {/* Small Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group"
            >
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:rotate-12 transition-transform">
                <Wallet size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">Monthly Payouts</h3>
              <p className="text-gray-400">Stop waiting 60 days for your revenue. We offer reliable monthly payouts via Bank, PayPal, or Crypto.</p>
            </motion.div>

            {/* Small Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group"
            >
              <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Copyright Shield</h3>
              <p className="text-gray-400">Manual Content ID management and legal support to protect your intellectual property globally.</p>
            </motion.div>

            {/* Large Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-orbit-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 group"
            >
              <div className="flex-1">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
                  <BarChart3 size={28} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Advanced Analytics</h3>
                <p className="text-gray-400">Deep-dive into your audience data with our custom CMS. Track performance, revenue, and trends across all platforms in one place.</p>
              </div>
              <div className="w-full md:w-64 h-48 bg-black/40 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
                <div className="flex items-end gap-1 h-full">
                  {[40, 70, 45, 90, 65, 80, 50, 100, 85].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creator Marquee */}
      <section className="py-20 overflow-hidden border-y border-white/5 bg-black/20">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1,2,3,4,5,6,1,2,3,4,5,6].map((i, idx) => (
            <div key={idx} className="flex items-center gap-4 px-12">
              <img src={`https://i.pravatar.cc/100?u=creator${i}`} className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all" alt="Creator" loading="lazy" decoding="async" />
              <span className="text-2xl font-display uppercase opacity-20 hover:opacity-100 transition-opacity cursor-default">Creator {i}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section id="advanced-features" className="py-24 relative z-10 bg-surface-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Platform Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We've added powerful tools to help you manage your network more effectively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={UserCheck} title="Automated Onboarding" desc="Guided, multi-step process for new creators to sign contracts and link channels." color="text-indigo-400" gradient="from-indigo-500/20 to-blue-500/5" />
            <FeatureCard icon={Calendar} title="Content Calendar" desc="Shared calendar for scheduling video releases and managing content strategies." color="text-purple-400" gradient="from-purple-500/20 to-indigo-500/5" />
            <FeatureCard icon={Trophy} title="Leaderboards" desc="Gamification system to encourage healthy competition among creators." color="text-yellow-400" gradient="from-yellow-500/20 to-orange-500/5" />
            <FeatureCard icon={BellRing} title="Automated Notifications" desc="Robust system for alerts on payments, brand deals, and claim resolutions." color="text-red-400" gradient="from-red-500/20 to-orange-500/5" />
            <FeatureCard icon={PieChart} title="Financial Analytics" desc="Deep breakdown of revenue sources and tax estimation tools." color="text-green-400" gradient="from-green-500/20 to-emerald-500/5" />
            <FeatureCard icon={UserSearch} title="Recruitment CRM" desc="Dedicated pipeline to track potential creator leads." color="text-blue-400" gradient="from-blue-500/20 to-cyan-500/5" />
            <FeatureCard icon={Globe} title="Multi-Platform Analytics" desc="Unified view of performance across YouTube, TikTok, and Instagram." color="text-cyan-400" gradient="from-cyan-500/20 to-blue-500/5" />
            <FeatureCard icon={MessageSquare} title="Admin-Creator Chat" desc="Secure, in-app messaging for faster communication." color="text-orange-400" gradient="from-orange-500/20 to-red-500/5" />
            <FeatureCard icon={Lock} title="Access Control" desc="Granular permissions for MCN staff roles." color="text-pink-400" gradient="from-pink-500/20 to-rose-500/5" />
          </div>
        </div>
      </section>

      {/* AI Strategist Integration Section */}
      <section className="py-24 relative z-10 overflow-hidden bg-orbit-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-[3rem] border border-white/10 p-8 md:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orbit-500/10 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-orbit-500/20 transition-colors duration-700"></div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orbit-500/10 border border-orbit-500/20 text-sm font-bold text-orbit-400 mb-6 uppercase tracking-widest">
                  <BrainCircuit size={18} className="animate-pulse" />
                  AI-Powered Growth
                </div>
                <h2 className="text-4xl md:text-6xl font-display uppercase mb-6 leading-tight">Your Personal <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-black">AI Strategist</span></h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Get 24/7 expert advice on content strategy, SEO optimization, and audience growth. Our AI is trained on data from thousands of successful channels to give you the competitive edge.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-sm font-medium text-gray-300">
                    <CheckCircle size={16} className="text-emerald-400" />
                    SEO Optimization
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-sm font-medium text-gray-300">
                    <CheckCircle size={16} className="text-emerald-400" />
                    Content Ideas
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-sm font-medium text-gray-300">
                    <CheckCircle size={16} className="text-emerald-400" />
                    Trend Analysis
                  </div>
                </div>
                <button 
                  onClick={() => {
                    // Trigger the global chatbot
                    const chatbotBtn = document.querySelector('button[class*="fixed bottom-8 right-8"]') as HTMLButtonElement;
                    if (chatbotBtn) chatbotBtn.click();
                  }}
                  className="px-8 py-4 bg-white text-orbit-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/10 flex items-center gap-2 mx-auto lg:mx-0"
                >
                  <MessageSquare size={20} />
                  Chat with AI Now
                </button>
              </div>
              
              <div className="w-full lg:w-[450px] aspect-square relative">
                <div className="absolute inset-0 bg-orbit-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="relative w-full h-full bg-surface-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orbit-500/20 flex items-center justify-center text-orbit-400 border border-orbit-500/20">
                      <Bot size={24} />
                    </div>
                    <div>
                      <div className="text-white font-bold">OrbitX AI</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span> Active
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm text-gray-300 leading-relaxed">
                      "I've analyzed your niche. Based on current trends, a 10-minute deep dive into 'AI Tools for Creators' would likely perform 40% better than your average video."
                    </div>
                    <div className="bg-orbit-600 p-4 rounded-2xl rounded-tr-none text-sm text-white font-medium self-end ml-12">
                      "That sounds great! What keywords should I use?"
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm text-gray-300 leading-relaxed">
                      "Focus on 'Generative AI', 'Content Automation', and 'Creator Economy'. These have high search volume and low competition right now."
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                    <div className="flex-1 h-10 bg-white/5 rounded-xl border border-white/10"></div>
                    <div className="w-10 h-10 bg-orbit-600 rounded-xl flex items-center justify-center text-white">
                      <Send size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced CMS Tools Section */}
      <section id="tools" className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="w-full md:w-1/2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-6 uppercase tracking-wider">For Media Houses</div>
                   <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Advanced Tools for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Modern Media Operations</span></h2>
                   <p className="text-gray-400 text-lg mb-8 leading-relaxed">Managing thousands of assets requires more than a standard dashboard. Our proprietary CMS tools streamline your workflow.</p>
                   <div className="space-y-6">
                       <ToolItem icon={FileText} title="Bulk Metadata Editing" desc="Update thousands of video descriptions, tags, and titles in seconds." />
                       <ToolItem icon={Layers} title="Asset Labels & Ownership" desc="Precise control over territorial rights and claiming rules across regions." onClick={() => onLogin && onLogin(TabView.CONTENT_ID)} />
                       <ToolItem icon={Scale} title="Conflict Resolution" desc="We handle the manual work of resolving copyright disputes so you don't have to." onClick={() => onLogin && onLogin(TabView.CONTENT_ID)} />
                       <ToolItem icon={BarChart3} title="Detailed Reporting" desc="Transparent, downloadable financial reports that make accounting a breeze." />
                   </div>
               </div>
               <div className="w-full md:w-1/2 relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-3xl blur-3xl opacity-50"></div>
                   <div className="relative bg-orbit-800 border border-orbit-700 rounded-3xl p-2 shadow-2xl">
                       <img src="https://images.unsplash.com/photo-1551033406-61bc49d7816e?q=80&w=2000&auto=format&fit=crop" alt="Advanced Tools" className="rounded-2xl w-full" loading="lazy" decoding="async" />
                       <div className="absolute -bottom-6 -left-6 bg-orbit-800 border border-orbit-600 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                           <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><CheckCircle size={20} /></div>
                           <div>
                               <div className="text-xs text-gray-400">Claims Resolved</div>
                               <div className="text-sm font-bold text-white">1,240 This Week</div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display uppercase mb-4">Transparent Membership</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">One simple fee to unlock the full power of the OrbitX MCN network.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="relative bg-orbit-800 border-2 border-indigo-500/30 rounded-[2.5rem] p-10 md:p-16 overflow-hidden group shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] hover:shadow-[0_0_80px_-12px_rgba(99,102,241,0.5)]"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full -ml-16 -mb-16"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-6 uppercase tracking-wider">Lifetime Access</div>
                  <h3 className="text-5xl md:text-7xl font-display mb-4">$20</h3>
                  <p className="text-2xl font-bold text-white mb-6">One-Time Join Fee</p>
                  <p className="text-gray-400 leading-relaxed mb-8">
                    Join the OrbitX MCN creator network and unlock access to exclusive creator benefits.
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orbit-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl shadow-white/10"
                  >
                    Get Started Now
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
                
                <div className="w-full md:w-72 space-y-4">
                  {[
                    "Brand Partnerships",
                    "Content Protection",
                    "Creator Collaboration",
                    "Professional Growth Support",
                    "Global Channel Scaling"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Check size={14} />
                      </div>
                      <span className="text-sm font-medium text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <p className="text-center text-gray-500 text-sm mt-8">
              Members gain opportunities for brand partnerships, content protection, collaboration with other creators, and professional growth support to scale their channels globally.
            </p>
          </div>
        </div>
      </section>

      {/* Support & FAQ Section */}
      <section id="support" className="py-24 relative z-10 bg-orbit-800/20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><HelpCircle size={24} /></div>
                        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {FAQS.map((faq, idx) => (
                            <div key={idx} className="border border-orbit-700 bg-orbit-800/40 rounded-xl overflow-hidden">
                                <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left hover:bg-orbit-800/60 transition-colors">
                                    <span className="font-medium text-lg text-gray-200">{faq.q}</span>
                                    <motion.div
                                        animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className={activeFaq === idx ? "text-indigo-400" : "text-gray-500"} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {activeFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="p-5 pt-0 text-gray-400 leading-relaxed border-t border-orbit-700/50 mt-2">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
                    <div id="apply" className="bg-orbit-800 border border-orbit-700 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><MessageSquare size={24} /></div>
                            <h2 className="text-3xl font-bold">Get In Touch</h2>
                        </div>
                    <div className="mb-8 p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 group hover:border-green-500/40 transition-colors cursor-default">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform"><Phone size={24} /></div>
                        <div>
                            <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-0.5">Urgent Inquiry?</div>
                            <div className="text-xl font-bold text-white font-mono">01927694437</div>
                            <div className="text-xs text-gray-400">WhatsApp Support Available</div>
                        </div>
                          <motion.a 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href="https://wa.me/8801927694437" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Chat
                          </motion.a>
                    </div>
                    <Suspense fallback={<div className="h-40 flex items-center justify-center text-gray-500">Loading form...</div>}>
                        <CreatorSubmitForm />
                    </Suspense>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-orbit-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center"><Rocket className="text-white w-4 h-4" /></div>
            <span className="text-lg font-bold text-white">
              <span className="font-bold">OrbitX MCN</span>
              <span className="text-xs font-medium ml-2 opacity-60">- Powered by MediaStar</span>
            </span>
          </div>
          <div className="text-sm text-gray-500">© 2026 OrbitX MCN Network. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setIsTermsModalOpen(true)}
              className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => setIsCookieModalOpen(true)}
              className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
            <button 
              onClick={() => setIsRefundModalOpen(true)}
              className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-orbit-800 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display uppercase">Privacy Policy</h2>
                  <button 
                    onClick={() => setIsPrivacyModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6 text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <p>We respect your privacy and are committed to protecting your personal information.</p>
                  <p>We may collect basic information such as your name, email address, and contact details when you use our website or apply for our services.</p>
                  <p>This information is used only to provide and improve our services, communicate with you, and process your requests.</p>
                  <p>We do not sell, trade, or share your personal information with third parties without your consent, except where required by law.</p>
                  <p>We use secure systems to protect your data. However, no method of transmission over the internet is 100% secure.</p>
                  <p>By using our website, you agree to this Privacy Policy.</p>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => setIsPrivacyModalOpen(false)}
                    className="w-full py-4 bg-white text-orbit-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    Got it, thanks
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {isTermsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTermsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-orbit-800 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display uppercase">Terms & Conditions</h2>
                  <button 
                    onClick={() => setIsTermsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6 text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <p>By accessing and using our website, you agree to comply with the following terms and conditions.</p>
                  <p>OrbitX MCN provides services related to content monetization, copyright protection, and creator support.</p>
                  <p>Users must provide accurate information when applying for our services.</p>
                  <p>We reserve the right to accept or reject any application at our discretion.</p>
                  <p>Any misuse of our services, including fraudulent activity or violation of platform policies (such as YouTube), may result in termination of service.</p>
                  <p>We may update these terms at any time without prior notice.</p>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => setIsTermsModalOpen(false)}
                    className="w-full py-4 bg-white text-orbit-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    I Agree
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cookie Policy Modal */}
      <AnimatePresence>
        {isCookieModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCookieModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-orbit-800 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display uppercase">Cookie Policy</h2>
                  <button 
                    onClick={() => setIsCookieModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6 text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <p>Our website uses cookies to improve user experience and analyze website traffic.</p>
                  <p>Cookies are small data files stored on your device that help us understand how users interact with our site.</p>
                  <div>
                    <p className="font-bold text-white mb-2">We use cookies for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Website functionality</li>
                      <li>Analytics and performance</li>
                      <li>Improving user experience</li>
                    </ul>
                  </div>
                  <p>You can choose to disable cookies through your browser settings. However, some parts of the website may not function properly.</p>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => setIsCookieModalOpen(false)}
                    className="w-full py-4 bg-white text-orbit-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    Accept Cookies
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Refund Policy Modal */}
      <AnimatePresence>
        {isRefundModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRefundModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-orbit-800 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display uppercase">Refund Policy</h2>
                  <button 
                    onClick={() => setIsRefundModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6 text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <p>At OrbitX MCN, we aim to provide high-quality services to all creators.</p>
                  <p>Due to the nature of digital services, all payments made are generally non-refundable.</p>
                  <p>However, in special cases where a service has not been delivered as promised, users may request a review.</p>
                  <p>Refund requests must be submitted within 7 days of payment.</p>
                  <p>Each case will be evaluated individually, and the final decision will be made by our team.</p>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => setIsRefundModalOpen(false)}
                    className="w-full py-4 bg-white text-orbit-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon: Icon, title, desc, color, gradient, onClick }: { icon: any, title: string, desc: string, color: string, gradient: string, onClick?: () => void }) => (
  <motion.div 
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 20 }}
    viewport={{ once: true }}
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    <div className="relative z-10">
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="w-14 h-14 rounded-2xl bg-orbit-900/80 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
      >
        <Icon className={`w-7 h-7 ${color}`} />
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const ToolItem = ({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick?: () => void }) => (
    <div 
        className={`flex items-start gap-4 p-4 rounded-xl hover:bg-orbit-800/50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
        <div className="p-2 bg-orbit-800 border border-orbit-700 rounded-lg shrink-0"><Icon className="text-indigo-400 w-5 h-5" /></div>
        <div>
            <h4 className="text-white font-bold mb-1">{title}</h4>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    </div>
);

export default HomePage;