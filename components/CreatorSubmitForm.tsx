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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
          <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
          <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
          <input name="youtube_channel_name" value={formData.youtube_channel_name} onChange={handleChange} placeholder="YouTube Channel Name" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
          <input name="youtube_channel_url" value={formData.youtube_channel_url} onChange={handleChange} placeholder="YouTube Channel URL" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" required />
          <input name="channel_category" value={formData.channel_category} onChange={handleChange} placeholder="Channel Category" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
          <input name="total_subscribers" type="number" value={formData.total_subscribers} onChange={handleChange} placeholder="Total Subscribers" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
          <input name="total_views" type="number" value={formData.total_views} onChange={handleChange} placeholder="Total Views" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
          <input name="monthly_views" type="number" value={formData.monthly_views} onChange={handleChange} placeholder="Monthly Views" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
          <input name="total_videos" type="number" value={formData.total_videos} onChange={handleChange} placeholder="Total Videos" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
          <select name="monetized" value={formData.monetized} onChange={handleChange} className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
            <option value="Yes">Monetized: Yes</option>
            <option value="No">Monetized: No</option>
          </select>
          <select name="current_mcn" value={formData.current_mcn} onChange={handleChange} className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors">
            <option value="Yes">Current MCN: Yes</option>
            <option value="No">Current MCN: No</option>
          </select>
        </div>
        <textarea name="additional_info" value={formData.additional_info} onChange={handleChange} placeholder="Additional Info" className="w-full h-32 bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors resize-none" />
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={formStatus === 'sending' || formStatus === 'success'} 
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${formStatus === 'success' ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        >
          {formStatus === 'idle' && <><span>Submit Application</span><Send size={18} /></>}
          {formStatus === 'sending' && <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span><span>Submitting...</span></>}
          {formStatus === 'success' && <><CheckCircle size={18} /><span>Application Submitted!</span></>}
        </motion.button>
      </form>
    </div>
  );
};

export default CreatorSubmitForm;
