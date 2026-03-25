import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { db } from '../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'motion/react';

const CreatorSubmitForm: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    whatsapp: '',
    youtube_channel_name: '',
    youtube_channel_url: '',
    channel_category: '',
    total_subscribers: '',
    total_views: '',
    monthly_views: '',
    total_videos: '',
    monetized: 'Yes',
    current_mcn: 'No',
    additional_info: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      await addDoc(collection(db, 'notifications'), {
        name: formData.full_name,
        channelName: formData.youtube_channel_name,
        subscribers: parseInt(formData.total_subscribers) || 0,
        status: 'unread',
        timestamp: new Date().toISOString()
      });

      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.full_name,
          email: formData.email,
          channelName: formData.youtube_channel_name,
          subscribers: formData.total_subscribers
        })
      });

      setFormStatus('success');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        country: '',
        whatsapp: '',
        youtube_channel_name: '',
        youtube_channel_url: '',
        channel_category: '',
        total_subscribers: '',
        total_views: '',
        monthly_views: '',
        total_videos: '',
        monetized: 'Yes',
        current_mcn: 'No',
        additional_info: ''
      });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error: any) {
      if (error && (error.name === 'AbortError' || error.message?.toLowerCase().includes('aborted') || error.message?.includes('The user aborted a request'))) {
        console.debug('Application submission aborted');
      } else {
        console.error('Error submitting application:', error);
      }
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
              { name: 'full_name', placeholder: 'Full Name', type: 'text', required: true },
              { name: 'email', placeholder: 'Email Address', type: 'email', required: true },
              { name: 'phone', placeholder: 'Phone Number', type: 'text', required: true },
              { name: 'country', placeholder: 'Country', type: 'text', required: true },
              { name: 'whatsapp', placeholder: 'WhatsApp Number', type: 'text' },
              { name: 'youtube_channel_name', placeholder: 'Channel Name', type: 'text', required: true },
              { name: 'youtube_channel_url', placeholder: 'Channel URL', type: 'text', required: true },
              { name: 'channel_category', placeholder: 'Category', type: 'text' },
              { name: 'total_subscribers', placeholder: 'Subscribers', type: 'number' },
              { name: 'total_views', placeholder: 'Total Views', type: 'number' },
              { name: 'monthly_views', placeholder: 'Monthly Views', type: 'number' },
              { name: 'total_videos', placeholder: 'Total Videos', type: 'number' },
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
                name="monetized" 
                value={formData.monetized} 
                onChange={handleChange} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-orbit-500/50 focus:bg-white/10 transition-all font-bold tracking-tight appearance-none cursor-pointer"
              >
                <option value="Yes">Monetized: Yes</option>
                <option value="No">Monetized: No</option>
              </select>
            </motion.div>
            
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <select 
                name="current_mcn" 
                value={formData.current_mcn} 
                onChange={handleChange} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-orbit-500/50 focus:bg-white/10 transition-all font-bold tracking-tight appearance-none cursor-pointer"
              >
                <option value="Yes">Current MCN: Yes</option>
                <option value="No">Current MCN: No</option>
              </select>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <textarea 
              name="additional_info" 
              value={formData.additional_info} 
              onChange={handleChange} 
              placeholder="Tell us more about your channel goals..." 
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
              {formStatus === 'success' && <><CheckCircle size={22} /><span>APPLICATION SENT!</span></>}
            </motion.div>
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default CreatorSubmitForm;
