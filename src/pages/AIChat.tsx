import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../lib/api';

export function AIChat() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await api.post('/ai/chat', {
        sessionId,
        message: input,
        role: 'general',
        systemInstruction: 'You are a helpful AI assistant for the OrbitX MCN platform.'
      });
      setSessionId(res.data.sessionId);
      setMessages(res.data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {m.role === 'model' ? <Bot size={14}/> : <User size={14}/>}
                {m.role === 'model' ? 'AI Assistant' : 'You'}
              </div>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><Loader2 className="animate-spin text-indigo-600"/></div>}
      </div>
      <div className="p-4 border-t border-slate-200 flex gap-2">
        <input 
          className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
        />
        <button onClick={sendMessage} disabled={loading} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          <Send size={20}/>
        </button>
      </div>
    </div>
  );
}
