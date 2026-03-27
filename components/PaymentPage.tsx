import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PAYMENT_AMOUNT, MOBILE_PAYMENT_NUMBERS } from '../src/constants';
import { db } from '../src/firebase';
import { collection, addDoc } from 'firebase/firestore';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentData {
  name: string;
  email: string;
  channelLink: string;
  mobileNumber: string;
  trxId: string;
}

const CheckoutForm: React.FC<{ selectedMethod: string, paymentData: PaymentData }> = ({ selectedMethod, paymentData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!paymentData.name || !paymentData.email) {
      setError("Please fill in your Full Name and Email Address.");
      return;
    }

    if (['bkash', 'rocket'].includes(selectedMethod)) {
      if (!paymentData.mobileNumber || !paymentData.trxId) {
        setError(`Please provide your ${selectedMethod} number and Transaction ID.`);
        return;
      }
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Save payment data to Firestore
      await addDoc(collection(db, "payments"), {
        name: paymentData.name,
        email: paymentData.email,
        channelLink: paymentData.channelLink,
        method: selectedMethod,
        mobileNumber: paymentData.mobileNumber,
        trxid: paymentData.trxId,
        time: new Date().toISOString(),
        status: 'pending',
        amount: 20
      });

      setTimeout(() => {
        window.location.href = "/success.html";
      }, 2000);
    } catch (err) {
      console.error("Error saving payment data:", err);
      setError("Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedMethod === 'card' && (
        <div className="p-4 border border-slate-200 rounded-xl bg-white">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      )}
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
      
      {isProcessing ? (
        <div id="loader">
          <div className="spinner"></div>
          <p className="text-slate-600 font-medium mt-2">Processing Payment...</p>
        </div>
      ) : (
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isProcessing}
          className="w-full p-5 bg-green-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Lock size={20} /> Pay Now - $20
        </motion.button>
      )}
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [channelLink, setChannelLink] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  const paymentData = { name, email, channelLink, mobileNumber, trxId };

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-[#f5f7fa] flex justify-center p-4 md:p-10">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold text-slate-900">OrbitX MCN</div>
            <div className="flex items-center gap-2 text-black font-medium text-sm">
              <Lock size={16} /> Secure Payment
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Plan & Info */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-4">Subscription</h3>
                <div className="text-slate-600">One-Time Payment</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">$20 USD</div>
                <ul className="mt-6 space-y-3 text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500" /> Lifetime Access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500" /> Channel Support</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500" /> Monetization Help</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-6 text-black">Customer Info</h3>
                <div className="space-y-4">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-4 border border-slate-200 rounded-xl text-black" required />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full p-4 border border-slate-200 rounded-xl text-black" required />
                  <input type="text" value={channelLink} onChange={(e) => setChannelLink(e.target.value)} placeholder="YouTube Channel Link (Optional)" className="w-full p-4 border border-slate-200 rounded-xl text-black" />
                </div>
              </div>
            </div>

            {/* Right Column: Payment & Summary */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-6 text-black">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer text-black ${selectedMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                    <input type="radio" name="pay" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} /> Credit / Debit Card
                  </label>
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer text-black ${selectedMethod === 'bkash' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                    <input type="radio" name="pay" value="bkash" checked={selectedMethod === 'bkash'} onChange={() => setSelectedMethod('bkash')} /> bKash
                  </label>
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer text-black ${selectedMethod === 'rocket' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                    <input type="radio" name="pay" value="rocket" checked={selectedMethod === 'rocket'} onChange={() => setSelectedMethod('rocket')} /> Rocket
                  </label>
                </div>
              </div>

              {['bkash', 'rocket'].includes(selectedMethod) && (
                <div id="mobilePaymentBox" className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                  <div className="text-sm text-slate-600 font-medium">Send ৳{PAYMENT_AMOUNT} to {MOBILE_PAYMENT_NUMBERS[selectedMethod as keyof typeof MOBILE_PAYMENT_NUMBERS]} ({selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)})</div>
                  
                  {selectedMethod === 'bkash' && (
                    <div className="mb-4 p-4 bg-pink-50 border border-pink-200 rounded-xl">
                      <p className="text-sm text-pink-800 mb-2 font-medium">✨ New: bKash Auto Verify (Advanced)</p>
                      <button 
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/bkash/create-payment', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ amount: "20.00", reference: "orbitx" })
                            });
                            const data = await res.json();
                            if (data.bkashURL) {
                              window.location.href = data.bkashURL;
                            } else {
                              alert("bKash API response: " + JSON.stringify(data));
                            }
                          } catch (e) {
                            alert("Failed to connect to bKash API");
                          }
                        }}
                        className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors"
                      >
                        Pay with bKash Gateway
                      </button>
                      <div className="text-center text-xs text-pink-600 mt-2">or use manual verification below</div>
                    </div>
                  )}

                  <input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder={`${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Number`} className="w-full p-4 border border-slate-200 rounded-xl text-black" required />
                  <input value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="Transaction ID" className="w-full p-4 border border-slate-200 rounded-xl text-black" required />
                </div>
              )}

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-6 text-black">Secure Payment</h3>
                <p className="text-black mb-6">
                  Select your preferred payment method and click the button below to proceed.
                </p>
                <CheckoutForm selectedMethod={selectedMethod} paymentData={paymentData} />
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between mb-2 text-slate-600"><span>Subtotal</span><span>$20</span></div>
                <div className="flex justify-between mb-4 text-slate-600"><span>Service Fee</span><span>$0</span></div>
                <hr className="mb-4" />
                <div className="flex justify-between font-bold text-lg text-black"><span>Total</span><span>$20 USD</span></div>
              </div>

              <div className="text-center text-sm text-slate-500">
                By completing this purchase, you agree to our Terms & Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;
