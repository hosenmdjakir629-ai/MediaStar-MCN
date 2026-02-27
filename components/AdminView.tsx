import React from 'react';
import { ShieldCheck, Users, DollarSign, BarChart3, Settings, AlertCircle } from 'lucide-react';

const AdminView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <ShieldCheck className="text-purple-400 w-8 h-8" />
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      </div>

      <p className="text-gray-400 text-lg">Welcome, Administrator. Manage your network, users, and finances from here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Admin Stat Card 1 */}
        <div className="bg-orbit-800/50 border border-white/5 rounded-2xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Users className="text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <h2 className="text-2xl font-bold text-white">1,234</h2>
          </div>
        </div>

        {/* Admin Stat Card 2 */}
        <div className="bg-orbit-800/50 border border-white/5 rounded-2xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full">
            <DollarSign className="text-green-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Revenue</p>
            <h2 className="text-2xl font-bold text-white">$1.2M</h2>
          </div>
        </div>

        {/* Admin Stat Card 3 */}
        <div className="bg-orbit-800/50 border border-white/5 rounded-2xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <AlertCircle className="text-red-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Pending Withdrawals</p>
            <h2 className="text-2xl font-bold text-white">12</h2>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-orbit-800/50 border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <Users className="text-blue-400 group-hover:text-blue-300 mb-2" size={28} />
            <span className="text-sm font-medium text-white">Manage Users</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <DollarSign className="text-green-400 group-hover:text-green-300 mb-2" size={28} />
            <span className="text-sm font-medium text-white">Review Payouts</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <BarChart3 className="text-cyan-400 group-hover:text-cyan-300 mb-2" size={28} />
            <span className="text-sm font-medium text-white">View Analytics</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <Settings className="text-purple-400 group-hover:text-purple-300 mb-2" size={28} />
            <span className="text-sm font-medium text-white">System Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-orbit-800/50 border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Recent Admin Activity</h3>
        <div className="text-gray-500 text-sm">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
};

export default AdminView;
