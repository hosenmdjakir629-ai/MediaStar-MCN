import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import api from "../lib/api";
import { auth } from "../lib/firebase";

interface WithdrawalData {
  _id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  method: string;
  date: string;
}

export default function Withdraw() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bKash");
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get("/withdraw/my");
      setWithdrawals(res.data);
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || loading) return;

    setLoading(true);
    try {
      await api.post("/withdraw/request", {
        amount: parseFloat(amount),
        method,
      });
      setAmount("");
      fetchWithdrawals();
    } catch (error) {
      console.error("Failed to request withdrawal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Withdrawals</h2>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Request Payout</h3>
        <form onSubmit={handleRequest} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
              placeholder="0.00"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Method</label>
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)} 
              className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="bKash">bKash</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Payoneer">Payoneer</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Withdrawal History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No withdrawal requests found.</td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{new Date(withdrawal.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${withdrawal.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{withdrawal.method}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        withdrawal.status === 'paid' || withdrawal.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        withdrawal.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
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
