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
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const calculateFee = (amount: number) => amount * 0.02; // Mock 2% fee

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

  const initiateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setShowConfirm(true);
  };

  const performWithdrawal = async () => {
    setShowConfirm(false);
    setLoading(true);
    setAlertMsg(null);
    try {
      await api.post("/withdraw/request", {
        amount: parseFloat(amount),
        method,
      });
      setAmount("");
      fetchWithdrawals();
      setAlertMsg({ type: 'success', text: 'Withdrawal request submitted successfully!' });
    } catch (error) {
      console.error("Failed to request withdrawal:", error);
      setAlertMsg({ type: 'error', text: 'Failed to submit withdrawal request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import api from "../lib/api";
import { Wallet, RefreshCcw, Landmark, Clock, CheckCircle, XCircle } from "lucide-react";

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
  const [showConfirm, setShowConfirm] = useState(false);

  // Mock revenue stats for the UI
  const totalBalance = 24500.50;

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

  const initiateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setShowConfirm(true);
  };

  const performWithdrawal = async () => {
    setShowConfirm(false);
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
      <div className="p-8 bg-black min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Wallet & Earnings</h2>

        {/* --- Balance Summary --- */}
        <div className="flex gap-6 mb-8">
          <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-3xl shadow-sm flex-1">
            <h3 className="text-[#A1A1A1] text-xs uppercase tracking-wide font-medium mb-3">Available Balance</h3>
            <p className="text-5xl font-bold text-[#39FF14]">${totalBalance.toLocaleString()}</p>
          </div>
          <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-3xl shadow-sm flex-1">
            <h3 className="text-[#A1A1A1] text-xs uppercase tracking-wide font-medium mb-3">Pending Withdrawals</h3>
            <p className="text-5xl font-bold text-[#D4AF37]">$1,250.00</p>
          </div>
        </div>

        {/* --- Payout Request --- */}
        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-3xl shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Wallet className="text-[#D4AF37]" size={20} /> Request Payout
          </h3>
          <form onSubmit={initiateWithdrawal} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-xs uppercase text-[#A1A1A1] font-bold mb-2">Amount (USD)</label>
              <input 
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)} 
                className="w-full bg-black border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all" 
                placeholder="0.00" required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#A1A1A1] font-bold mb-2">Payment Method</label>
              <select 
                value={method} onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all"
              >
                <option value="bKash">bKash</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <button 
              type="submit" disabled={loading}
              className="bg-[#D4AF37] text-black px-6 py-4 rounded-xl font-bold hover:bg-[#D4AF37]/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* --- History --- */}
        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#A1A1A1] text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Method</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 text-[#A1A1A1]">{new Date(withdrawal.date).toLocaleDateString()}</td>
                    <td className="py-4 text-white flex items-center gap-2">
                        <Landmark size={16} className="text-[#D4AF37]"/> {withdrawal.method}
                    </td>
                    <td className="py-4 font-bold text-white">${withdrawal.amount.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${
                        withdrawal.status === 'paid' || withdrawal.status === 'approved' ? 'bg-[#39FF14]/10 text-[#39FF14]' : 
                        withdrawal.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 
                        'bg-[#D4AF37]/10 text-[#D4AF37]'
                      }`}>
                        {withdrawal.status === 'paid' && <CheckCircle size={14} />}
                        {withdrawal.status === 'pending' && <Clock size={14} />}
                        {withdrawal.status === 'rejected' && <XCircle size={14} />}
                        {withdrawal.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
}
