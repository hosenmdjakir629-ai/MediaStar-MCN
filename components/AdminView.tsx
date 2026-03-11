import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, DollarSign, BarChart3, Settings, AlertCircle, Bell } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../src/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

const AdminView: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { status: 'read' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <ShieldCheck className="text-purple-400 w-8 h-8" />
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      </div>

      <p className="text-gray-400 text-lg">Welcome, Administrator. Manage your network, users, and finances from here.</p>

      {/* Notifications */}
      <div className="bg-orbit-800/50 border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Notifications</h3>
        </div>
        <div className="space-y-2">
          {notifications.filter(n => n.status === 'unread').map(n => (
            <div key={n.id} className="bg-orbit-900 border border-white/10 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-white font-bold">New Creator Application Received!</p>
                <p className="text-gray-400 text-sm">Name: {n.name} | Channel: {n.channelName} | Subs: {n.subscribers}</p>
              </div>
              <button onClick={() => handleApprove(n.id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold">View / Approve</button>
            </div>
          ))}
          {notifications.filter(n => n.status === 'unread').length === 0 && (
            <p className="text-gray-500 text-sm">No new notifications.</p>
          )}
        </div>
      </div>

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
