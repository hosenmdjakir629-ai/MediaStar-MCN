import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Shield, Smartphone, MapPin, AlertTriangle, Globe, DollarSign } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";
import { useRegion } from "../contexts/RegionContext";

export default function Settings({ userProfile, refreshProfile }: any) {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { region, setRegion, availableRegions } = useRegion();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleVerify = async (token: string) => {
    setIsVerifying(true);
    setStatus(null);
    try {
      await api.post('/auth/verify', { token });
      setStatus({ type: 'success', message: 'Email verified successfully!' });
      refreshProfile();
    } catch (error) {
      setStatus({ type: 'error', message: 'Invalid verification token.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setStatus(null);
    try {
      await api.post('/auth/resend-verification');
      setStatus({ type: 'success', message: 'Verification email resent!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to resend verification email.' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>
        
        {status && (
          <div className={`p-4 mb-4 rounded-lg ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
            {status.message}
          </div>
        )}

        <div className="space-y-6">
          {/* Email Verification Section */}
          {!userProfile?.emailVerified && (
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Verify your email</h3>
              <p className="text-sm text-yellow-800 mb-4">Please verify your email address to access all features.</p>
              <div className="flex gap-4">
                <button onClick={handleResend} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium" disabled={isResending}>
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </div>
          )}
          
          {/* ... existing settings sections ... */}

          {/* Login Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-500" /> Login Activity
            </h3>
            <div className="space-y-4">
              {loginActivity.map((activity, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{activity.device}</p>
                    <p className="text-xs text-slate-500">{activity.ip} • {activity.location}</p>
                  </div>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suspicious Activity */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> Suspicious Activity Detection
            </h3>
            <p className="text-sm text-amber-800">
              Our system is actively monitoring your account for unusual login attempts or security threats. 
              You will be notified immediately if anything suspicious is detected.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
