import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Shield, Smartphone, MapPin, AlertTriangle, Globe, DollarSign } from "lucide-react";
import { useCurrency } from "../contexts/CurrencyContext";
import { useRegion } from "../contexts/RegionContext";
import api from "../lib/api";

export default function Settings({ userProfile, refreshProfile }: any) {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { region, setRegion, availableRegions } = useRegion();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const loginActivity = [
    { device: "Chrome / Windows", ip: "192.168.1.1", location: "Dhaka, BD", time: "2m ago" },
    { device: "Safari / iPhone", ip: "10.0.0.5", location: "Chittagong, BD", time: "1d ago" },
  ];

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
          
          {/* Regional Preferences */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" /> Regional Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Region</label>
                <select 
                  value={region.code} 
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {availableRegions.map((r: any) => (
                    <option key={r.code} value={r.code}>{r.flag} {r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Currency</label>
                <select 
                  value={currency.code} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {availableCurrencies.map((c: any) => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Security</h2>
          {/* 2FA Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <button 
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-4 py-2 rounded-lg font-medium ${twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                {twoFactorEnabled ? "Enabled" : "Enable"}
              </button>
            </div>
          </div>

          {/* Login Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-500" /> Login Activity
            </h3>
            <div className="space-y-4">
              {loginActivity.map((activity: any, i: number) => (
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
