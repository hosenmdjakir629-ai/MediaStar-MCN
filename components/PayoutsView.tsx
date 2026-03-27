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
  
  const [paymentMethod, setPaymentMethod] = useState('rocket');
  const [preferredMethod, setPreferredMethod] = useState('rocket');
  const [withdrawalMethod, setWithdrawalMethod] = useState('rocket');
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [mfsDetails, setMfsDetails] = useState<{ [key: string]: string }>({
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
        iframeDoc.write('<html><head><title>Receipt</title></head><body>' + element.innerHTML + '</body></html>');
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 orbit-gradient rounded-[2.5rem] p-10 shadow-2xl shadow-orbit-500/20 relative overflow-hidden text-white group">
           <div className="absolute right-0 top-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
           <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4 opacity-80">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="font-bold tracking-widest text-xs uppercase">Available Balance</span>
              </div>
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-6xl font-black font-display tracking-tighter">৳{availableBalance.toLocaleString()}</h2>
                <span className="text-2xl font-medium opacity-60 font-display">BDT</span>
              </div>
              <div className="flex items-center justify-between pt-8 border-t border-white/10">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Last Payout</span>
                   <span className="text-sm font-bold">{payouts.filter(p => p.status === 'Paid')[0]?.timestamp ? new Date(payouts.filter(p => p.status === 'Paid')[0].timestamp).toLocaleDateString() : 'N/A'}</span>
                 </div>
                 <div className="flex flex-col text-right">
                   <span className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Next Cycle</span>
                   <span className="text-sm font-bold">Nov 21, 2023</span>
                 </div>
              </div>
           </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
           <div className="glass-panel rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Clock size={80} />
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 border border-yellow-500/20 shadow-lg shadow-yellow-500/5">
                   <Clock size={24} />
                 </div>
                 <div className="px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-[10px] font-black text-yellow-500 tracking-widest uppercase">PENDING</div>
              </div>
              <h3 className="text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10">Processing</h3>
              <p className="text-3xl font-black text-white font-display relative z-10">৳{totalProcessing.toLocaleString()}</p>
           </div>
           <div className="glass-panel rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Banknote size={80} />
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                   <Banknote size={24} />
                 </div>
                 <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black text-emerald-500 tracking-widest uppercase">SUCCESS</div>
              </div>
              <h3 className="text-surface-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 relative z-10">Total Success</h3>
              <p className="text-3xl font-black text-white font-display relative z-10">৳{totalPaid.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Withdrawal Request */}
        <div className="lg:col-span-1">
            <div className="glass-panel rounded-[2.5rem] p-8 border border-white/5 h-full flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                  <ArrowUpRight size={100} className="text-orbit-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 font-display relative z-10">
                  <div className="p-2 bg-orbit-500/10 rounded-xl text-orbit-500">
                    <ArrowUpRight size={20} />
                  </div>
                  Request Payout
                </h3>
                
                <div className="space-y-6 flex-1 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-surface-500 uppercase tracking-widest mb-3 ml-1">Amount (BDT)</label>
                        <div className="relative group/input">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-orbit-500 font-black text-xl">৳</span>
                            <input 
                              type="number" 
                              value={amount} 
                              onChange={(e) => setAmount(e.target.value)} 
                              placeholder="0.00" 
                              className="w-full bg-surface-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white outline-none focus:border-orbit-500/50 transition-all font-mono text-2xl font-black placeholder:text-surface-700 shadow-inner" 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Payout Method</label>
                        <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                            {['rocket', 'upay', 'tap', 'bank'].map(method => {
                                const configured = isMethodConfigured(method);
                                const isSelected = withdrawalMethod === method;
                                return (
                                    <button 
                                        key={method}
                                        onClick={() => configured && setWithdrawalMethod(method)}
                                        disabled={!configured}
                                        className={`flex-shrink-0 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 min-w-[85px] relative group/btn ${
                                            isSelected ? 'bg-orbit-500/10 border-orbit-500/50 shadow-lg shadow-orbit-500/10' : 
                                            configured ? 'bg-surface-900/50 border-white/5 hover:border-white/10' : 
                                            'bg-surface-950/30 border-white/5 opacity-30 cursor-not-allowed'
                                        }`}
                                    >
                                        <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover/btn:scale-110'}`}>
                                          {getMethodIcon(method)}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-orbit-400' : 'text-surface-500'}`}>{method}</span>
                                        {isSelected && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orbit-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="p-5 bg-surface-950/50 rounded-2xl border border-white/5 flex items-center justify-between group/info hover:border-white/10 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/5 rounded-xl">
                                  {getMethodIcon(withdrawalMethod)}
                                </div>
                                <span className="font-bold text-white text-sm capitalize tracking-tight">{withdrawalMethod === 'bank' ? 'Bank Transfer' : `${withdrawalMethod}`}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-0.5">Account</span>
                              <span className="text-xs text-orbit-400 font-mono font-bold tracking-wider">{getAccountNumber(withdrawalMethod)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={handleWithdrawClick} 
                  disabled={isSubmitting || !amount || !isMethodConfigured(withdrawalMethod)} 
                  className="w-full mt-8 py-5 rounded-2xl font-black text-white shadow-2xl transition-all transform active:scale-95 bg-orbit-500 hover:bg-orbit-400 shadow-orbit-500/20 disabled:opacity-30 disabled:cursor-not-allowed relative z-10 group/submit"
                >
                    <div className="flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Rocket size={20} className="group-hover/submit:-translate-y-1 group-hover/submit:translate-x-1 transition-transform" />
                          <span>SUBMIT REQUEST</span>
                        </>
                      )}
                    </div>
                </button>
                
                {successMessage && (
                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-emerald-400 text-sm animate-fade-in relative z-10">
                    <CheckCircle2 size={18} />
                    <span className="font-bold">{successMessage}</span>
                  </div>
                )}
            </div>
        </div>

        {/* Right: Payment Configuration */}
        <div className="lg:col-span-2">
           <div className="glass-panel rounded-[2.5rem] p-8 border border-white/5 h-full flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 font-display">
                      <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Building2 size={20} />
                      </div>
                      Payment Settings
                    </h3>
                    {isEditingConfig ? (
                        <button 
                          onClick={handleSaveConfiguration} 
                          disabled={isSaving} 
                          className={`px-8 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${savedSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-orbit-500 text-white shadow-orbit-500/20'}`}
                        >
                            {isSaving ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>SAVING...</span>
                              </div>
                            ) : savedSuccess ? 'SAVED!' : 'SAVE CHANGES'}
                        </button>
                    ) : (
                        <button 
                          onClick={() => setIsEditingConfig(true)} 
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/5 backdrop-blur-md active:scale-95"
                        >
                            <Edit2 size={16} className="text-orbit-400" />
                            <span>Edit Details</span>
                        </button>
                    )}
                </div>

                <div className="space-y-8 flex-1 relative z-10">
                    {/* Method Selection Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                        {['rocket', 'upay', 'tap', 'bank'].map((method) => {
                            const isActive = paymentMethod === method;
                            return (
                                <button 
                                    key={method} 
                                    onClick={() => setPaymentMethod(method)} 
                                    className={`p-4 rounded-3xl border flex flex-col items-center justify-center space-y-3 transition-all relative overflow-hidden group h-32 ${isActive ? 'bg-orbit-500/10 border-orbit-500/50 shadow-xl shadow-orbit-500/10' : 'bg-surface-900/50 border-white/5 hover:border-white/10'}`}
                                >
                                    {isActive && <div className="absolute top-3 right-3 text-orbit-500 bg-white rounded-full p-0.5 shadow-lg"><Check size={10} strokeWidth={4} /></div>}
                                    {preferredMethod === method && <div className="absolute top-3 left-3 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"><Star size={12} fill="currentColor" /></div>}
                                    
                                    <div className="relative">
                                      {method === 'rocket' && <div className="w-12 h-12 bg-[#8c3494] rounded-2xl flex items-center justify-center shadow-2xl font-black text-white text-xl group-hover:scale-110 transition-transform">R</div>}
                                      {method === 'upay' && <div className="w-12 h-12 bg-[#00a1e0] rounded-2xl flex items-center justify-center shadow-2xl font-black text-white text-xl group-hover:scale-110 transition-transform">U</div>}
                                      {method === 'tap' && <div className="w-12 h-12 bg-[#682c91] rounded-2xl flex items-center justify-center shadow-2xl font-black text-white text-xl group-hover:scale-110 transition-transform">T</div>}
                                      {method === 'bank' && <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"><Building2 size={24} className="text-white" /></div>}
                                      
                                      {isMethodConfigured(method) ? (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                      ) : (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-surface-700 rounded-full border-2 border-surface-900"></div>
                                      )}
                                    </div>
                                    
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-white' : 'text-surface-500'}`}>{method}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Specific Detail Input */}
                    <div className="p-8 bg-surface-950/50 rounded-[2rem] border border-white/5 min-h-[200px] flex items-center relative group/input-box overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orbit-500/50 opacity-0 group-hover/input-box:opacity-100 transition-opacity"></div>
                        
                        {['rocket', 'upay', 'tap'].includes(paymentMethod) && (
                            <div className="w-full animate-fade-in relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                      <div className="p-2 bg-white/5 rounded-xl">
                                        {getMethodIcon(paymentMethod)}
                                      </div>
                                      <h4 className="font-bold text-white capitalize text-lg tracking-tight">{paymentMethod} Account Detail</h4>
                                    </div>
                                    {isMethodConfigured(paymentMethod) && preferredMethod !== paymentMethod && (
                                        <button 
                                            onClick={() => {
                                                setPreferredMethod(paymentMethod);
                                                setWithdrawalMethod(paymentMethod);
                                            }}
                                            className="flex items-center gap-2 text-[10px] font-black text-orbit-400 hover:text-orbit-300 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest active:scale-95"
                                        >
                                            <Star size={14} className="fill-orbit-400" />
                                            Set as Preferred
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                  <input 
                                      type="text" 
                                      value={mfsDetails[paymentMethod]} 
                                      onChange={(e) => setMfsDetails({...mfsDetails, [paymentMethod]: e.target.value})} 
                                      disabled={!isEditingConfig}
                                      placeholder="+880 1XXX XXXXXX"
                                      className={`w-full bg-surface-950/50 border rounded-2xl px-6 py-5 text-white font-mono text-2xl tracking-[0.2em] outline-none transition-all ${!isEditingConfig ? 'border-white/5 text-surface-600 cursor-not-allowed' : 'border-white/10 focus:border-orbit-500/50 shadow-2xl'}`}
                                  />
                                  {!isEditingConfig && <div className="absolute right-6 top-1/2 -translate-y-1/2"><Clock size={18} className="text-surface-700" /></div>}
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'bank' && (
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in relative z-10">
                                <div className="md:col-span-2 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Registered Bank</label>
                                      {isMethodConfigured('bank') && preferredMethod !== 'bank' && (
                                          <button 
                                              onClick={() => {
                                                  setPreferredMethod('bank');
                                                  setWithdrawalMethod('bank');
                                              }}
                                              className="flex items-center gap-2 text-[10px] font-black text-orbit-400 hover:text-orbit-300 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest active:scale-95"
                                          >
                                              <Star size={14} className="fill-orbit-400" />
                                              Set as Preferred
                                          </button>
                                      )}
                                    </div>
                                    <select 
                                        value={bankDetails.bankName} 
                                        onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} 
                                        disabled={!isEditingConfig}
                                        className={`w-full bg-surface-950/50 border rounded-2xl px-6 py-4 focus:border-orbit-500/50 outline-none transition-all appearance-none ${!isEditingConfig ? 'border-white/5 text-surface-600 cursor-not-allowed' : 'border-white/10 text-white'}`}
                                    >
                                        {banks.map((bank, index) => <option key={index} value={bank} className="bg-surface-900">{bank}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Account Holder</label>
                                    <input 
                                      type="text" 
                                      value={bankDetails.accountName} 
                                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})} 
                                      disabled={!isEditingConfig} 
                                      className={`w-full bg-surface-950/50 border rounded-2xl px-6 py-4 text-white outline-none transition-all ${!isEditingConfig ? 'border-white/5 text-surface-600 cursor-not-allowed' : 'border-white/10 focus:border-orbit-500/50'}`} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Account Number</label>
                                    <input 
                                      type="text" 
                                      value={bankDetails.accountNumber} 
                                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} 
                                      disabled={!isEditingConfig} 
                                      className={`w-full bg-surface-950/50 border rounded-2xl px-6 py-4 text-white font-mono outline-none transition-all ${!isEditingConfig ? 'border-white/5 text-surface-600 cursor-not-allowed' : 'border-white/10 focus:border-orbit-500/50'}`} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

       {/* Transaction History */}
       <div className="glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-white/5 flex justify-between items-center relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 font-display">
                    <div className="p-2 bg-orbit-500/10 rounded-xl text-orbit-500">
                      <Timer size={20} />
                    </div>
                    Payout History
                </h3>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-black text-surface-400 tracking-widest uppercase">ALL TRANSACTIONS</div>
                </div>
            </div>
            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-surface-500 text-[10px] uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-6 font-black">Transaction ID</th>
                            <th className="p-6 font-black">Date</th>
                            <th className="p-6 font-black">Method</th>
                            <th className="p-6 font-black text-right">Amount</th>
                            <th className="p-6 font-black">Status</th>
                            <th className="p-6 font-black text-right">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payouts.map((txn) => (
                            <tr key={txn.id} className="hover:bg-white/5 transition-colors group/row">
                                <td className="p-6">
                                  <span className="font-mono text-xs text-surface-400 group-hover/row:text-orbit-400 transition-colors">{txn.reference || txn.id}</span>
                                </td>
                                <td className="p-6">
                                  <span className="text-xs text-surface-500 font-bold">{new Date(txn.timestamp).toLocaleDateString()}</span>
                                </td>
                                <td className="p-6">
                                  <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-white/5 rounded-lg">
                                      {getMethodIcon(txn.method)}
                                    </div>
                                    <span className="text-sm text-white font-bold tracking-tight">{txn.method}</span>
                                  </div>
                                </td>
                                <td className="p-6 text-right">
                                  <span className="font-mono font-black text-white text-lg tracking-tighter">৳{txn.amount.toLocaleString()}</span>
                                </td>
                                <td className="p-6">
                                    {isAdmin && editingStatusId === txn.id ? (
                                        <select 
                                            value={txn.status}
                                            onChange={(e) => handleStatusChange(txn.id, e.target.value as PayoutRequest['status'])}
                                            onBlur={() => setEditingStatusId(null)}
                                            autoFocus
                                            className="bg-surface-950 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-white outline-none focus:border-orbit-500/50"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(txn.status)}`}>
                                                {txn.status}
                                            </span>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => setEditingStatusId(txn.id)}
                                                    className="p-2 text-surface-600 hover:text-orbit-400 transition-all hover:bg-white/5 rounded-lg active:scale-90"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="p-6 text-right">
                                    <button 
                                      onClick={() => setReceiptTransaction(txn)} 
                                      className="p-3 text-surface-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90"
                                    >
                                        <Receipt size={20} />
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fade-in" onClick={() => setShowConfirmModal(false)}>
                <div className="glass-panel border border-white/10 rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-2xl font-black text-white font-display tracking-tight">Confirm Payout</h3>
                        <button onClick={() => setShowConfirmModal(false)} className="p-2 text-surface-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="bg-surface-950/50 rounded-[2.5rem] p-10 border border-white/5 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-orbit-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] block mb-4 relative z-10">Requesting Payout of</span>
                            <div className="text-6xl font-black text-white tracking-tighter font-display relative z-10">৳{parseFloat(amount).toLocaleString()}</div>
                        </div>
                        <div className="space-y-4 px-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-surface-500 font-bold uppercase tracking-widest text-[10px]">Method</span>
                              <span className="text-white font-black uppercase tracking-tight">{withdrawalMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-surface-500 font-bold uppercase tracking-widest text-[10px]">Account</span>
                              <span className="text-orbit-400 font-mono font-bold tracking-wider">{getAccountNumber(withdrawalMethod)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-surface-500 font-bold uppercase tracking-widest text-[10px]">Est. Arrival</span>
                              <span className="text-emerald-400 font-black tracking-tight">10-30 MINS</span>
                            </div>
                        </div>
                        <button 
                          onClick={confirmWithdrawal} 
                          className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-3xl shadow-2xl shadow-emerald-500/20 transition-all transform active:scale-95 text-lg tracking-widest"
                        >
                            CONFIRM PAYOUT
                        </button>
                    </div>
                </div>
            </div>
        )}

        {receiptTransaction && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-fade-in" onClick={() => setReceiptTransaction(null)}>
                <div className="w-full max-w-sm relative animate-scale-in" onClick={e => e.stopPropagation()}>
                    <div id="receipt-content" className="bg-white rounded-[3rem] overflow-hidden shadow-2xl text-surface-950">
                        <div className="h-6 orbit-gradient"></div>
                        <div className="p-10 space-y-10">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-surface-950 rounded-2xl flex items-center justify-center text-white shadow-xl"><Rocket size={24} fill="currentColor" /></div>
                                    <span className="text-2xl font-black tracking-tighter font-display">OrbitX MCN</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest block mb-1">Txn ID</span>
                                    <span className="font-mono text-xs font-bold bg-surface-100 px-2 py-1 rounded-lg">{receiptTransaction.id}</span>
                                </div>
                            </div>
                            
                            <div className="text-center py-6 bg-surface-50 rounded-[2.5rem] border border-surface-100">
                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-[0.4em]">Payment Sent</span>
                                <div className="text-6xl font-black mt-3 tracking-tighter font-display">৳{receiptTransaction.amount.toLocaleString()}</div>
                            </div>

                            <div className="space-y-5 pt-6 border-t border-surface-100">
                                <div className="flex justify-between text-sm"><span className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">Date</span><span className="font-black">{new Date(receiptTransaction.timestamp).toLocaleDateString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">Method</span><span className="font-black uppercase">{receiptTransaction.method}</span></div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">Status</span>
                                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">{receiptTransaction.status}</span>
                                </div>
                            </div>

                            <div className="pt-10 text-center">
                              <div className="text-[10px] text-surface-400 font-black uppercase tracking-[0.3em] mb-4">Thank you for being part of OrbitX</div>
                              <div className="flex justify-center gap-1">
                                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button onClick={() => setReceiptTransaction(null)} className="p-5 bg-white/10 text-white rounded-[2rem] hover:bg-white/20 transition-all border border-white/10 active:scale-90"><X size={24} /></button>
                        <button onClick={handlePrintReceipt} className="flex-1 py-5 bg-white text-surface-950 rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3 hover:bg-surface-100 transition-all active:scale-95 text-lg tracking-widest"><Printer size={24} /> PRINT RECEIPT</button>
                    </div>
                </div>
             </div>
        )}
    </div>
  );
};

export default PayoutsView;