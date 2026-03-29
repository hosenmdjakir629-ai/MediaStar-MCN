import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, ArrowRight, CheckCircle2, Lock, Rocket, User, CreditCard, ClipboardCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { MOBILE_PAYMENT_NUMBERS, PAYMENT_AMOUNT } from "../constants";

const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay'>('bkash');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const navigate = useNavigate();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || !trxId) {
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "payments"), {
        name,
        email,
        method: selectedMethod,
        mobileNumber,
        trxId,
        amount: 20,
        currency: 'USD',
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate("/success");
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { 
      id: 'bkash', 
      name: 'bKash', 
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Bkash_logo.svg/1200px-Bkash_logo.svg.png",
      color: "#D12053"
    },
    { 
      id: 'nagad', 
      name: 'Nagad', 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nagad_Logo.svg/1200px-Nagad_Logo.svg.png",
      color: "#F7941D"
    },
    { 
      id: 'rocket', 
      name: 'Rocket', 
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Dutch_Bangla_Bank_Rocket_logo.svg/1200px-Dutch_Bangla_Bank_Rocket_logo.svg.png",
      color: "#8C3494"
    },
    { 
      id: 'upay', 
      name: 'Upay', 
      logo: "https://seeklogo.com/images/U/upay-logo-0D650948C4-seeklogo.com.png",
      color: "#FFD400"
    },
  ];

  const nextStep = () => {
    if (step === 1 && (!name || !email)) {
      alert("Please enter your name and email.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[140px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen"></div>
      </div>

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-16 relative z-10">
        <a href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Rocket size={20} />
          </div>
          <div className="text-2xl font-black tracking-tighter text-white uppercase">OrbitX</div>
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-surface-400">
            <ShieldCheck size={12} className="text-green-400" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Left Column: Progress & Summary */}
        <div className="lg:col-span-4 space-y-8">
          {/* Progress Stepper */}
          <div className="space-y-6">
            {[
              { id: 1, label: "Account Details", icon: <User size={18} /> },
              { id: 2, label: "Payment Method", icon: <CreditCard size={18} /> },
              { id: 3, label: "Verification", icon: <ClipboardCheck size={18} /> }
            ].map((s) => (
              <div key={s.id} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                  step === s.id 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : step > s.id 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-white/5 text-surface-500 border-white/5'
                }`}>
                  {step > s.id ? <CheckCircle2 size={18} /> : s.icon}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${step === s.id ? 'text-white' : 'text-surface-600'}`}>Step 0{s.id}</span>
                  <span className={`text-sm font-bold ${step === s.id ? 'text-white' : 'text-surface-400'}`}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500">Order Summary</h3>
              <Zap size={14} className="text-orbit-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">Premium Creator Plan</p>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">One-time activation</p>
                </div>
                <span className="font-black text-lg">$20.00</span>
              </div>
              
              <div className="h-px bg-white/5 w-full" />
              
              <div className="space-y-2">
                {["Content ID Access", "Priority Support", "Global Distribution"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-surface-400">
                    <CheckCircle2 size={12} className="text-orbit-400" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold text-surface-500 uppercase">Total Payable</span>
              <span className="text-2xl font-black text-white">$20.00</span>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
              <ShieldCheck size={16} />
            </div>
            <div className="text-[10px] text-surface-400 leading-tight">
              <p className="font-bold text-white uppercase tracking-wider">Secure Infrastructure</p>
              <p>256-bit SSL encryption active</p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Form Content */}
        <div className="lg:col-span-8">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] p-8 sm:p-12 min-h-[500px] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter">Account Details</h2>
                    <p className="text-surface-500 text-sm">Enter the information for your creator account.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-surface-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@orbitx.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-surface-700"
                      />
                    </div>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={nextStep}
                      className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-all active:scale-95"
                    >
                      Continue to Payment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter">Choose Method</h2>
                    <p className="text-surface-500 text-sm">Select your preferred mobile payment gateway.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id as any)}
                        className={`relative flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 group ${
                          selectedMethod === method.id 
                            ? 'bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                            : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedMethod === method.id ? 'text-black/40' : 'text-surface-500'}`}>Gateway</span>
                          <span className={`text-lg font-black ${selectedMethod === method.id ? 'text-black' : 'text-white'}`}>{method.name}</span>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center shadow-sm">
                          <img src={method.logo} alt={method.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        {selectedMethod === method.id && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#0A0A0A]">
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-8 flex items-center gap-4">
                    <button 
                      onClick={prevStep}
                      className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextStep}
                      className="flex-1 group flex items-center justify-center gap-3 bg-white text-black py-4 rounded-full font-bold hover:scale-[1.02] transition-all active:scale-95"
                    >
                      Proceed to Verification <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter">Verify Payment</h2>
                    <p className="text-surface-500 text-sm">Follow the instructions to complete your transaction.</p>
                  </div>

                  <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <img src={paymentMethods.find(m => m.id === selectedMethod)?.logo} className="w-24 h-24 object-contain grayscale invert" alt="" />
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center gap-2 text-orbit-400">
                        <Zap size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Payment Instruction</span>
                      </div>
                      <p className="text-surface-300 text-sm leading-relaxed max-w-md">
                        Please send <span className="text-white font-bold">৳{PAYMENT_AMOUNT}</span> to the following <span className="text-white font-bold capitalize">{selectedMethod}</span> number using <span className="text-white font-bold">Send Money</span>:
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-black tracking-tight text-white">
                          {MOBILE_PAYMENT_NUMBERS[selectedMethod as keyof typeof MOBILE_PAYMENT_NUMBERS]}
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(MOBILE_PAYMENT_NUMBERS[selectedMethod as keyof typeof MOBILE_PAYMENT_NUMBERS])}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-surface-500 hover:text-white"
                          title="Copy number"
                        >
                          <CreditCard size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Your {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Number</label>
                      <input 
                        type="text" 
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Transaction ID</label>
                      <input 
                        type="text" 
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="TRX12345678"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white transition-all"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 pt-4 flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={prevStep}
                        className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 group flex items-center justify-center gap-3 bg-white text-black py-4 rounded-full font-bold hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck size={18} />
                            <span>Complete Transaction</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {paymentMethods.map(m => (
            <img key={m.id} src={m.logo} alt={m.name} className="h-6 object-contain" referrerPolicy="no-referrer" />
          ))}
        </div>
        <p className="text-surface-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          Securely Processed by OrbitX Payment Engine
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
