import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Download, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsViewProps {
  data: AnalyticsData[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  const handleDownloadCSV = () => {
    const headers = ['Date', 'Views', 'Revenue', 'Subscribers'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => `${row.date},${row.views},${row.revenue},${row.subs}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orbitx_analytics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="glass-panel rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orbit-500/5 blur-[120px] pointer-events-none group-hover:bg-orbit-500/10 transition-all duration-700"></div>
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
          <TrendingUp size={160} className="text-orbit-500" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 relative z-10">
          <div>
            <h3 className="text-3xl font-black text-white font-display tracking-tight">Audience Growth</h3>
            <p className="text-surface-500 text-sm font-bold mt-1">Real-time subscriber and view performance tracking across the network.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              LIVE FEED
            </div>
          </div>
        </div>

        <div className="h-[450px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.05} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                dy={20}
              />
              <YAxis 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 10, 10, 0.8)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '1.5rem', 
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '1rem'
                }}
                itemStyle={{ fontSize: '14px', fontWeight: 900 }}
                labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                cursor={{stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6 6'}}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                height={48}
                iconType="circle"
                formatter={(value) => <span className="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">{value}</span>}
              />
              <Area type="monotone" dataKey="views" name="Views" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="subs" name="Subscribers" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorSubs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-panel rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700"></div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20">
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white font-display tracking-tight">Revenue Sources</h3>
              <p className="text-surface-500 text-xs font-bold">Daily ad revenue distribution</p>
            </div>
          </div>
          
          <div className="h-[350px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(0, 10)}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.05} />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={15} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)', radius: 12}} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '1.5rem', 
                    backdropFilter: 'blur(20px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '1rem'
                  }} 
                  itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '14px' }}
                  labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Bar dataKey="revenue" name="Ad Revenue" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-5 glass-panel rounded-[2.5rem] p-10 border border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-orbit-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orbit-500/5 blur-[100px] pointer-events-none group-hover:bg-orbit-500/10 transition-all duration-700"></div>
            
            <div className="p-8 bg-surface-950 rounded-[2.5rem] border border-white/10 mb-8 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
              <PieChart size={64} className="text-orbit-500" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 font-display tracking-tight relative z-10">Detailed Reports</h3>
            <p className="text-surface-500 mb-10 max-w-xs relative z-10 font-bold leading-relaxed">Generate and download comprehensive monthly CSV reports for all network creators with one click.</p>
            <button 
              onClick={handleDownloadCSV}
              className="w-full sm:w-auto px-10 py-5 bg-orbit-500 hover:bg-orbit-400 text-white rounded-[2rem] transition-all font-black flex items-center justify-center gap-4 shadow-2xl shadow-orbit-500/40 active:scale-95 relative z-10 group/btn"
            >
                <Download size={24} className="group-hover:-translate-y-1 transition-transform" />
                <span className="tracking-widest uppercase text-sm">DOWNLOAD CSV</span>
            </button>
            <div className="mt-8 text-[10px] text-surface-600 font-black uppercase tracking-[0.4em] relative z-10">System Export Module</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;