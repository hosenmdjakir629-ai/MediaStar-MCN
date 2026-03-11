import React, { useState } from 'react';
import { Wallet, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Banknote, Building2, Check, Edit2, Timer, Receipt, Rocket, Printer, X, Star } from 'lucide-react';
import { PayoutRequest } from '../types';
import { auth } from '../src/firebase';

interface PayoutsViewProps {
  isAdmin?: boolean;
  payouts: PayoutRequest[];
  onAddPayout: (payout: Omit<PayoutRequest, 'id'>) => void;
  onUpdatePayout: (id: string, updates: Partial<PayoutRequest>) => void;
  availableBalance: number;
}

const PayoutsView: React.FC<PayoutsViewProps> = ({ 
  isAdmin = false, 
  payouts, 
  onAddPayout, 
  onUpdatePayout,
  availableBalance
}) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [receiptTransaction, setReceiptTransaction] = useState<PayoutRequest | null>(null);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState('nagad');
  const [preferredMethod, setPreferredMethod] = useState('nagad');
  const [withdrawalMethod, setWithdrawalMethod] = useState('nagad');
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [mfsDetails, setMfsDetails] = useState<{ [key: string]: string }>({
    nagad: '01812345678',
    rocket: '01711223344',
    upay: '',
    tap: ''
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Dutch-Bangla Bank Limited (DBBL)',
    accountName: 'Jakir Hosen',
    accountNumber: '123.101.55421'
  });

  const banks = [
    "AB Bank Limited", "Agrani Bank Limited", "Al-Arafah Islami Bank Limited", "Bank Asia Limited",
    "BRAC Bank Limited", "City Bank Limited", "Dutch-Bangla Bank Limited (DBBL)", "Eastern Bank Limited (EBL)",
    "Islami Bank Bangladesh Limited", "Mutual Trust Bank Limited", "Prime Bank Limited", "Pubali Bank Limited",
    "Sonali Bank Limited", "Standard Chartered Bank", "Trust Bank Limited", "United Commercial Bank Limited (UCB)"
  ];

  const getMethodIcon = (method: string) => {
      const normalized = method.toLowerCase();
      if (normalized.includes('nagad')) return <div className="w-5 h-5 flex items-center justify-center font-bold text-white bg-[#ec1d24] rounded text-[10px] shrink-0">N</div>;
      if (normalized.includes('rocket')) return <div className="w-5 h-5 flex items-center justify-center font-bold text-white bg-[#8c3494] rounded text-[10px] shrink-0">R</div>;
      return <Building2 className="w-5 h-5 text-blue-400 shrink-0" />;
  }

  const handleWithdrawClick = () => {
    if (parseFloat(amount) < 1000 || parseFloat(amount) > availableBalance) return;
    setShowConfirmModal(true);
  };

  const confirmWithdrawal = async () => {
    const val = parseFloat(amount);
    setShowConfirmModal(false);
    setIsSubmitting(true);
    
    try {
      let methodDisplay = withdrawalMethod === 'bank' ? 'Bank Transfer' : `${withdrawalMethod.charAt(0).toUpperCase() + withdrawalMethod.slice(1)} (Personal)`;

      await onAddPayout({
        creatorId: auth.currentUser?.uid || '',
        amount: val,
        method: methodDisplay,
        status: 'Pending',
        timestamp: new Date().toISOString(),
        reference: `TXN-${Math.floor(Math.random() * 10000)}`
      });
      
      setAmount('');
      setSuccessMessage("Withdrawal request submitted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error submitting withdrawal", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const getAccountNumber = (method: string) => {
    if (method === 'bank') {
        return bankDetails.accountNumber ? `...${bankDetails.accountNumber.slice(-4)}` : 'Not Configured';
    }
    const num = mfsDetails[method];
    return num ? num : 'Not Configured';
  }

  const isMethodConfigured = (method: string) => {
    if (method === 'bank') return !!bankDetails.accountNumber;
    return !!mfsDetails[method];
  };

  const handleStatusChange = (id: string, newStatus: PayoutRequest['status']) => {
    onUpdatePayout(id, { status: newStatus, processedAt: new Date().toISOString() });
    setEditingStatusId(null);
  };

  const getStatusStyle = (status: PayoutRequest['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Processing': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const totalPaid = payouts.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
  const totalProcessing = payouts.filter(p => p.status === 'Processing' || p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);

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
                 <div className="flex flex-col text-xs uppercase opacity-70">Last Payout: <span className="text-sm font-bold opacity-100">{payouts.filter(p => p.status === 'Paid')[0]?.timestamp ? new Date(payouts.filter(p => p.status === 'Paid')[0].timestamp).toLocaleDateString() : 'N/A'}</span></div>
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
              <p className="text-2xl font-bold text-white mt-1">৳{totalProcessing.toLocaleString()}</p>
           </div>
           <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
               <div className="flex items-center justify-between mb-2"><div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Banknote size={20} /></div></div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Success</h3>
              <p className="text-2xl font-bold text-white mt-1">৳{totalPaid.toLocaleString()}</p>
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
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-400">Select Payout Method</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {['nagad', 'rocket', 'upay', 'tap', 'bank'].map(method => {
                                const configured = isMethodConfigured(method);
                                const isSelected = withdrawalMethod === method;
                                return (
                                    <button 
                                        key={method}
                                        onClick={() => configured && setWithdrawalMethod(method)}
                                        disabled={!configured}
                                        className={`flex-shrink-0 p-3 rounded-xl border transition-all flex flex-col items-center gap-1 min-w-[70px] ${
                                            isSelected ? 'bg-orbit-700 border-orbit-500 ring-1 ring-orbit-500' : 
                                            configured ? 'bg-orbit-900 border-orbit-700 hover:border-orbit-600' : 
                                            'bg-orbit-900/30 border-orbit-800 opacity-40 cursor-not-allowed'
                                        }`}
                                    >
                                        {getMethodIcon(method)}
                                        <span className="text-[10px] font-bold uppercase">{method}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700/50 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {getMethodIcon(withdrawalMethod)}
                                <span className="font-bold text-white text-sm capitalize">{withdrawalMethod === 'bank' ? 'Bank Transfer' : `${withdrawalMethod}`}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-mono font-bold">{getAccountNumber(withdrawalMethod)}</span>
                        </div>
                    </div>
                </div>
                <button onClick={handleWithdrawClick} disabled={isSubmitting || !amount || !isMethodConfigured(withdrawalMethod)} className="w-full mt-6 py-4 rounded-xl font-black text-white shadow-lg transition-all transform active:scale-95 bg-orbit-500 hover:bg-orbit-400 shadow-orbit-500/25 disabled:opacity-50">
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
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {['nagad', 'rocket', 'upay', 'tap', 'bank'].map((method) => {
                            const isActive = paymentMethod === method;
                            return (
                                <button 
                                    key={method} 
                                    onClick={() => setPaymentMethod(method)} 
                                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-3 transition-all relative overflow-hidden group h-28 ${isActive ? 'bg-orbit-700 border-orbit-500 ring-2 ring-orbit-500/50' : 'bg-orbit-900 border-orbit-700 hover:border-orbit-600'}`}
                                >
                                    {isActive && <div className="absolute top-2 right-2 text-orbit-500 bg-white rounded-full p-0.5"><Check size={10} strokeWidth={4} /></div>}
                                    {preferredMethod === method && <div className="absolute top-2 left-2 text-yellow-500 drop-shadow-sm"><Star size={12} fill="currentColor" /></div>}
                                    {!isMethodConfigured(method) && <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-gray-600 rounded-full"></div>}
                                    {isMethodConfigured(method) && <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>}
                                    
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
                        {isMethodConfigured(paymentMethod) && preferredMethod !== paymentMethod && (
                            <div className="absolute bottom-4 right-6 animate-fade-in">
                                <button 
                                    onClick={() => {
                                        setPreferredMethod(paymentMethod);
                                        setWithdrawalMethod(paymentMethod);
                                    }}
                                    className="flex items-center gap-2 text-xs font-bold text-orbit-500 hover:text-orbit-400 transition-colors bg-orbit-900/80 px-3 py-1.5 rounded-lg border border-orbit-700"
                                >
                                    <Star size={14} />
                                    Set as Preferred
                                </button>
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
                        {payouts.map((txn) => (
                            <tr key={txn.id} className="hover:bg-orbit-700/30 transition-colors">
                                <td className="p-4 font-mono text-sm text-gray-300">{txn.reference || txn.id}</td>
                                <td className="p-4 text-xs text-gray-400 font-medium">{new Date(txn.timestamp).toLocaleDateString()}</td>
                                <td className="p-4 text-sm text-white font-bold flex items-center gap-3">
                                    {getMethodIcon(txn.method)}
                                    {txn.method}
                                </td>
                                <td className="p-4 font-mono font-black text-white text-right">৳{txn.amount.toLocaleString()}</td>
                                <td className="p-4">
                                    {isAdmin && editingStatusId === txn.id ? (
                                        <select 
                                            value={txn.status}
                                            onChange={(e) => handleStatusChange(txn.id, e.target.value as PayoutRequest['status'])}
                                            onBlur={() => setEditingStatusId(null)}
                                            autoFocus
                                            className="bg-orbit-900 border border-orbit-700 rounded-lg px-2 py-1 text-[10px] font-black uppercase text-white outline-none focus:border-orbit-500"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(txn.status)}`}>
                                                {txn.status}
                                            </span>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => setEditingStatusId(txn.id)}
                                                    className="p-1 text-gray-500 hover:text-orbit-400 transition-colors"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    )}
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
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Method:</span><span className="text-white font-bold uppercase">{withdrawalMethod}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Number:</span><span className="text-white font-mono font-bold">{getAccountNumber(withdrawalMethod)}</span></div>
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
                        <div className="h-4 bg-orbit-500"></div>
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-orbit-900 rounded-xl flex items-center justify-center text-white"><Rocket size={20} fill="currentColor" /></div>
                                    <span className="text-2xl font-black tracking-tighter">OrbitX MCN</span>
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
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Date:</span><span className="font-bold">{new Date(receiptTransaction.timestamp).toLocaleDateString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Method:</span><span className="font-bold">{receiptTransaction.method}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Status:</span><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">{receiptTransaction.status}</span></div>
                            </div>

                            <div className="pt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Thank you for being part of OrbitX MCN</div>
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