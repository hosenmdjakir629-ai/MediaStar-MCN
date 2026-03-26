import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai/web';
import { Creator, AnalyticsData } from '../types';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA3laj29mmMOi65O1E4HHR0eNYmBk0iDqk';
const ai = new GoogleGenAI({ apiKey: API_KEY });

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface AIChatbotProps {
  creators?: Creator[];
  analytics?: AnalyticsData[];
}

const AIChatbot: React.FC<AIChatbotProps> = ({ creators = [], analytics = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: 'Hi! I am the OrbitX AI Assistant. How can I help you grow your YouTube channel today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const totalCreators = creators.length;
    const totalViews = creators.reduce((acc, c) => acc + c.totalViews, 0);
    const totalSubscribers = creators.reduce((acc, c) => acc + c.subscribers, 0);

    const systemInstruction = `You are a helpful AI assistant for OrbitX MCN, a YouTube Multi-Channel Network. 
You help creators with YouTube strategy, content ideas, SEO, and platform questions. Keep your answers concise, professional, and encouraging.

Here is specific information about joining OrbitX MCN:
- Creator Join Fee: $20 (One-time payment)
- Join Requirements: 
  • 1,000+ subscribers
  • Original content
  • No active copyright strikes
  • Monetized YouTube channel 🚀
- Join Benefits:
  • Brand deals & sponsorship opportunities
  • Content ID & copyright protection
  • Premium production resources (music, SFX, tools)
  • Creator collaboration & cross-promotion
  • Monetization & payment support
  • YouTube growth strategies & SEO guidance
  • Higher earning potential
  • Fast and easy payment system

Here is the current state of the MCN:
- Total Creators: ${totalCreators}
- Total Network Views: ${totalViews.toLocaleString()}
- Total Network Subscribers: ${totalSubscribers.toLocaleString()}
You can use this information to answer questions about the network's performance.`;

    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
        },
      });
    }
  }, [creators, analytics]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const totalCreators = creators.length;
        const totalViews = creators.reduce((acc, c) => acc + c.totalViews, 0);
        const totalSubscribers = creators.reduce((acc, c) => acc + c.subscribers, 0);

        const systemInstruction = `You are a helpful AI assistant for OrbitX MCN, a YouTube Multi-Channel Network. 
        You help creators with YouTube strategy, content ideas, SEO, and platform questions. Keep your answers concise, professional, and encouraging.

        Here is specific information about joining OrbitX MCN:
        - Creator Join Fee: $20 (One-time payment)
        - Join Requirements: 
          • 1,000+ subscribers
          • Original content
          • No active copyright strikes
          • Monetized YouTube channel 🚀
        - Join Benefits:
          • Brand deals & sponsorship opportunities
          • Content ID & copyright protection
          • Premium production resources (music, SFX, tools)
          • Creator collaboration & cross-promotion
          • Monetization & payment support
          • YouTube growth strategies & SEO guidance
          • Higher earning potential
          • Fast and easy payment system

        Here is the current state of the MCN:
        - Total Creators: ${totalCreators}
        - Total Network Views: ${totalViews.toLocaleString()}
        - Total Network Subscribers: ${totalSubscribers.toLocaleString()}
        You can use this information to answer questions about the network's performance.`;

        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction,
          },
        });
      }

      const response = await chatRef.current.sendMessage({ message: userMessage.content });
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || "I'm sorry, I couldn't generate a response."
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error: any) {
      if (error && (error.name === 'AbortError' || error.message?.toLowerCase().includes('aborted') || error.message?.includes('The user aborted a request'))) {
        console.debug("Chat error aborted:", error);
        return;
      }
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I'm having trouble connecting to my servers right now. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 p-5 bg-orbit-600 text-white rounded-[2rem] shadow-2xl shadow-orbit-600/30 flex items-center justify-center group overflow-hidden ${isOpen ? 'hidden' : 'flex'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageSquare size={28} className="relative z-10" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-sm sm:max-w-md glass-panel border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-orbit-500/5 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orbit-500/10 flex items-center justify-center text-orbit-400 border border-orbit-500/20 shadow-inner">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-white text-base font-display tracking-tight">OrbitX AI</h3>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 text-surface-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-surface-800 text-surface-300' : 'bg-orbit-500/10 text-orbit-400 border border-orbit-500/10'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div 
                    className={`px-5 py-3.5 rounded-[1.5rem] max-w-[85%] text-sm font-bold leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-orbit-600 text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/5 text-surface-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 flex-row animate-fade-in">
                  <div className="w-10 h-10 rounded-2xl bg-orbit-500/10 flex items-center justify-center shrink-0 text-orbit-400 border border-orbit-500/10">
                    <Bot size={20} />
                  </div>
                  <div className="px-6 py-4 rounded-[1.5rem] bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-orbit-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-orbit-500/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-orbit-500/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white/5 border-t border-white/5">
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about YouTube strategy..."
                  className="w-full bg-surface-950/50 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-sm text-white font-bold placeholder:text-surface-600 focus:outline-none focus:border-orbit-500/50 focus:bg-surface-950 transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-3 text-orbit-400 hover:text-orbit-300 disabled:text-surface-700 disabled:hover:text-surface-700 transition-all active:scale-90"
                >
                  {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
