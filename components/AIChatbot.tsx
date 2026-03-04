import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, X, Bot } from 'lucide-react';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am your OrbitX AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `You are a helpful AI assistant for OrbitX MCN, a YouTube Multi-Channel Network. You help creators and admins with analytics, content strategy, and platform management.

When asked about MCN Join Requirements, answer: "2K Subscriber & Monetize Channel".

When asked about MCN Join Benefits, answer with the following:
1️⃣ Brand Deals: Multi-Channel Networks (MCNs) have dedicated sales teams that directly connect you with advertisers for sponsorships and promotional campaigns.
2️⃣ Content ID & Protection: Advanced tools to manage copyright claims and ensure that no one else can upload your original videos without permission.
3️⃣ Production Resources: Access to professional studios, high-end video equipment, and royalty-free music and sound effect libraries (e.g., Epidemic Sound).
4️⃣ Cross-Promotion: Opportunities to collaborate with other creators within the same network, helping to bring audiences to each other’s channels.
5️⃣ Monetization Support: Assistance with filling out complex tax forms, resolving payment-related issues, and increasing ad revenue.
6️⃣ Channel Management: Direct expert guidance on SEO, thumbnail optimization, and audience retention strategies.

🔥 Additional Benefits:
7️⃣ Increased Earnings: Opportunity to earn more than the standard YouTube Partner Program through premium ads and direct brand deals.
8️⃣ Fast Payout: Receive monthly payments quickly and flexibly (e.g., via mobile financial services or local bank transfer) without waiting for Google AdSense thresholds or long processing times.`
        }
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Sorry, I could not generate a response.' }]);
    } catch (error) {
      console.error("Error calling Gemini API", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-orbit-500 hover:bg-orbit-600 text-white p-4 rounded-full shadow-lg transition-all"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="bg-orbit-900 border border-white/10 rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
          <div className="bg-orbit-800 p-4 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Bot size={20} className="text-orbit-400" />
              OrbitX AI
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-orbit-500 text-white' : 'bg-white/10 text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-gray-400 text-sm">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-white/10 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orbit-500"
            />
            <button onClick={handleSend} className="bg-orbit-500 hover:bg-orbit-600 text-white p-2 rounded-lg">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
