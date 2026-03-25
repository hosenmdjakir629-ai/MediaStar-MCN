import React, { useState } from 'react';
import { Users, Eye, DollarSign, TrendingUp, MoreHorizontal, ArrowRight, Check, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import StatCard from './StatCard';
import { AnalyticsData, Creator } from '../types';

interface DashboardViewProps {
  data: AnalyticsData[];
  creators: Creator[];
  onViewCreators: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data, creators, onViewCreators }) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review new creator applications', completed: false },
    { id: 2, text: 'Approve pending payouts', completed: false },
    { id: 3, text: 'Update system logs', completed: true },
    { id: 4, text: 'Check AI strategy reports', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const topCreators = [...creators]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white font-display tracking-tight mb-2">
            Network <span className="orbit-text-gradient">Overview</span>
          </h2>
          <p className="text-surface-500 text-xs font-black uppercase tracking-[0.3em]">
            Real-time analytics & performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-surface-900 border border-white/5 rounded-2xl flex items-center space-x-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">System Live</span>
          </div>
          <button className="p-3 bg-surface-900 border border-white/5 rounded-2xl text-surface-400 hover:text-white hover:border-white/10 transition-all">
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Creators" 
          value={creators.length.toLocaleString()} 
          change="+12.5%" 
          trend="up" 
          icon={Users} 
          color="indigo" 
        />
        <StatCard 
          title="Monthly Views" 
          value="84.2M" 
          change="+8.1%" 
          trend="up" 
          icon={Eye} 
          color="cyan" 
        />
        <StatCard 
          title="Network Revenue" 
          value={`৳${creators.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}`} 
          change="+2.4%" 
          trend="up" 
          icon={DollarSign} 
          color="green" 
        />
        <StatCard 
          title="Avg. Engagement" 
          value="8.4%" 
          change="-1.2%" 
          trend="down" 
          icon={TrendingUp} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-8 glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orbit-500/20 to-transparent"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 relative z-10">
            <div>
                 <h3 className="text-2xl font-black text-white font-display tracking-tight mb-1">Revenue Performance</h3>
                 <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Net earnings across all network channels</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-orbit-500/10 border border-orbit-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-orbit-500 rounded-full"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-orbit-400">Earnings</span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.03} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} 
                  dy={20} 
                />
                <YAxis 
                  stroke="#64748b" 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value/1000}k`} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1.5rem',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#fff',
                    padding: '1rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#8b5cf6' }}
                  labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  cursor={{stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '6 6'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Top Creators & Tasks */}
        <div className="lg:col-span-4 space-y-8">
          {/* Top Creators List */}
          <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-white font-display tracking-tight mb-1">Top Performers</h3>
                  <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Monthly view growth</p>
                </div>
                <button className="p-2 text-surface-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><MoreHorizontal size={20}/></button>
            </div>
            
            <div className="space-y-4 relative z-10">
              {topCreators.map((creator, i) => (
                <div key={creator.id} className="flex items-center justify-between group/item cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img 
                          src={creator.avatarUrl} 
                          alt={creator.channelName} 
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5 group-hover/item:ring-orbit-500/50 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-surface-950 rounded-full flex items-center justify-center border border-white/10">
                            <span className="text-[8px] font-black text-orbit-400">{i + 1}</span>
                        </div>
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm group-hover/item:text-orbit-400 transition-colors tracking-tight">{creator.channelName}</h4>
                      <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">{creator.subscribers.toLocaleString()} Subs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white font-mono tracking-tighter">৳{creator.revenue.toLocaleString()}</p>
                    <p className="text-[9px] text-surface-600 font-bold uppercase">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={onViewCreators}
              className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-3 group/btn relative z-10"
            >
              <span>VIEW ALL CREATORS</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Quick Tasks Section */}
          <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-white font-display tracking-tight mb-1">Quick Tasks</h3>
                  <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Daily admin routine</p>
                </div>
                <div className="text-[10px] font-black text-orbit-400 uppercase tracking-[0.2em] bg-orbit-400/10 px-4 py-1.5 rounded-full border border-orbit-400/20">
                  {tasks.filter(t => !t.completed).length} Pending
                </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all cursor-pointer group/task ${
                    task.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/10 opacity-60' 
                      : 'bg-white/5 border-transparent hover:border-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'border-white/10 group-hover/task:border-white/30'
                  }`}>
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check size={14} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className={`text-sm font-bold transition-all tracking-tight ${
                    task.completed ? 'text-emerald-400/80 line-through' : 'text-surface-200'
                  }`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;