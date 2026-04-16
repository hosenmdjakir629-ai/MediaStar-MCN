import React, { useState, useEffect } from 'react';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function CreatorApplication({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    channelName: '',
    channelUrl: '',
    subscribers: '',
    niche: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [verificationStatus, setVerificationStatus] = useState<'Not Connected' | 'Connecting...' | 'Connected'>('Not Connected');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setVerificationStatus('Connected');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectYouTube = async () => {
    setVerificationStatus('Connecting...');
    try {
      const response = await fetch('/api/youtube/auth/url');
      const data = await response.json();
      
      if (data.url) {
        const authWindow = window.open(
          data.url,
          'oauth_popup',
          'width=600,height=700'
        );

        if (!authWindow) {
          alert('Please allow popups for this site to connect your account.');
          setVerificationStatus('Not Connected');
        }
      } else {
        console.error("Failed to get auth URL");
        setVerificationStatus('Not Connected');
      }
    } catch (error) {
      console.error("Error connecting YouTube:", error);
      setVerificationStatus('Not Connected');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setStatus('submitting');

    try {
      let documentUrl = '';
      if (file) {
        const storageRef = ref(storage, `applications/${user.uid}/${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        documentUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, 'applications'), {
        ...formData,
        subscribers: Number(formData.subscribers),
        documentUrl,
        status: 'Pending',
        uid: user.uid,
        createdAt: serverTimestamp()
      });

      setStatus('success');
    } catch (error) {
      console.error("Error submitting application:", error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
        <p className="text-slate-600">We have received your application and will review it shortly.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Creator Application</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="text" placeholder="Channel Name" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.channelName} onChange={e => setFormData({...formData, channelName: e.target.value})} />
          <input type="url" placeholder="Channel URL" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.channelUrl} onChange={e => setFormData({...formData, channelUrl: e.target.value})} />
          <input type="number" placeholder="Subscribers" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.subscribers} onChange={e => setFormData({...formData, subscribers: e.target.value})} />
          <input type="text" placeholder="Niche" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} />
        </div>
        <textarea placeholder="Message" className="w-full px-4 py-3 rounded-xl border border-slate-200" rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Upload Documents (ID, Contract, etc.)</label>
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          Submit Application
        </button>
      </form>

      <div className="mt-10 pt-10 border-t border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-indigo-600" />
          Channel Verification
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          To verify your channel ownership and access advanced analytics, please connect your YouTube channel via OAuth.
        </p>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${verificationStatus === 'Connected' ? 'bg-emerald-500' : verificationStatus === 'Connecting...' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-sm font-medium text-slate-700">Status: {verificationStatus}</span>
          </div>
          
          <button 
            onClick={handleConnectYouTube}
            disabled={verificationStatus === 'Connecting...' || verificationStatus === 'Connected'}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              verificationStatus === 'Connected' 
                ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {verificationStatus === 'Connected' ? 'Channel Verified' : 'Connect YouTube'}
          </button>
        </div>
      </div>
    </div>
  );
}
