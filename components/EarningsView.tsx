import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Briefcase, Calendar, ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieChartIcon, Filter, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EarningsRecord, PayoutRequest } from '../types';

interface EarningsViewProps {
  earnings: EarningsRecord[];
  payouts: PayoutRequest[];
  onAddPayout: (payout: Omit<PayoutRequest, 'id'>) => void;
  availableBalance: number;
  isAdmin?: boolean;
}

const EarningsView: React.FC<EarningsViewProps> = ({ 
  earnings, 
  payouts, 
  onAddPayout, 
  availableBalance, 
  isAdmin = false 
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  const filteredEarnings = useMemo(() => {
    if (selectedMonth === 'All') return earnings;
    return earnings.filter(e => e.month === selectedMonth);
  }, [earnings, selectedMonth]);

  const stats = useMemo(() => {
    const totalAd = filteredEarnings.reduce((acc, curr) => acc + curr.adRevenue, 0);
    const totalBrand = filteredEarnings.reduce((acc, curr) => acc + curr.brandDealRevenue, 0);
    const total = totalAd + totalBrand;
    return { totalAd, totalBrand, total };
  }, [filteredEarnings]);

  const chartData = useMemo(() => {
    return earnings.slice(-6).map(e => ({
      name: e.month,
      Ad: e.adRevenue,
      Brand: e.brandDealRevenue,
      Total: e.totalRevenue
    }));
  }, [earnings]);

  const pieData = [
    { name: 'Ad Revenue', value: stats.totalAd, color: '#06b6d4' },
    { name: 'Brand Deals', value: stats.totalBrand, color: '#8b5cf6' },
  ];

  const months = Array.from(new Set(earnings.map(e => e.month))).sort().reverse();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Earnings Overview</h2>
          <p className="text-gray-400 text-sm mt-1">Track your revenue streams and financial performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-orbit-800 border border-orbit-700 text-white text-sm rounded-xl pl-10 pr-4 py-2 outline-none focus:border-orbit-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Time</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orbit-800 border border-orbit-700 text-white rounded-xl text-sm font-bold hover:bg-orbit-700 transition-all">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign size={80} />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl font-black text-white">৳{stats.total.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <TrendingUp size={14} />
            <span>+12.5% from last period</span>
          </div>
        </div>
        <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Ad Revenue</p>
          <h3 className="text-3xl font-black text-cyan-400">৳{stats.totalAd.toLocaleString()}</h3>
          <div className="mt-4 w-full bg-orbit-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full" style={{ width: `${(stats.totalAd / (stats.total || 1)) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Brand Deals</p>
          <h3 className="text-3xl font-black text-purple-400">৳{stats.totalBrand.toLocaleString()}</h3>
          <div className="mt-4 w-full bg-orbit-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full" style={{ width: `${(stats.totalBrand / (stats.total || 1)) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orbit-500 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-orbit-500/20 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
            <h3 className="text-3xl font-black text-white">৳{availableBalance.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Ready for Payout</span>
                <ArrowUpRight size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-orbit-800 rounded-2xl p-8 border border-orbit-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-orbit-500" size={20} />
              Revenue Trends
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Brands</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value/1000}k`} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#f1f5f9' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Ad" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorAd)" />
                <Area type="monotone" dataKey="Brand" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorBrand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-orbit-800 rounded-2xl p-8 border border-orbit-700 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <PieChartIcon className="text-orbit-500" size={20} />
            Distribution
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-4 mt-6">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orbit-900/50 rounded-xl border border-orbit-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{((item.value / stats.total) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Records Table */}
      <div className="bg-orbit-800 rounded-2xl border border-orbit-700 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-orbit-700">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-orbit-500" />
            Monthly Earnings Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-orbit-900/50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4 font-bold tracking-wider">Month</th>
                <th className="p-4 font-bold tracking-wider">Ad Revenue</th>
                <th className="p-4 font-bold tracking-wider">Brand Deals</th>
                <th className="p-4 font-bold tracking-wider">Total</th>
                <th className="p-4 font-bold tracking-wider">Status</th>
                <th className="p-4 font-bold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orbit-700">
              {filteredEarnings.map((record) => (
                <tr key={record.id} className="hover:bg-orbit-700/30 transition-colors">
                  <td className="p-4 font-bold text-white">{record.month}</td>
                  <td className="p-4 text-sm text-cyan-400 font-mono">৳{record.adRevenue.toLocaleString()}</td>
                  <td className="p-4 text-sm text-purple-400 font-mono">৳{record.brandDealRevenue.toLocaleString()}</td>
                  <td className="p-4 text-sm text-white font-black font-mono">৳{record.totalRevenue.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      record.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      record.status === 'Ready' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-orbit-700 rounded-lg transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsView;
