import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import api from "../lib/api";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface WithdrawalData {
  _id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  method: string;
  date: string;
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get("/withdraw/all");
      setWithdrawals(res.data);
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/withdraw/${id}/status`, { status });
      fetchWithdrawals();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Withdrawal Management</h2>
        <p className="text-slate-500 text-sm mt-1">Review and process creator withdrawal requests.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Creator ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading requests...</td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No withdrawal requests found.</td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{withdrawal.userId}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(withdrawal.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${withdrawal.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{withdrawal.method}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        withdrawal.status === 'paid' || withdrawal.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        withdrawal.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {withdrawal.status === 'pending' && <Clock className="w-3 h-3" />}
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {withdrawal.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(withdrawal._id, 'approved')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(withdrawal._id, 'rejected')}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {withdrawal.status === 'approved' && (
                        <button 
                          onClick={() => handleStatusUpdate(withdrawal._id, 'paid')}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
