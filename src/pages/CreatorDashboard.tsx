import React, { useEffect, useState } from 'react';
import { BarChart3, DollarSign, Clock, TrendingUp, Trophy, Zap, Star } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import api from '../lib/api';

export default function CreatorDashboard({ user }: { user: any }) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [points, setPoints] = useState(2450); // Mock points

  useEffect(() => {
    if (!user) return;

    // Fetch Analytics
    const q = query(collection(db, 'videoAnalytics'), where('creatorId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      // Aggregate analytics (simple demo)
      const totalViews = data.reduce((acc, curr) => acc + curr.views, 0);
      setAnalytics({ views: totalViews });
    });

    // Fetch Earnings & Withdrawals
    const fetchData = async () => {
      try {
        const [earningsRes, withdrawRes] = await Promise.all([
          api.get('/earnings/my'),
          api.get('/withdraw/my')
        ]);
        setEarnings(earningsRes.data);
        setWithdrawals(withdrawRes.data.filter((w: any) => w.status === 'pending'));
      } catch (error) {
        console.error("Error fetching creator data:", error);
      }
    };
    fetchData();

    return () => unsubscribe();
  }, [user]);

  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({ amount: '', method: 'Bank Transfer' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [feeDetails, setFeeDetails] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    try {
      const res = await api.post('/withdraw/calculate', withdrawalForm);
      setFeeDetails(res.data);
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Error calculating fees:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleConfirmRequest = async () => {
    setIsRequesting(true);
    try {
      await api.post('/withdraw/request', withdrawalForm);
      setShowConfirmModal(false);
      setShowWithdrawalModal(false);
      setWithdrawalForm({ amount: '', method: 'Bank Transfer' });
      // Refresh withdrawals
      const withdrawRes = await api.get('/withdraw/my');
      setWithdrawals(withdrawRes.data.filter((w: any) => w.status === 'pending'));
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Creator Dashboard</h2>
        <button 
          onClick={() => setShowWithdrawalModal(true)}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Request Payout
        </button>
        {/* ... existing points display ... */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><BarChart3 /></div>
            <h3 className="font-semibold text-slate-700">Total Views</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{analytics?.views?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign /></div>
            <h3 className="font-semibold text-slate-700">Recent Earnings</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${earnings.reduce((acc, curr) => acc + curr.totalRevenue, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock /></div>
            <h3 className="font-semibold text-slate-700">Pending Withdrawals</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{withdrawals.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="w-32 h-32" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Next Achievement
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
              <Trophy className="w-10 h-10 text-slate-300" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">Content King</h4>
              <p className="text-sm text-slate-500 mb-4">Upload 50 videos to unlock this badge.</p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[64%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">32 / 50 Videos Uploaded</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <Trophy className="w-40 h-40" />
          </div>
          <h3 className="text-xl font-bold mb-2">Level Up to Gold!</h3>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
            You're only 2,550 points away from Gold Level. Gold creators get a 5% higher revenue share!
          </p>
          <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all">
            View All Perks
          </button>
        </div>
      </div>

      {/* Payout Request Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Request Payout</h3>
            <form onSubmit={handleCalculate} className="space-y-4">
              <input type="number" placeholder="Amount" value={withdrawalForm.amount} onChange={e => setWithdrawalForm({...withdrawalForm, amount: e.target.value})} className="w-full p-3 border rounded-lg" required />
              <select value={withdrawalForm.method} onChange={e => setWithdrawalForm({...withdrawalForm, method: e.target.value})} className="w-full p-3 border rounded-lg">
                <option>Bank Transfer</option>
                <option>PayPal</option>
              </select>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold" disabled={isCalculating}>{isCalculating ? 'Calculating...' : 'Continue'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && feeDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Payout</h3>
            <div className="space-y-2 mb-6 text-sm">
              <p>Amount: ${feeDetails.amount}</p>
              <p>Method: {feeDetails.method}</p>
              <p>Fee: ${feeDetails.fee.toFixed(2)}</p>
              <p className="font-bold">Total to Receive: ${feeDetails.totalToReceive.toFixed(2)}</p>
              <p className="text-slate-500">Processing Time: {feeDetails.processingTime}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-slate-100 py-3 rounded-lg font-bold">Cancel</button>
              <button onClick={handleConfirmRequest} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold" disabled={isRequesting}>{isRequesting ? 'Requesting...' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
