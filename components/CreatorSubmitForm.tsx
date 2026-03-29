import React, { useState, useRef } from 'react';
import { Send, CheckCircle, Upload, X, FileArchive } from 'lucide-react';
import { db, storage, handleFirestoreError, OperationType } from '../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';

const CreatorSubmitForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channel: '',
    subs: '',
    niche: 'Gaming',
    message: ''
  });
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.zip')) {
        setZipFile(file);
      } else {
        alert('Please upload a .zip file.');
        e.target.value = '';
      }
    }
  };

  const removeFile = () => {
    setZipFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      setFormStatus('idle');
      return;
    }

    setFormStatus('sending');
    try {
      let zipUrl = '';
      
      // 0. Upload ZIP file if exists
      if (zipFile) {
        console.log("Uploading ZIP file...");
        try {
          const storageRef = ref(storage, `applications/${Date.now()}_${zipFile.name}`);
          const snapshot = await uploadBytes(storageRef, zipFile);
          zipUrl = await getDownloadURL(snapshot.ref);
          console.log("ZIP file uploaded:", zipUrl);
        } catch (error) {
          console.error('Error uploading file:', error);
          // Continue without file if upload fails, or handle error
        }
      }

      const formattedMessage = `Creator Application
Name: ${formData.name}
Email: ${formData.email}
Channel Url: ${formData.channel}
Subscribers: ${formData.subs}
Niche: ${formData.niche}
Message: ${formData.message}`;

      // 1. Add to notifications for admin alert
      console.log("Adding to notifications...");
      try {
        await addDoc(collection(db, 'notifications'), {
          name: formData.name,
          email: formData.email,
          channel: formData.channel,
          subs: formData.subs,
          channelName: formData.channel,
          subscribers: parseInt(formData.subs) || 0,
          niche: formData.niche,
          message: formData.message,
          formattedMessage: formattedMessage,
          zipUrl: zipUrl,
          status: 'unread',
          timestamp: new Date().toISOString()
        });
        console.log("Added to notifications");
      } catch (error) {
        console.error("Error adding to notifications:", error);
        handleFirestoreError(error, OperationType.CREATE, 'notifications');
      }

      // 2. Add to creators collection with Pending status (PHP script logic)
      console.log("Adding to creators...");
      try {
        await addDoc(collection(db, 'creators'), {
          name: formData.name,
          email: formData.email,
          channel: formData.channel,
          subs: formData.subs,
          channelName: formData.channel,
          subscribers: parseInt(formData.subs) || 0,
          niche: formData.niche,
          message: formData.message,
          zipUrl: zipUrl,
          status: 'Pending',
          totalViews: 0,
          revenue: 0,
          trend: 'flat',
          avatarUrl: `https://i.pravatar.cc/150?u=${formData.email}`,
          isVerified: false,
          lastSynced: new Date().toISOString()
        });
        console.log("Added to creators");
      } catch (error) {
        console.error("Error adding to creators:", error);
        handleFirestoreError(error, OperationType.CREATE, 'creators');
      }

      // 3. Send Email via EmailJS
      console.log("Sending email...");
      try {
        await emailjs.send(
          "service_5x5e82j",
          "template_sdpbcga",
          {
            name: formData.name,
            email: formData.email,
            channel: formData.channel,
            subscribers: formData.subs,
            niche: formData.niche,
            message: formData.message
          },
          "623oC0hN3jCe4EkfW"
        );
        console.log("Email sent");
      } catch (error) {
        console.error('EmailJS Error:', error);
        // Optionally handle email failure (e.g. log it but don't fail the whole submission)
      }

      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        channel: '',
        subs: '',
        niche: 'Gaming',
        message: ''
      });
      setZipFile(null);
      setTimeout(() => setFormStatus('idle'), 3000);
      console.log("Form submission successful");
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
          <p className="text-surface-400 font-bold text-sm uppercase tracking-widest">Join the OrbitX MCN network today</p>
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
              { name: 'channel', placeholder: 'Channel Url', type: 'text', required: true },
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
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip"
                className="hidden"
                id="zip-upload"
              />
              <label
                htmlFor="zip-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${zipFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-orbit-500/50'}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {zipFile ? (
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <FileArchive size={32} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[200px]">{zipFile.name}</span>
                        <span className="text-xs opacity-60">{(zipFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-3 text-surface-400" />
                      <p className="mb-2 text-sm text-surface-400 font-bold">
                        <span className="text-orbit-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-surface-500">ZIP file only (max 10MB)</p>
                    </>
                  )}
                </div>
              </label>
              {zipFile && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Message" 
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
            className={`relative w-full py-6 rounded-3xl font-black text-white shadow-2xl transition-all flex items-center justify-center gap-3 overflow-hidden text-lg tracking-widest ${
              formStatus === 'success' 
                ? 'bg-emerald-500' 
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-orbit-600 hover:from-indigo-500 hover:via-purple-500 hover:to-orbit-500'
            }`}
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

