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
      if (error.name === 'AbortError' || error.message?.toLowerCase().includes('aborted')) {
        console.warn('Application submission aborted');
      } else {
        console.error('Error submitting application:', error);
      }
      setFormStatus('idle');
    }
  };

  return (
    <div className="bg-orbit-800 border border-orbit-700 rounded-3xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-white">Creator Application Form</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
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
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {[
            { name: 'full_name', placeholder: 'Full Name', type: 'text', required: true },
            { name: 'email', placeholder: 'Email', type: 'email', required: true },
            { name: 'phone', placeholder: 'Phone', type: 'text', required: true },
            { name: 'country', placeholder: 'Country', type: 'text', required: true },
            { name: 'whatsapp', placeholder: 'WhatsApp', type: 'text' },
            { name: 'youtube_channel_name', placeholder: 'YouTube Channel Name', type: 'text', required: true },
            { name: 'youtube_channel_url', placeholder: 'YouTube Channel URL', type: 'text', required: true },
            { name: 'channel_category', placeholder: 'Channel Category', type: 'text' },
            { name: 'total_subscribers', placeholder: 'Total Subscribers', type: 'number' },
            { name: 'total_views', placeholder: 'Total Views', type: 'number' },
            { name: 'monthly_views', placeholder: 'Monthly Views', type: 'number' },
            { name: 'total_videos', placeholder: 'Total Videos', type: 'number' },
          ].map((field) => (
            <motion.div
              key={field.name}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <input 
                name={field.name} 
                type={field.type}
                value={(formData as any)[field.name]} 
                onChange={handleChange} 
                placeholder={field.placeholder} 
                className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" 
                required={field.required} 
              />
            </motion.div>
          ))}
          
          <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
            <select name="monetized" value={formData.monetized} onChange={handleChange} className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
              <option value="Yes">Monetized: Yes</option>
              <option value="No">Monetized: No</option>
            </select>
          </motion.div>
          
          <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
            <select name="current_mcn" value={formData.current_mcn} onChange={handleChange} className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
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
          <textarea name="additional_info" value={formData.additional_info} onChange={handleChange} placeholder="Additional Info" className="w-full h-32 bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors resize-none" />
        </motion.div>
        <motion.button 
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: formStatus === 'idle' ? [1, 1.01, 1] : 1
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ 
            scale: 1.03, 
            boxShadow: "0 0 25px rgba(79, 70, 229, 0.5)",
            backgroundColor: formStatus === 'success' ? "#22c55e" : "#6366f1"
          }}
          whileTap={{ scale: 0.97 }}
          type="submit" 
          disabled={formStatus === 'sending' || formStatus === 'success'} 
          className={`relative w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden ${formStatus === 'success' ? 'bg-green-500' : 'bg-indigo-600'}`}
        >
          {/* Shimmer Effect */}
          {formStatus === 'idle' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "linear",
                repeatDelay: 0.5
              }}
            />
          )}

          <motion.div
            key={formStatus}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="relative z-10 flex items-center justify-center gap-2"
          >
            {formStatus === 'idle' && <><span>Submit Application</span><Send size={18} /></>}
            {formStatus === 'sending' && <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>Submitting...</span></>}
            {formStatus === 'success' && <><CheckCircle size={18} /><span>Application Submitted!</span></>}
          </motion.div>
        </motion.button>
      </form>
    </div>
  );
};

export default CreatorSubmitForm;
