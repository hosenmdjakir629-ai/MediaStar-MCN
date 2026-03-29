import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, PartyPopper, Sparkles, Rocket } from "lucide-react";
import { motion } from "motion/react";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-950 text-white flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orbit-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-lg relative z-10 text-center">
        <a
          href="/"
          className="flex items-center justify-center space-x-3 mb-12 hover:opacity-80 transition-opacity"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <div className="text-3xl font-black tracking-tighter text-white">OrbitX MCN</div>
        </a>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-surface-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/50"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orbit-500/10 rounded-full border border-orbit-500/20 mb-8 relative group">
            <CheckCircle2 className="text-orbit-400 group-hover:text-orbit-300 transition-colors" size={48} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 text-yellow-400"
            >
              <Sparkles size={24} />
            </motion.div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-display">
            Payment <span className="text-orbit-400">Successful</span>
          </h1>
          <p className="text-surface-400 text-lg font-medium mb-10">
            Welcome to OrbitX MCN! Your premium subscription has been activated.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 px-6 bg-orbit-500 hover:bg-orbit-600 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-orbit-500/20 hover:shadow-orbit-500/40 active:scale-[0.98]"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={20} />
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-surface-500 pt-4">
              <PartyPopper size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Join our Discord Community</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
