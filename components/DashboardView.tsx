import React from 'react';
import { Users, Eye, DollarSign, TrendingUp, MoreHorizontal, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import { AnalyticsData, Creator } from '../types';

interface DashboardViewProps {
  data: AnalyticsData[];
  creators: Creator[];
  onViewCreators: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data, creators, onViewCreators }) => {
  const topCreators = [...creators]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Backend Online</span>
          </div>
          <div className="text-xs text-gray-500">v1.0.4 &bull; OrbitX MCN Central</div>
        </div>
        <div className="text-xs text-gray-400 font-medium">Last synced: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Creators" value={creators.length.toLocaleString()} change="+12.5%" trend="up" icon={Users} color="indigo" />
        <StatCard title="Monthly Views" value="84.2M" change="+8.1%" trend="up" icon={Eye} color="cyan" />
        <StatCard title="Network Revenue" value={`৳${creators.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}`} change="+2.4%" trend="up" icon={DollarSign} color="green" />
        <StatCard title="Avg. Engagement" value="8.4%" change="-1.2%" trend="down" icon={TrendingUp} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-orbit-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
                 <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
                 <p className="text-xs text-gray-400">Net earnings across all channels</p>
            </div>
            <select className="bg-black/20 border border-white/10 text-gray-300 text-sm rounded-lg p-2.5 focus:ring-orbit-500 focus:border-orbit-500 outline-none backdrop-blur-sm hover:bg-black/30 transition-colors cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#f1f5f9', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#818cf8' }}
                  cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Creators List */}
        <div className="bg-orbit-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Top Performing</h3>
              <button className="text-gray-400 hover:text-white transition-colors"><MoreHorizontal size={20}/></button>
          </div>
          
          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {topCreators.map((creator, i) => (
              <div key={creator.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
                        <img 
                          src={creator.avatarUrl} 
                          alt={creator.channelName} 
                          className="w-full h-full rounded-full border-2 border-orbit-900 object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-orbit-900 rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-bold text-orbit-900">{i + 1}</span>
                      </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-orbit-400 transition-colors">{creator.channelName}</h4>
                    <p className="text-xs text-gray-500">{creator.subscribers.toLocaleString()} Subs &bull; {creator.niche}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white font-mono">৳{creator.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-400 flex items-center justify-end gap-0.5">
                    <TrendingUp size={10} />
                    {creator.trend === 'up' ? '12%' : creator.trend === 'down' ? '-5%' : '0%'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={onViewCreators}
            className="w-full mt-6 py-3 bg-orbit-500/10 hover:bg-orbit-500/20 text-orbit-400 font-bold text-sm rounded-xl transition-colors border border-orbit-500/20 flex items-center justify-center gap-2 group"
          >
            <span>View All Creators</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;