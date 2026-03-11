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
          case 'indigo': return 'text-indigo-400 bg-indigo-500/10 group-hover:border-indigo-500/30';
          case 'cyan': return 'text-cyan-400 bg-cyan-500/10 group-hover:border-cyan-500/30';
          case 'green': return 'text-green-400 bg-green-500/10 group-hover:border-green-500/30';
          case 'purple': return 'text-purple-400 bg-purple-500/10 group-hover:border-purple-500/30';
          default: return 'text-blue-400 bg-blue-500/10 group-hover:border-blue-500/30';
      }
  };
  
  const colorClass = getColorClass(color);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-orbit-800/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:bg-orbit-800/60 transition-all duration-300 relative overflow-hidden group shadow-xl ${colorClass.split(' ').pop()}`}
    >
      {/* Ambient Glow */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 bg-${color}-500`}></div>
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className={`p-2.5 rounded-xl ${colorClass.split(' ').slice(0, 2).join(' ')}`}
        >
          <Icon size={20} />
        </motion.div>
        <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-lg ${trend === 'up' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{change}</span>
        </div>
      </div>
      
      <div className="relative z-10">
          <h3 className="text-gray-400 text-xs font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;