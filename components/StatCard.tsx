import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, color }) => {
  const getColorClass = (c: string) => {
      switch(c) {
          case 'indigo': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
          case 'cyan': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
          case 'green': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          case 'purple': return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20';
          default: return 'text-orbit-400 bg-orbit-500/10 border-orbit-500/20';
      }
  };
  
  const colorClass = getColorClass(color);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass-card rounded-3xl p-6 relative overflow-hidden group"
    >
      {/* Subtle Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.02] pointer-events-none`}></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <motion.div 
          whileHover={{ rotate: 8, scale: 1.1 }}
          className={`p-3 rounded-2xl ${colorClass.split(' ').slice(0, 2).join(' ')} border ${colorClass.split(' ').pop()}`}
        >
          <Icon size={22} />
        </motion.div>
        <div className={`flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
          <span>{change}</span>
        </div>
      </div>
      
      <div className="relative z-10">
          <h3 className="text-surface-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-black text-white font-display tracking-tight">{value}</p>
          </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </motion.div>
  );
};

export default StatCard;