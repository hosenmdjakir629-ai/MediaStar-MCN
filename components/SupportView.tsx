import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, ShieldQuestion, FileText, Send, CheckCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const SupportView: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;
    
    setFormStatus('sending');
    // Simulate API call
    setTimeout(() => {
        setFormStatus('sent');
        setFormData({ subject: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  const faqs = [
    { 
        q: "How do I link my YouTube channel?", 
        a: "Navigate to the Creators tab and click 'Create New' or 'Invite Channel'. For O&O channels, use the OAuth flow to grant CMS permissions. For Affiliate channels, send an invite to the creator's email." 
    },
    { 
        q: "When are payouts processed?", 
        a: "Payouts are automatically processed between the 21st and 26th of each month. This covers earnings from the previous month (e.g., January earnings are paid in late February)." 
    },
    { 
        q: "How do I dispute a Content ID claim?", 
        a: "If you believe a claim is incorrect, go to the CMS dashboard, locate the asset ID, and file a dispute. Our legal team reviews all disputes within 48 hours before submitting to YouTube." 
    },
    { 
        q: "What is the standard revenue share?", 
        a: "Our base tier starts at 80/20 (80% to creator). Performance bonuses can increase this to 90/10 or 95/5. Check your contract details in the Settings tab." 
    },
    { 
        q: "Why is my payment status 'Pending'?", 
        a: "Payments may remain pending if your cumulative earnings haven't reached the $100 threshold, or if banking details are incorrect. Please verify your payment method in the Payouts tab." 
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       {/* Header */}
       <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-3xl p-8 border border-green-500/30 relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white mb-4">Support Center</h1>
                <p className="text-green-100 max-w-2xl text-lg">
                    Need assistance with your channel or payments? Our dedicated support team is here to help you 24/7.
                </p>
            </div>
            {/* Background Decor */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 transform translate-x-10">
                 <MessageCircle size={300} />
             </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Contact Methods */}
            <div className="space-y-6">
                {/* Direct Contact Card */}
                <div className="bg-orbit-800 border border-orbit-700 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Phone className="text-green-400" />
                        Direct Support
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700/50 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 shrink-0">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400 mb-1">WhatsApp Support (Priority)</div>
                                <div className="text-2xl font-bold text-white tracking-wide font-mono">01927694437</div>
                                <a 
                                    href="https://wa.me/8801927694437" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-block mt-2 text-sm text-green-400 hover:text-green-300 font-medium hover:underline flex items-center gap-1"
                                >
                                    <span>Chat Now</span>
                                    <span>&rarr;</span>
                                </a>
                            </div>
                        </div>

                        <div className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700/50 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400 mb-1">Email Support</div>
                                <div className="text-lg font-bold text-white">support@mediastar.network</div>
                                <a href="mailto:support@mediastar.network" className="text-xs text-blue-400 hover:text-blue-300 mt-1 block">Send an email</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-orbit-800 border border-orbit-700 rounded-2xl p-8 shadow-xl">
                     <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ShieldQuestion className="text-orbit-400" />
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-orbit-700 rounded-xl overflow-hidden bg-orbit-900/30">
                                <button 
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-orbit-700/30 transition-colors"
                                >
                                    <span className="font-medium text-gray-200 text-sm">{faq.q}</span>
                                    {activeAccordion === index ? <ChevronUp size={16} className="text-orbit-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                                </button>
                                {activeAccordion === index && (
                                    <div className="p-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-orbit-700/50 mt-2">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-orbit-800 border border-orbit-700 rounded-2xl p-8 shadow-xl h-full flex flex-col">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <FileText className="text-purple-400" />
                    Open a Ticket
                </h2>
                <p className="text-gray-400 text-sm mb-6">Describe your issue below. Our team typically responds within 2 hours.</p>

                <form onSubmit={handleSendMessage} className="space-y-4 flex-1 flex flex-col">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                        <select 
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:border-orbit-500 outline-none transition-colors appearance-none"
                            required
                        >
                            <option value="" disabled>Select a topic...</option>
                            <option value="Payments">Payment Issue</option>
                            <option value="Content ID">Content ID / Copyright</option>
                            <option value="Channel Linking">Channel Linking</option>
                            <option value="Account">Account Settings</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                        <textarea 
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            placeholder="Please provide specific details like Transaction ID, Video URL, or Asset ID..."
                            className="w-full h-full min-h-[200px] bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:border-orbit-500 outline-none transition-colors resize-none"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={formStatus === 'sending' || formStatus === 'sent'}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                                ${formStatus === 'sent' 
                                    ? 'bg-green-500 hover:bg-green-400' 
                                    : 'bg-orbit-500 hover:bg-orbit-400 shadow-orbit-500/20'}`}
                        >
                            {formStatus === 'idle' && (
                                <>
                                    <Send size={18} />
                                    <span>Submit Ticket</span>
                                </>
                            )}
                            {formStatus === 'sending' && (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </>
                            )}
                            {formStatus === 'sent' && (
                                <>
                                    <CheckCircle size={18} />
                                    <span>Ticket Sent!</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
       </div>
    </div>
  );
};

export default SupportView;