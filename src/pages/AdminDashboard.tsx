import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, DollarSign, Activity, ShieldCheck, Video, ShieldAlert, Wrench } from 'lucide-react';
import MainLayout from '../layout/MainLayout';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCreators: 0,
    activeApplications: 0,
    totalRevenue: 452000,
    systemStatus: 'Operational',
    fraudAlerts: 3
  });

  useEffect(() => {
    const q = query(collection(db, "creators"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStats(prev => ({
        ...prev,
        totalCreators: snapshot.size
      }));
    });
    return () => unsubscribe();
  }, []);

  const tools = [
    { name: 'Creator Management', icon: Users, path: '/admin/creators', color: 'text-indigo-600' },
    { name: 'Withdrawals', icon: DollarSign, path: '/admin/withdrawals', color: 'text-emerald-600' },
    { name: 'System Logs', icon: Activity, path: '/admin/logs', color: 'text-amber-600' },
    { name: 'Fraud Detection', icon: ShieldAlert, path: '/admin/fraud', color: 'text-red-600' },
    { name: 'Manual Overrides', icon: Wrench, path: '/admin/overrides', color: 'text-slate-600' },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Admin Super Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Creators</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">138+</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Applications</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">138+</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">100K+</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Fraud Alerts</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.fraudAlerts}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">System Status</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">Active</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-6">Advanced Admin Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {tools.map((tool) => (
            <a 
              key={tool.name} 
              href={tool.path}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col items-center gap-4 text-center"
            >
              <div className={`p-4 rounded-xl bg-slate-50 ${tool.color}`}>
                <tool.icon className="w-8 h-8" />
              </div>
              <span className="font-semibold text-slate-900">{tool.name}</span>
            </a>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
