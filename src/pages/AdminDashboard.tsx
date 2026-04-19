import { useState } from 'react';
import { LayoutDashboard, Users, DollarSign, Activity, ShieldCheck, Upload, FileSettings } from 'lucide-react';
import MainLayout from '../layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // Assuming these exist, if not, use plain div

export default function AdminDashboard() {
  const [stats] = useState({
    totalEarnings: "$2,450,230",
    activeCreators: "1,248",
    pendingWithdrawals: "42",
    systemStatus: 'Operational'
  });

  const quickActions = [
    { name: 'Upload Content', icon: Upload, path: '/content-management' },
    { name: 'Manage Policies', icon: ShieldCheck, path: '/policy-control' },
    { name: 'Access Creator Data', icon: Users, path: '/admin/creators' },
  ];

  return (
    <MainLayout>
      <div className="p-8 bg-black min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Admin Overview</h2>
        
        {/* --- Key Metrics --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Revenue', value: stats.totalEarnings, icon: DollarSign },
            { title: 'Active Creators', value: stats.activeCreators, icon: Users },
            { title: 'Pending Withdrawals', value: stats.pendingWithdrawals, icon: Activity },
            { title: 'System Status', value: stats.systemStatus, icon: ShieldCheck },
          ].map((stat, i) => (
            <div key={i} className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[#A1A1A1] text-sm font-semibold">{stat.title}</p>
                <stat.icon className="text-[#D4AF37]" size={20} />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* --- Quick Actions --- */}
        <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <a 
              key={action.name} 
              href={action.path}
              className="group bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl flex items-center gap-6 hover:border-[#D4AF37] transition-all"
            >
              <div className="p-4 rounded-xl bg-white/5 group-hover:bg-[#D4AF37]/20 transition-all">
                <action.icon className="text-[#D4AF37]" size={24} />
              </div>
              <span className="font-semibold text-lg">{action.name}</span>
            </a>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
