import React, { useState } from 'react';
import { Rocket, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, ChevronLeft } from 'lucide-react';

interface LoginViewProps {
  onLogin: (status: boolean) => void;
  onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token if needed
        localStorage.setItem('orbitx_token', data.token);
        onLogin(true);
      } else {
        setError(data.message || 'Invalid credentials. Please contact the network director.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orbit-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orbit-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-orbit-accent/10 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 right-4 sm:top-8 sm:left-8 z-20 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors bg-orbit-800/50 hover:bg-orbit-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border border-white/5"
      >
        <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="text-xs sm:text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up mt-12 sm:mt-0">
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orbit-500 to-orbit-accent shadow-lg shadow-orbit-500/30 mb-4">
            <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            <span className="font-bold">OrbitX MCN</span>
            <span className="text-sm font-medium block text-gray-400 mt-1">- Powered by MediaStar</span>
          </h1>
          <p className="text-sm text-gray-400 px-4">Enter your credentials to access the admin portal.</p>
        </div>

        {/* Login Card */}
        <div className="bg-orbit-800 border border-orbit-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl bg-opacity-95 mx-2 sm:mx-0">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-orbit-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-orbit-900/50 border border-orbit-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orbit-500 focus:ring-1 focus:ring-orbit-500 transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-orbit-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-orbit-900/50 border border-orbit-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orbit-500 focus:ring-1 focus:ring-orbit-500 transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-orbit-500 hover:bg-orbit-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orbit-500 shadow-lg shadow-orbit-500/25 transition-all transform active:scale-[0.98] ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by OrbitX MCN Secure Guard. <br/>
              Authorized access only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;