import React, { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, Target, Hash, Zap } from 'lucide-react';
import { generateContentStrategy } from '../services/geminiService';
import { Creator, AIStrategyResponse } from '../types';

interface AIStrategistProps {
  creators?: Creator[];
}

const AIStrategist: React.FC<AIStrategistProps> = ({ creators = [] }) => {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<AIStrategyResponse | null>(null);
  const [inputs, setInputs] = useState({
    niche: '',
    topic: '',
    channel: ''
  });

  const handleGenerate = async () => {
    if (!inputs.niche || !inputs.topic || !inputs.channel) return;
    
    setLoading(true);
    setStrategy(null);
    try {
      const result = await generateContentStrategy(inputs.niche, inputs.topic, inputs.channel);
      setStrategy(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Input Panel */}
      <div className="lg:col-span-4 bg-orbit-800 rounded-2xl p-6 border border-orbit-700 h-full overflow-y-auto">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">
            <span className="font-bold">OrbitX MCN</span>
            <span className="text-sm font-medium ml-2 text-gray-400">- Powered by MediaStar</span>
            <span className="block text-xs text-orbit-400 mt-0.5">AI Strategist</span>
          </h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Channel</label>
            <select 
              value={inputs.channel}
              onChange={(e) => {
                const selected = creators.find(c => c.channelName === e.target.value);
                setInputs({
                  ...inputs, 
                  channel: e.target.value,
                  niche: selected?.niche || inputs.niche
                });
              }}
              className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orbit-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select or Type...</option>
              {creators.map(c => (
                <option key={c.id} value={c.channelName}>{c.channelName}</option>
              ))}
              <option value="custom">-- Custom Channel --</option>
            </select>
          </div>

          {inputs.channel === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Custom Channel Name</label>
              <input 
                type="text"
                onChange={(e) => setInputs({...inputs, channel: e.target.value})}
                placeholder="e.g. TechReviewer Pro"
                className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orbit-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Content Niche</label>
            <select 
              value={inputs.niche}
              onChange={(e) => setInputs({...inputs, niche: e.target.value})}
              className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orbit-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select Niche</option>
              <option value="Gaming">Gaming</option>
              <option value="Tech & Gadgets">Tech & Gadgets</option>
              <option value="Lifestyle Vlogging">Lifestyle Vlogging</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Focus Topic / Idea</label>
            <textarea 
              value={inputs.topic}
              onChange={(e) => setInputs({...inputs, topic: e.target.value})}
              placeholder="What are you planning to make a video about? e.g. 'iPhone 16 Review' or 'Minecraft Speedrun'"
              className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white h-32 resize-none focus:ring-2 focus:ring-orbit-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !inputs.channel || !inputs.niche || !inputs.topic}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2
              ${loading 
                ? 'bg-orbit-700 cursor-wait' 
                : 'bg-gradient-to-r from-orbit-500 to-purple-600 hover:from-orbit-400 hover:to-purple-500 shadow-purple-500/25'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Strategy</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-gray-500">
            Powered by Gemini 3 Flash. Results may vary.
          </p>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-8 space-y-6 h-full overflow-y-auto">
        {!strategy && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 border-2 border-dashed border-orbit-700 rounded-2xl bg-orbit-800/50">
            <div className="w-16 h-16 bg-orbit-800 rounded-full flex items-center justify-center">
              <BrainCircuitIcon className="w-8 h-8 text-orbit-500" />
            </div>
            <p>Enter your content details to generate an AI-powered strategy.</p>
          </div>
        )}

        {strategy && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Title Ideas */}
            <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Viral Title Ideas</h3>
              </div>
              <div className="grid gap-3">
                {strategy.titleIdeas.map((title, idx) => (
                  <div key={idx} className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700/50 hover:border-orbit-500/50 transition-colors flex items-center justify-between group cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(title)}
                  >
                    <span className="text-gray-200 font-medium">{title}</span>
                    <span className="text-xs text-orbit-400 opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Gaps */}
              <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="text-red-400" />
                  <h3 className="text-lg font-bold text-white">Opportunity Gaps</h3>
                </div>
                <ul className="space-y-3">
                  {strategy.contentGaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-gray-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Tags */}
               <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Hash className="text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Optimized Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strategy.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orbit-900 text-blue-300 text-xs rounded-full border border-orbit-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Optimization */}
            <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="text-green-400" />
                <h3 className="text-lg font-bold text-white">Description Strategy</h3>
              </div>
              <div className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700/50 text-gray-300 text-sm leading-relaxed">
                {strategy.descriptionOptimization}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Icon
const BrainCircuitIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.23 4.422 4.422 0 0 0 6.003 4.031 4 4 0 0 0 6.432-3.12 4 4 0 0 0 .636-7.831 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5"/>
    <path d="M9 13a4.5 4.5 0 0 0 3 4"/>
    <path d="M12 11h.01"/>
    <path d="M15 13a4.5 4.5 0 0 1-3 4"/>
  </svg>
);

export default AIStrategist;