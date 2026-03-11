import React, { useEffect, useState } from 'react';
import CreatorSubmitForm from './CreatorSubmitForm';
import { Rocket, ArrowRight, Zap, Globe, Shield, BarChart3, CheckCircle, Play, Users, Wallet, BrainCircuit, ChevronRight, Music, FileText, Layers, Scale, DollarSign, Headphones, Check, HelpCircle, MessageSquare, Send, ChevronDown, ChevronUp, Phone, X, CreditCard, RefreshCw, Copy, ExternalLink, TrendingUp, Briefcase, Menu, UserCheck, Calendar, Trophy, BellRing, PieChart, UserSearch, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { TabView } from '../types';

interface HomePageProps {
  onLoginClick: () => void;
  onLogin?: (tab?: TabView) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // FAQ State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
    <div className="min-h-screen bg-orbit-900 text-white font-sans selection:bg-orbit-500 selection:text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-orbit-900/80 backdrop-blur-xl border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
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
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment"
              target="_blank"
              rel="noreferrer"
              className="px-4 sm:px-6 py-2.5 bg-white text-orbit-900 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center gap-2"
            >
              <span className="hidden xs:block">Apply Now</span>
              <span className="xs:hidden">Apply</span>
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
              <a href="#support" onClick={(e) => { scrollToSection(e, 'support'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-gray-300 hover:text-white">Support</a>
              <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-indigo-400">Log In</button>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full py-3 bg-white text-orbit-900 rounded-xl font-bold text-center"
              >
                Apply Now
              </motion.a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-gradient-to-br from-orbit-900 to-black">
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
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            YouTube Certified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">MCN Network in Bangladesh</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Stop losing money to re-uploads. Our YouTube Certified Content ID services ensure that you get paid for every view your content generates worldwide.
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
                y: -4,
                boxShadow: "0px 10px 25px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(99, 102, 241, 0)", "0px 0px 20px rgba(99, 102, 241, 0.4)", "0px 0px 0px rgba(99, 102, 241, 0)"] 
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
              href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Apply Now</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-30"></div>
            <div className="relative bg-orbit-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2426&auto=format&fit=crop" alt="CMS Dashboard Preview" className="w-full h-auto opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-orbit-900 via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Value Pillars */}
      <section id="features" className="py-24 relative z-10 bg-orbit-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Top Creators Choose OrbitX MCN</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We provide the infrastructure so you can focus on the content.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Briefcase} 
              title="Brand Deals" 
              desc="Multi-Channel Networks (MCNs) have dedicated sales teams that connect you directly with advertisers for sponsorships and promotional campaigns." 
              color="text-indigo-400" 
              gradient="from-indigo-500/20 to-blue-500/5" 
            />
            <FeatureCard 
              icon={Shield} 
              title="Content ID & Protection" 
              desc="Advanced tools to manage copyright claims and protect your original videos from being reuploaded or misused by others." 
              color="text-red-400" 
              gradient="from-red-500/20 to-orange-500/5" 
              onClick={() => onLogin && onLogin(TabView.CONTENT_ID)}
            />
            <FeatureCard 
              icon={Music} 
              title="Production Resources" 
              desc="Access to professional studios, high-end video equipment, and royalty-free music & sound effect libraries (e.g., Epidemic Sound)." 
              color="text-yellow-400" 
              gradient="from-yellow-500/20 to-orange-500/5" 
            />
            <FeatureCard 
              icon={Users} 
              title="Cross-Promotion" 
              desc="Opportunities to collaborate with other creators within the same network, helping grow audiences across channels." 
              color="text-purple-400" 
              gradient="from-purple-500/20 to-indigo-500/5" 
            />
            <FeatureCard 
              icon={DollarSign} 
              title="Monetization Support" 
              desc="Assistance with complex tax forms, resolving payment issues, and optimizing ad revenue performance." 
              color="text-green-400" 
              gradient="from-green-500/20 to-emerald-500/5" 
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Channel Management" 
              desc="Expert guidance on SEO, thumbnail optimization, and audience retention strategies to grow your channel effectively." 
              color="text-blue-400" 
              gradient="from-blue-500/20 to-cyan-500/5" 
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Increased Earnings" 
              desc="Higher income potential through premium ads and direct brand deals compared to the standard YouTube Partner Program." 
              color="text-orange-400" 
              gradient="from-orange-500/20 to-red-500/5" 
            />
            <FeatureCard 
              icon={Zap} 
              title="Fast Payout" 
              desc="Flexible monthly payments without waiting for AdSense thresholds, including options like mobile financial services (MFS) or local bank transfers." 
              color="text-cyan-400" 
              gradient="from-cyan-500/20 to-blue-500/5" 
            />
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section id="advanced-features" className="py-24 relative z-10 bg-orbit-900">
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
                       <img src="https://images.unsplash.com/photo-1551033406-61bc49d7816e?q=80&w=2000&auto=format&fit=crop" alt="Advanced Tools" className="rounded-2xl w-full" />
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
                                    {activeFaq === idx ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-gray-500" />}
                                </button>
                                {activeFaq === idx && <div className="p-5 pt-0 text-gray-400 leading-relaxed border-t border-orbit-700/50 mt-2">{faq.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-orbit-800 border border-orbit-700 rounded-3xl p-8 shadow-xl">
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
                    <CreatorSubmitForm />
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
        </div>
      </footer>
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
    className={`p-8 rounded-3xl bg-orbit-800/50 border border-white/5 hover:bg-orbit-800 transition-all group relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    <div className="relative z-10">
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="w-14 h-14 rounded-2xl bg-orbit-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
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