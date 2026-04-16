import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import { Trophy, Star, Zap, Award, Target, Diamond, Crown, CheckCircle2, Lock, ArrowUpRight, Gift, Video } from 'lucide-react';
import { motion } from 'framer-motion';

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
  date?: string;
};

type Level = {
  name: string;
  minPoints: number;
  color: string;
  icon: any;
  perks: string[];
};

const LEVELS: Level[] = [
  { 
    name: 'Bronze', 
    minPoints: 0, 
    color: 'text-orange-600 bg-orange-50 border-orange-100', 
    icon: Trophy,
    perks: ['Basic Analytics', 'Community Support']
  },
  { 
    name: 'Silver', 
    minPoints: 1000, 
    color: 'text-slate-500 bg-slate-50 border-slate-200', 
    icon: Award,
    perks: ['Priority Support', 'Advanced Analytics', 'Custom Branding']
  },
  { 
    name: 'Gold', 
    minPoints: 5000, 
    color: 'text-amber-500 bg-amber-50 border-amber-200', 
    icon: Crown,
    perks: ['Dedicated Manager', 'Early Access Features', 'Higher Revenue Share']
  },
  { 
    name: 'Platinum', 
    minPoints: 20000, 
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200', 
    icon: Diamond,
    perks: ['VIP Events', 'Brand Deal Matching', 'Zero Withdrawal Fees']
  }
];

export default function Gamification() {
  const [points, setPoints] = useState(2450);
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'First Upload', description: 'Uploaded your first video to the platform', icon: Zap, unlocked: true, date: '2026-03-10' },
    { id: '2', name: 'Rising Star', description: 'Reached 1,000 total views', icon: Star, unlocked: true, date: '2026-03-25' },
    { id: '3', name: 'Verified Creator', description: 'Completed KYC verification', icon: CheckCircle2, unlocked: true, date: '2026-04-01' },
    { id: '4', name: 'Content King', description: 'Uploaded 50 videos', icon: Trophy, unlocked: false },
    { id: '5', name: 'Viral Hit', description: 'A single video reached 10k views', icon: Zap, unlocked: false },
    { id: '6', name: 'Top Earner', description: 'Earned over $1,000 in a single month', icon: Diamond, unlocked: false },
  ]);

  const currentLevel = [...LEVELS].reverse().find(l => points >= l.minPoints) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 : 100;

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Creator Rewards & Levels</h1>
          <p className="text-slate-500 mt-1">Level up your channel and unlock exclusive perks.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Level Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <currentLevel.icon className="w-48 h-48" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                      <currentLevel.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Current Status</p>
                      <h2 className="text-3xl font-black">{currentLevel.name} Level</h2>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>{points.toLocaleString()} Points</span>
                      {nextLevel && <span>{nextLevel.minPoints.toLocaleString()} Points for {nextLevel.name}</span>}
                    </div>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNext}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                      />
                    </div>
                    {nextLevel && (
                      <p className="text-xs text-indigo-100 text-right">
                        { (nextLevel.minPoints - points).toLocaleString() } more points to reach {nextLevel.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Your Level Perks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentLevel.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{perk}</span>
                    </div>
                  ))}
                  {nextLevel && nextLevel.perks.slice(0, 2).map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 opacity-60">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-500">{perk} (Unlocks at {nextLevel.name})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-indigo-600" />
                  Achievement Badges
                </h3>
                <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`relative p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center text-center group ${
                      badge.unlocked 
                        ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1' 
                        : 'bg-slate-50 border-slate-100 grayscale opacity-60'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                      badge.unlocked ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <badge.icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{badge.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">{badge.description}</p>
                    
                    {!badge.unlocked && (
                      <div className="absolute top-3 right-3">
                        <Lock className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                    {badge.unlocked && badge.date && (
                      <p className="mt-3 text-[9px] font-bold text-indigo-500 uppercase tracking-wider">
                        Unlocked {new Date(badge.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Points & Rewards */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                Reward Points
              </h3>
              <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
                <p className="text-4xl font-black text-slate-900 mb-1">{points.toLocaleString()}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Available Points</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Daily Login</p>
                      <p className="text-[10px] text-slate-500">Today</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">+10</span>
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Video Milestone</p>
                      <p className="text-[10px] text-slate-500">Yesterday</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">+250</span>
                </div>
              </div>

              <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" />
                Redeem Points
              </button>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <Crown className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">Level Up Faster!</h3>
              <p className="text-sm text-indigo-100 mb-6 relative z-10 leading-relaxed">
                Complete daily challenges and maintain a consistent upload schedule to earn bonus points and unlock perks.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all relative z-10">
                View Challenges
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
