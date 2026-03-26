import React from 'react';
import { Eye, DollarSign, TrendingUp, Users, Video, MessageCircle, Briefcase, Calendar, CheckCircle, Clock, ArrowUpRight, BarChart3 } from 'lucide-react';
import StatCard from './StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Creator, AnalyticsData, EarningsRecord, PayoutRequest } from '../types';

interface CreatorDashboardViewProps {
  creators: Creator[];
  analytics: AnalyticsData[];
  earnings: EarningsRecord[];
  payouts: PayoutRequest[];
}

const CreatorDashboardView: React.FC<CreatorDashboardViewProps> = ({ creators, analytics, earnings, payouts }) => {
  const creator = creators[0];
  
  // Use real data if available, otherwise fallback to mock for visual consistency if no data yet
  const performanceData = analytics.length > 0 ? analytics : [
    { date: 'Jan', views: 4000, subs: 1200, revenue: 2400 },
    { date: 'Feb', views: 3000, subs: 1500, revenue: 1398 },
    { date: 'Mar', views: 5000, subs: 2100, revenue: 9800 },
    { date: 'Apr', views: 2780, subs: 1800, revenue: 3908 },
    { date: 'May', views: 6890, subs: 3200, revenue: 4800 },
    { date: 'Jun', views: 8390, subs: 4500, revenue: 3800 },
    { date: 'Jul', views: 12490, subs: 6800, revenue: 5300 },
  ];

  const chartEarningsData = earnings.length > 0 
    ? earnings.slice(-5).map(e => ({ month: e.month, amount: e.totalRevenue }))
    : [
      { month: 'Mar', amount: 1250 },
      { month: 'Apr', amount: 1840 },
      { month: 'May', amount: 2100 },
      { month: 'Jun', amount: 1950 },
      { month: 'Jul', amount: 2450 },
    ];

  const totalPayouts = payouts
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const brandDeals = [
    { id: 1, brand: 'TechGear Pro', deal: 'Product Review', status: 'Active', amount: '$1,500', date: 'Aug 15' },
    { id: 2, brand: 'SkillStream', deal: '30s Integration', status: 'Pending', amount: '$800', date: 'Sep 02' },
    { id: 3, brand: 'GamerFuel', deal: 'Social Shoutout', status: 'Completed', amount: '$500', date: 'Jul 28' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Status */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Creator Portal</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {creator?.name || 'Creator'}! Here's your channel performance summary.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">MCN Status</span>
              <span className="text-sm font-bold text-white">{creator?.status || 'Processing'} Member</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-orbit-800 border border-orbit-700 rounded-xl">
            <Calendar size={20} className="text-orbit-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Next Payout</span>
              <span className="text-sm font-bold text-white">Aug 21, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Views" value={creator?.totalViews?.toLocaleString() || "0"} change="+15.3%" trend="up" icon={Eye} color="cyan" />
        <StatCard title="Subscribers" value={creator?.subscribers?.toLocaleString() || "0"} change="+5.2%" trend="up" icon={Users} color="indigo" />
        <StatCard title="Est. Revenue" value={`$${creator?.revenue?.toLocaleString() || "0"}`} change="+12.4%" trend="up" icon={DollarSign} color="green" />
        <StatCard title="Watch Time" value="125.4K" change="+8.1%" trend="up" icon={Clock} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Graph */}
        <div className="lg:col-span-2 bg-orbit-800/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Channel Growth</h3>
              <p className="text-xs text-gray-400">Subscriber and View trends over the last 7 months</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-[10px] font-bold bg-orbit-500 text-white rounded-lg">VIEWS</button>
              <button className="px-3 py-1 text-[10px] font-bold bg-white/5 text-gray-400 rounded-lg hover:text-white transition-colors">SUBS</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#f1f5f9', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#22d3ee' }}
                  cursor={{stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Earnings Report */}
        <div className="bg-orbit-800/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-green-400" size={20} />
              Earnings
            </h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent Activity</span>
          </div>
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartEarningsData}>
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartEarningsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartEarningsData.length - 1 ? '#10b981' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <DollarSign size={16} />
                </div>
                <span className="text-sm font-medium text-gray-300">Total Payouts</span>
              </div>
              <span className="text-lg font-bold text-white">${totalPayouts.toLocaleString()}</span>
            </div>
            <button className="w-full py-3 bg-orbit-500 hover:bg-orbit-400 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              View Full Report <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand Deal Status */}
        <div className="bg-orbit-800/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="text-purple-400" size={20} />
              Brand Deals
            </h3>
            <button className="text-xs font-bold text-orbit-500 hover:text-orbit-400 transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {brandDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orbit-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-orbit-500/50 transition-colors">
                    <span className="text-lg font-black text-orbit-500">{deal.brand[0]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{deal.brand}</h4>
                    <p className="text-xs text-gray-500">{deal.deal}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white mb-1">{deal.amount}</div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    deal.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 
                    deal.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {deal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Content & Community */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-orbit-800/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Video className="text-indigo-400" size={20} />
              Latest Videos
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-16 h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={`https://picsum.photos/seed/vid${i}/100/60`} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">Mastering YouTube SEO in 2026</h4>
                    <p className="text-[10px] text-gray-500">12K views • 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orbit-800/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="text-emerald-400" size={20} />
              Community
            </h3>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/30/30`} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">@user{i}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 italic">"This strategy literally doubled my views in a week. Thanks OrbitX!"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboardView;
