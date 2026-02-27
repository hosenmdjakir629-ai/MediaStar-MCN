import React, { useState } from 'react';
import { Wallet, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Banknote, Calendar, Building2, Check, User, Save, X, Edit2, ShieldAlert, Timer, Receipt, Rocket, Printer, Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Processing' | 'Rejected';
  reference: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-8921', date: 'Oct 21, 2023', amount: 12500, method: 'bKash (Personal)', status: 'Paid', reference: '9JKS82LL' },
  { id: 'TXN-8543', date: 'Sep 21, 2023', amount: 14200, method: 'Islami Bank BD', status: 'Paid', reference: 'IBBL-2910' },
  { id: 'TXN-8110', date: 'Aug 21, 2023', amount: 11050, method: 'Nagad (Personal)', status: 'Paid', reference: 'NGD-9921' },
  { id: 'TXN-7902', date: 'Jul 21, 2023', amount: 9500, method: 'bKash (Personal)', status: 'Rejected', reference: 'ERR-291' },
  { id: 'TXN-7541', date: 'Jun 21, 2023', amount: 10800, method: 'bKash (Personal)', status: 'Paid', reference: '8KKS92MM' },
];

const PayoutsView: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [availableBalance, setAvailableBalance] = useState(154200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Edit Transaction State
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Withdrawal Limits State
  const [dailyLimit] = useState(50000);
  const [dailyUsed] = useState(12500);

  // Payment Configuration State
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [mfsDetails, setMfsDetails] = useState<{ [key: string]: string }>({
    bkash: '01978481393',
    nagad: '01812345678',
    rocket: '',
    upay: '',
    tap: ''
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Dutch-Bangla Bank Limited (DBBL)',
    accountName: 'Jakir Hosen',
    accountNumber: '123.101.55421'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  // Constants
  const BKASH_COLOR = '#e2136e';
  const BKASH_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/e/e1/BKash_Logo_Icon.svg';

  const banks = [
    "AB Bank Limited", "Agrani Bank Limited", "Al-Arafah Islami Bank Limited", "Bank Asia Limited",
    "BRAC Bank Limited", "City Bank Limited", "Dutch-Bangla Bank Limited (DBBL)", "Eastern Bank Limited (EBL)",
    "Islami Bank Bangladesh Limited", "Mutual Trust Bank Limited", "Prime Bank Limited", "Pubali Bank Limited",
    "Sonali Bank Limited", "Standard Chartered Bank", "Trust Bank Limited", "United Commercial Bank Limited (UCB)"
  ];

  const getMethodIcon = (method: string) => {
      const normalized = method.toLowerCase();
      if (normalized.includes('bkash')) {
          return (
              <div className="w-5 h-5 bg-[#e2136e] rounded flex items-center justify-center overflow-hidden shrink-0">
                  <img src={BKASH_LOGO_URL} alt="bKash" className="w-3.5 h-3.5 object-contain brightness-0 invert" />
              </div>
          );
      }
      if (normalized.includes('nagad')) return <div className="w-5 h-5 flex items-center justify-center font-bold text-white bg-[#ec1d24] rounded text-[10px] shrink-0">N</div>;
      if (normalized.includes('rocket')) return <div className="w-5 h-5 flex items-center justify-center font-bold text-white bg-[#8c3494] rounded text-[10px] shrink-0">R</div>;
      return <Building2 className="w-5 h-5 text-blue-400 shrink-0" />;
  }

  const handleWithdrawClick = () => {
    if (parseFloat(amount) < 1000 || parseFloat(amount) > availableBalance) return;
    setShowConfirmModal(true);
  };

  const confirmWithdrawal = () => {
    const val = parseFloat(amount);
    setShowConfirmModal(false);
    setIsSubmitting(true);
    
    setTimeout(() => {
      let methodDisplay = paymentMethod === 'bank' ? 'Bank Transfer' : `${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} (Personal)`;

      const newTxn: Transaction = {
        id: `TXN-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: val,
        method: methodDisplay,
        status: 'Processing',
        reference: 'PENDING'
      };
      
      setTransactions([newTxn, ...transactions]);
      setAvailableBalance(prev => prev - val);
      setAmount('');
      setIsSubmitting(false);
      setSuccessMessage("Withdrawal request submitted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1500);
  };

  const handleSaveConfiguration = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        setSavedSuccess(true);
        setIsEditingConfig(false);
        setTimeout(() => setSavedSuccess(false), 3000);
    }, 1000);
  };

  const getCurrentNumber = () => {
    if (paymentMethod === 'bank') {
        return bankDetails.accountNumber ? `...${bankDetails.accountNumber.slice(-4)}` : 'Not Configured';
    }
    const num = mfsDetails[paymentMethod];
    return num ? num : 'Not Configured';
  }

  const handlePrintReceipt = () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write('<html><head><title>Receipt</title><script src="https://cdn.tailwindcss.com"></script></head><body>' + element.innerHTML + '</body></html>');
        iframeDoc.close();
        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-r from-orbit-500 to-indigo-600 rounded-2xl p-8 shadow-lg shadow-orbit-500/20 relative overflow-hidden text-white">
           <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
           <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2 opacity-90">
                <Wallet className="w-5 h-5" />
                <span className="font-medium tracking-wide">Available Balance</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">৳{availableBalance.toLocaleString()} <span className="text-xl font-normal opacity-70">BDT</span></h2>
              <div className="flex items-center justify-between pt-6 border-t border-white/20">
                 <div className="flex flex-col text-xs uppercase opacity-70">Last Payout: <span className="text-sm font-bold opacity-100">Oct 21, 2023</span></div>
                 <div className="flex flex-col text-xs uppercase opacity-70 text-right">Next Pay: <span className="text-sm font-bold opacity-100">Nov 21, 2023</span></div>
              </div>
           </div>
        </div>
        <div className="space-y-6">
           <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
              <div className="flex items-center justify-between mb-2">
                 <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Clock size={20} /></div>
                 <span className="text-xs text-gray-500 font-medium">PENDING</span>
              </div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Processing</h3>
              <p className="text-2xl font-bold text-white mt-1">৳12,400</p>
           </div>
           <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
               <div className="flex items-center justify-between mb-2"><div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Banknote size={20} /></div></div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Success</h3>
              <p className="text-2xl font-bold text-white mt-1">৳420,500</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Withdrawal Request */}
        <div className="lg:col-span-1">
            <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700 h-full flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><ArrowUpRight className="text-orbit-accent" />Request Payout</h3>
                <div className="space-y-4 flex-1">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Amount (BDT)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-orbit-500 transition-colors font-mono text-lg" />
                        </div>
                    </div>
                    <div className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700/50">
                        <span className="text-xs text-gray-500 block mb-1">Target Account</span>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {getMethodIcon(paymentMethod)}
                                <span className="font-bold text-white text-sm capitalize">{paymentMethod === 'bank' ? 'Bank Transfer' : `${paymentMethod}`}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-mono font-bold">{getCurrentNumber()}</span>
                        </div>
                    </div>
                </div>
                <button onClick={handleWithdrawClick} disabled={isSubmitting || !amount || getCurrentNumber() === 'Not Configured'} className="w-full mt-6 py-4 rounded-xl font-black text-white shadow-lg transition-all transform active:scale-95 bg-orbit-500 hover:bg-orbit-400 shadow-orbit-500/25 disabled:opacity-50">
                    {isSubmitting ? 'Processing...' : 'Submit Request'}
                </button>
                {successMessage && <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-2 text-green-400 text-sm animate-fade-in"><CheckCircle2 size={16} /><span>{successMessage}</span></div>}
            </div>
        </div>

        {/* Right: Payment Configuration */}
        <div className="lg:col-span-2">
           <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Building2 className="text-green-400" /> Payment Settings</h3>
                    {isEditingConfig ? (
                        <button onClick={handleSaveConfiguration} disabled={isSaving} className={`px-6 py-2 rounded-xl font-bold transition-all ${savedSuccess ? 'bg-green-500 text-white' : 'bg-orbit-500 text-white'}`}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    ) : (
                        <button onClick={() => setIsEditingConfig(true)} className="px-6 py-2 bg-orbit-700 hover:bg-orbit-600 text-white rounded-xl font-bold transition-all flex items-center gap-2">
                            <Edit2 size={16} />
                            <span>Edit Details</span>
                        </button>
                    )}
                </div>

                <div className="space-y-8 flex-1">
                    {/* Method Selection Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {['bkash', 'nagad', 'rocket', 'upay', 'tap', 'bank'].map((method) => {
                            const isActive = paymentMethod === method;
                            return (
                                <button 
                                    key={method} 
                                    onClick={() => setPaymentMethod(method)} 
                                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-3 transition-all relative overflow-hidden group h-28 ${isActive ? 'bg-orbit-700 border-orbit-500 ring-2 ring-orbit-500/50' : 'bg-orbit-900 border-orbit-700 hover:border-orbit-600'}`}
                                >
                                    {isActive && <div className="absolute top-2 right-2 text-orbit-500 bg-white rounded-full p-0.5"><Check size={10} strokeWidth={4} /></div>}
                                    
                                    {method === 'bkash' && (
                                        <div className="w-10 h-10 bg-[#e2136e] rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                            <img src={BKASH_LOGO_URL} alt="bKash" className="w-6 h-6 object-contain brightness-0 invert z-10" />
                                        </div>
                                    )}
                                    {method === 'nagad' && <div className="w-10 h-10 bg-[#ec1d24] rounded-xl flex items-center justify-center shadow-lg font-black text-white text-lg group-hover:scale-110 transition-transform">N</div>}
                                    {method === 'rocket' && <div className="w-10 h-10 bg-[#8c3494] rounded-xl flex items-center justify-center shadow-lg font-black text-white text-lg group-hover:scale-110 transition-transform">R</div>}
                                    {method === 'upay' && <div className="w-10 h-10 bg-[#00a1e0] rounded-xl flex items-center justify-center shadow-lg font-black text-white text-lg group-hover:scale-110 transition-transform">U</div>}
                                    {method === 'tap' && <div className="w-10 h-10 bg-[#682c91] rounded-xl flex items-center justify-center shadow-lg font-black text-white text-lg group-hover:scale-110 transition-transform">T</div>}
                                    {method === 'bank' && <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Building2 size={20} className="text-white" /></div>}
                                    
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-500'}`}>{method}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Specific Detail Input */}
                    <div className="p-6 bg-orbit-900/40 rounded-3xl border border-orbit-700/50 min-h-[160px] flex items-center">
                        {paymentMethod === 'bkash' && (
                            <div className="w-full flex flex-col md:flex-row items-center gap-8 animate-fade-in">
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="w-20 h-20 bg-[#e2136e] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#e2136e]/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                                        <img src={BKASH_LOGO_URL} alt="bKash" className="w-12 h-12 object-contain brightness-0 invert z-10" />
                                    </div>
                                    <div className="mt-3 text-[10px] font-black text-[#e2136e] uppercase tracking-[0.2em]">Verified MFS</div>
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">bKash Account Number (Personal/Agent)</label>
                                    <input 
                                        type="text" 
                                        value={mfsDetails.bkash} 
                                        onChange={(e) => setMfsDetails({...mfsDetails, bkash: e.target.value})} 
                                        disabled={!isEditingConfig}
                                        placeholder="+880 19XX XXXXXX"
                                        className={`w-full bg-orbit-900/60 border rounded-2xl px-5 py-4 text-white font-mono text-xl tracking-widest outline-none transition-all ${!isEditingConfig ? 'border-orbit-700/30 text-gray-500 cursor-not-allowed' : 'border-[#e2136e]/40 focus:border-[#e2136e] focus:ring-1 focus:ring-[#e2136e]/20 shadow-inner'}`}
                                    />
                                    <p className="text-[10px] text-gray-600 ml-1">Daily limits for cash-out may apply based on your bKash account type.</p>
                                </div>
                            </div>
                        )}

                        {['nagad', 'rocket', 'upay', 'tap'].includes(paymentMethod) && (
                            <div className="w-full animate-fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    {getMethodIcon(paymentMethod)}
                                    <h4 className="font-bold text-white capitalize">{paymentMethod} Account Detail</h4>
                                </div>
                                <input 
                                    type="text" 
                                    value={mfsDetails[paymentMethod]} 
                                    onChange={(e) => setMfsDetails({...mfsDetails, [paymentMethod]: e.target.value})} 
                                    disabled={!isEditingConfig}
                                    placeholder="+880 1XXX XXXXXX"
                                    className={`w-full bg-orbit-900/60 border rounded-2xl px-5 py-4 text-white font-mono text-xl tracking-widest outline-none transition-all ${!isEditingConfig ? 'border-orbit-700/30 text-gray-500 cursor-not-allowed' : 'border-orbit-600 focus:border-orbit-500 shadow-inner'}`}
                                />
                            </div>
                        )}

                        {paymentMethod === 'bank' && (
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Registered Bank</label>
                                    <select 
                                        value={bankDetails.bankName} 
                                        onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} 
                                        disabled={!isEditingConfig}
                                        className={`w-full bg-orbit-900 border rounded-xl px-4 py-3 focus:border-orbit-500 outline-none transition-colors ${!isEditingConfig ? 'border-orbit-700/30 text-gray-500 cursor-not-allowed' : 'border-orbit-700 text-white'}`}
                                    >
                                        {banks.map((bank, index) => <option key={index} value={bank}>{bank}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Account Holder</label>
                                    <input type="text" value={bankDetails.accountName} onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})} disabled={!isEditingConfig} className="w-full bg-orbit-900/60 border border-orbit-700/30 rounded-xl px-4 py-2.5 text-white disabled:opacity-50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Account Number</label>
                                    <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} disabled={!isEditingConfig} className="w-full bg-orbit-900/60 border border-orbit-700/30 rounded-xl px-4 py-2.5 text-white font-mono disabled:opacity-50" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

       {/* Transaction History */}
       <div className="bg-orbit-800 rounded-2xl border border-orbit-700 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-orbit-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Timer size={18} className="text-orbit-500" />
                    Payout History
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-orbit-900/50 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="p-4 font-bold tracking-wider">Transaction ID</th>
                            <th className="p-4 font-bold tracking-wider">Date</th>
                            <th className="p-4 font-bold tracking-wider">Method</th>
                            <th className="p-4 font-bold tracking-wider text-right">Amount</th>
                            <th className="p-4 font-bold tracking-wider">Status</th>
                            <th className="p-4 font-bold tracking-wider text-right">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-orbit-700">
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-orbit-700/30 transition-colors">
                                <td className="p-4 font-mono text-sm text-gray-300">{txn.id}</td>
                                <td className="p-4 text-xs text-gray-400 font-medium">{txn.date}</td>
                                <td className="p-4 text-sm text-white font-bold flex items-center gap-3">
                                    {getMethodIcon(txn.method)}
                                    {txn.method}
                                </td>
                                <td className="p-4 font-mono font-black text-white text-right">৳{txn.amount.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        txn.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        txn.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setReceiptTransaction(txn)} className="p-2 text-gray-400 hover:text-white hover:bg-orbit-700 rounded-lg transition-colors">
                                        <Receipt size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modals: Confirmation and Receipt */}
        {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowConfirmModal(false)}>
                <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-orbit-700 flex justify-between items-center bg-orbit-800">
                        <h3 className="text-xl font-bold text-white">Confirm Withdrawal</h3>
                        <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="bg-orbit-800/50 rounded-2xl p-6 border border-orbit-700 text-center">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-2">Requesting Payout of</span>
                            <div className="text-5xl font-black text-white tracking-tighter">৳{parseFloat(amount).toLocaleString()}</div>
                        </div>
                        <div className="space-y-3 px-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Method:</span><span className="text-white font-bold uppercase">{paymentMethod}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Number:</span><span className="text-white font-mono font-bold">{getCurrentNumber()}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Estimated Arrival:</span><span className="text-green-400 font-bold">10-30 Mins</span></div>
                        </div>
                        <button onClick={confirmWithdrawal} className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl shadow-xl shadow-green-500/20 transition-all transform active:scale-95">
                            CONFIRM PAYOUT
                        </button>
                    </div>
                </div>
            </div>
        )}

        {receiptTransaction && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setReceiptTransaction(null)}>
                <div className="w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
                    <div id="receipt-content" className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl text-orbit-900">
                        <div className="h-4 bg-[#e2136e]"></div>
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-orbit-900 rounded-xl flex items-center justify-center text-white"><Rocket size={20} fill="currentColor" /></div>
                                    <span className="text-2xl font-black tracking-tighter">MediaStar MCN</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Txn ID</span>
                                    <span className="font-mono text-xs font-bold">{receiptTransaction.id}</span>
                                </div>
                            </div>
                            
                            <div className="text-center py-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Payment Sent</span>
                                <div className="text-6xl font-black mt-2 tracking-tighter">৳{receiptTransaction.amount.toLocaleString()}</div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Date:</span><span className="font-bold">{receiptTransaction.date}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Method:</span><span className="font-bold">{receiptTransaction.method}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Status:</span><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">{receiptTransaction.status}</span></div>
                            </div>

                            <div className="pt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Thank you for being part of MediaStar MCN</div>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button onClick={() => setReceiptTransaction(null)} className="p-4 bg-orbit-800 text-white rounded-2xl hover:bg-orbit-700 transition-all"><X size={20} /></button>
                        <button onClick={handlePrintReceipt} className="flex-1 py-4 bg-white text-orbit-900 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"><Printer size={20} /> PRINT</button>
                    </div>
                </div>
             </div>
        )}
    </div>
  );
};

export default PayoutsView;