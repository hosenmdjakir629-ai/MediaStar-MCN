import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
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
    <div className="space-y-6 animate-fade-in">
      <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
        <h3 className="text-lg font-bold text-white mb-6">Audience Growth</h3>
        <div className="h-80">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f1f5f9' }}
              />
              <Legend />
              <Area type="monotone" dataKey="views" name="Views" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="subs" name="Subscribers" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorSubs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Sources</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(0, 7)}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                <Bar dataKey="revenue" name="Ad Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-bold text-white mb-2">Detailed Reports</h3>
            <p className="text-gray-400 mb-6">Download monthly CSV reports for all creators.</p>
            <button 
              onClick={handleDownloadCSV}
              className="px-6 py-3 bg-orbit-700 hover:bg-orbit-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
            >
                Download CSV
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;