import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'motion/react';

const CreatorSubmitForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    channel: '',
    subs: '',
    niche: 'Gaming',
    goal: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      // 1. Add to notifications for admin alert
      try {
        await addDoc(collection(db, 'notifications'), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          channel: formData.channel,
          subs: formData.subs,
          channelName: formData.channel,
          subscribers: parseInt(formData.subs) || 0,
          niche: formData.niche,
          goal: formData.goal,
          status: 'unread',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'notifications');
      }

      // 2. Add to creators collection with Pending status (PHP script logic)
      try {
        await addDoc(collection(db, 'creators'), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          channel: formData.channel,
          subs: formData.subs,
          channelName: formData.channel,
          subscribers: parseInt(formData.subs) || 0,
          niche: formData.niche,
          goal: formData.goal,
          status: 'Pending',
          totalViews: 0,
          revenue: 0,
          trend: 'flat',
          avatarUrl: `https://i.pravatar.cc/150?u=${formData.email}`,
          isVerified: false,
          lastSynced: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'creators');
      }

      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          channel: formData.channel,
          subscribers: formData.subs,
          niche: formData.niche,
          goal: formData.goal
        })
      });

      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        channel: '',
        subs: '',
        niche: 'Gaming',
        goal: ''
      });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setFormStatus('idle');
    }
  };

  return (
    <div className="glass-panel border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
      {/* Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orbit-500/10 blur-[100px] pointer-events-none group-hover:bg-orbit-500/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-white font-display tracking-tight mb-2">Creator Application</h2>
          <p className="text-surface-400 font-bold text-sm uppercase tracking-widest">Join the OrbitX network today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { name: 'name', placeholder: 'Full Name', type: 'text', required: true },
              { name: 'email', placeholder: 'Email Address', type: 'email', required: true },
              { name: 'phone', placeholder: 'WhatsApp Number', type: 'text', required: true },
              { name: 'channel', placeholder: 'Channel Link', type: 'text', required: true },
              { name: 'subs', placeholder: 'Subscribers', type: 'number' },
            ].map((field) => (
              <motion.div
                key={field.name}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="relative group/input"
              >
                <input 
                  name={field.name} 
                  type={field.type}
                  value={(formData as any)[field.name]} 
                  onChange={handleChange} 
                  placeholder={field.placeholder} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-surface-600 outline-none focus:border-orbit-500/50 focus:bg-white/10 transition-all font-bold tracking-tight" 
                  required={field.required} 
                />
                <div className="absolute inset-0 rounded-2xl border border-orbit-500/0 group-focus-within/input:border-orbit-500/20 pointer-events-none transition-all"></div>
              </motion.div>
            ))}
            
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <select 
                name="niche" 
                value={formData.niche} 
                onChange={handleChange} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-orbit-500/50 focus:bg-white/10 transition-all font-bold tracking-tight appearance-none cursor-pointer"
              >
                <option value="Gaming">Gaming</option>
                <option value="Vlog">Vlog</option>
                <option value="Islamic">Islamic</option>
                <option value="Tech">Tech</option>
              </select>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <textarea 
              name="goal" 
              value={formData.goal} 
              onChange={handleChange} 
              placeholder="Your Goal" 
              className="w-full h-40 bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white placeholder:text-surface-600 outline-none focus:border-orbit-500/50 focus:bg-white/10 transition-all font-bold tracking-tight resize-none" 
            />
          </motion.div>

          <motion.button 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={formStatus === 'sending' || formStatus === 'success'} 
            className={`relative w-full py-6 rounded-3xl font-black text-white shadow-2xl transition-all flex items-center justify-center gap-3 overflow-hidden text-lg tracking-widest ${formStatus === 'success' ? 'bg-emerald-500' : 'bg-orbit-600 hover:bg-orbit-500'}`}
          >
            {/* Shimmer Effect */}
            {formStatus === 'idle' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
              />
            )}

            <motion.div
              key={formStatus}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-10 flex items-center justify-center gap-3"
            >
              {formStatus === 'idle' && <><span>SUBMIT APPLICATION</span><Send size={20} /></>}
              {formStatus === 'sending' && <><span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span><span>PROCESSING...</span></>}
              {formStatus === 'success' && <><CheckCircle size={22} /><span>🎉 APPLICATION SUCCESSFUL!</span></>}
            </motion.div>
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default CreatorSubmitForm;
