import React, { useEffect, useState } from 'react';
import AIChatbot from './AIChatbot';
import { Rocket, ArrowRight, Zap, Globe, Shield, BarChart3, CheckCircle, Play, Users, Wallet, BrainCircuit, ChevronRight, Music, FileText, Layers, Scale, DollarSign, Headphones, Check, HelpCircle, MessageSquare, Send, ChevronDown, ChevronUp, Phone, X, CreditCard, RefreshCw, Copy, ExternalLink, TrendingUp, Briefcase, Menu } from 'lucide-react';

interface HomePageProps {
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  
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

  const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('sending');
      setTimeout(() => {
          setFormStatus('success');
          setContactForm({ name: '', email: '', message: '' });
          setTimeout(() => setFormStatus('idle'), 3000);
      }, 1500);
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
            <a 
              href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment"
              target="_blank"
              rel="noreferrer"
              className="px-4 sm:px-6 py-2.5 bg-white text-orbit-900 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg shadow-white/10 flex items-center gap-2"
            >
              <span className="hidden xs:block">Apply Now</span>
              <span className="xs:hidden">Apply</span>
              <ArrowRight size={16} />
            </a>
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
              <a href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment" target="_blank" rel="noreferrer" className="w-full py-3 bg-white text-orbit-900 rounded-xl font-bold text-center">Apply Now</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-gradient-to-br from-orbit-900 to-black">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Accepting New Creators for 2026
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            YouTube Certified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">MCN Network in Bangladesh</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Stop losing money to re-uploads. Our YouTube Certified Content ID services ensure that you get paid for every view your content generates worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <a href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-bold text-lg text-white shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
              Apply Now
            </a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="w-full sm:w-auto px-8 py-4 bg-orbit-800 hover:bg-orbit-700 border border-orbit-700 rounded-2xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2 group">
              <DollarSign size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Service Charges</span>
            </a>
          </div>

          <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-30"></div>
            <div className="relative bg-orbit-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2426&auto=format&fit=crop" alt="CMS Dashboard Preview" className="w-full h-auto opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-orbit-900 via-transparent to-transparent"></div>
            </div>
          </div>
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
                       <ToolItem icon={Layers} title="Asset Labels & Ownership" desc="Precise control over territorial rights and claiming rules across regions." />
                       <ToolItem icon={Scale} title="Conflict Resolution" desc="We handle the manual work of resolving copyright disputes so you don't have to." />
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative z-10 bg-orbit-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-6 uppercase tracking-wider">Service Charge Pricing</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Transparent Revenue Share</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">No hidden fees. No upfront costs. We only win when you win. Our service charge is based on a simple revenue split model.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-orbit-800/40 border border-orbit-700 hover:border-indigo-500/50 transition-all group relative flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">20%</span>
                  <span className="text-gray-400 text-sm">Service Charge</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">Perfect for rising creators looking for professional protection.</p>
              </div>
              <div className="space-y-4 mb-10 flex-1">
                <PricingFeature text="80/20 Revenue Split" />
                <PricingFeature text="Content ID Protection" />
                <PricingFeature text="Monthly Payouts" />
                <PricingFeature text="Standard SEO Tools" />
                <PricingFeature text="Community Support" />
              </div>
              <a href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment" target="_blank" rel="noreferrer" className="w-full py-4 bg-orbit-700 hover:bg-orbit-600 border border-orbit-600 rounded-2xl font-bold text-white transition-all text-center">
                Apply Now
              </a>
            </div>

            {/* Growth Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-transparent border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 relative flex flex-col h-full transform md:-translate-y-4">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Most Popular</div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2 text-indigo-400">Growth</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">10%</span>
                  <span className="text-gray-400 text-sm">Service Charge</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">For established creators ready to scale their brand globally.</p>
              </div>
              <div className="space-y-4 mb-10 flex-1">
                <PricingFeature text="90/10 Revenue Split" />
                <PricingFeature text="Priority Content ID" />
                <PricingFeature text="Weekly Payouts" />
                <PricingFeature text="Dedicated Account Manager" />
                <PricingFeature text="Brand Deal Access" />
                <PricingFeature text="Advanced Analytics" />
              </div>
              <a href="https://shop.bkash.com/online-shop01978481393/paymentlink/default-payment" target="_blank" rel="noreferrer" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-white shadow-xl shadow-indigo-500/20 transition-all text-center">
                Apply Now
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-3xl bg-orbit-800/40 border border-orbit-700 hover:border-purple-500/50 transition-all group flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">5%</span>
                  <span className="text-gray-400 text-sm">Service Charge</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">Custom solutions for media houses and top-tier talent.</p>
              </div>
              <div className="space-y-4 mb-10 flex-1">
                <PricingFeature text="95/5 Revenue Split" />
                <PricingFeature text="White-Glove Support" />
                <PricingFeature text="Instant Payouts" />
                <PricingFeature text="Custom Funding & Loans" />
                <PricingFeature text="Full Legal Protection" />
                <PricingFeature text="Multi-Channel CMS" />
              </div>
              <button onClick={onLoginClick} className="w-full py-4 bg-orbit-700 hover:bg-orbit-600 border border-orbit-600 rounded-2xl font-bold text-white transition-all">
                Contact Sales
              </button>
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
                         <a href="https://wa.me/8801927694437" target="_blank" rel="noreferrer" className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-xs font-bold rounded-lg transition-colors">Chat</a>
                    </div>
                    <p className="text-gray-400 mb-8">Have questions about joining? Fill out the form below and our recruitment team will get back to you within 24 hours.</p>
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input type="text" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} placeholder="Your Name" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
                            <input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} placeholder="you@example.com" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
                        </div>
                        <textarea value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} placeholder="Tell us about your channel..." className="w-full h-32 bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors resize-none" required />
                        <button type="submit" disabled={formStatus === 'sending' || formStatus === 'success'} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${formStatus === 'success' ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                            {formStatus === 'idle' && <><span>Send Message</span><Send size={18} /></>}
                            {formStatus === 'sending' && <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>Sending...</span></>}
                            {formStatus === 'success' && <><CheckCircle size={18} /><span>Message Sent!</span></>}
                        </button>
                    </form>
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
      <AIChatbot />
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon: Icon, title, desc, color, gradient }: { icon: any, title: string, desc: string, color: string, gradient: string }) => (
  <div className="p-8 rounded-3xl bg-orbit-800/50 border border-white/5 hover:bg-orbit-800 transition-all group relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-orbit-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Icon className={`w-7 h-7 ${color}`} /></div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ToolItem = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="flex items-start gap-4">
        <div className="p-2 bg-orbit-800 border border-orbit-700 rounded-lg shrink-0"><Icon className="text-indigo-400 w-5 h-5" /></div>
        <div>
            <h4 className="text-white font-bold mb-1">{title}</h4>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    </div>
);

const PricingFeature = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <div className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Check size={12} className="text-indigo-400" />
        </div>
        <span className="text-gray-300 text-sm">{text}</span>
    </div>
);

export default HomePage;