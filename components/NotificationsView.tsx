import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Mail, Trash2, CheckCircle, Clock, ExternalLink, FileArchive, User, ChevronRight, X, Search, Filter, MoreVertical, ShieldCheck, AlertCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../src/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Notification } from '../types';

const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { status: 'read' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await deleteDoc(doc(db, 'notifications', id));
        if (selectedNotification?.id === id) setSelectedNotification(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `notifications/${id}`);
      }
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || n.status === filter;
    const matchesSearch = n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.channelName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 orbit-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-orbit-500/20">
            <Bell className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white font-display tracking-tight">System Notifications</h2>
            <p className="text-surface-500 text-[10px] font-black uppercase tracking-widest mt-1">
              {unreadCount} Unread Applications & Alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-orbit-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-2xl text-white placeholder-surface-600 focus:outline-none focus:border-orbit-500/30 transition-all font-bold text-sm"
            />
          </div>
          
          <div className="flex bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-1">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === f ? 'bg-orbit-500 text-white shadow-lg shadow-orbit-500/20' : 'text-surface-500 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
        {/* List Section */}
        <div className="lg:col-span-5 xl:col-span-4 glass-card rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.01]">
            <h3 className="text-xs font-black text-surface-400 uppercase tracking-widest">Recent Activity</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
            {isLoading ? (
              <div className="p-10 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-orbit-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest">Syncing...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-12 h-12 bg-surface-900 rounded-2xl flex items-center justify-center mx-auto text-surface-600">
                  <Bell size={24} />
                </div>
                <p className="text-xs text-surface-500 font-bold">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setSelectedNotification(notification);
                    if (notification.status === 'unread') handleMarkAsRead(notification.id);
                  }}
                  className={`p-6 cursor-pointer transition-all relative group ${selectedNotification?.id === notification.id ? 'bg-orbit-500/5' : 'hover:bg-white/[0.02]'}`}
                >
                  {notification.status === 'unread' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orbit-500"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${notification.status === 'unread' ? 'bg-orbit-500/10 border-orbit-500/20 text-orbit-400' : 'bg-surface-900 border-white/5 text-surface-500'}`}>
                      <Mail size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-black truncate font-display tracking-tight ${notification.status === 'unread' ? 'text-white' : 'text-surface-400'}`}>
                          {notification.name}
                        </h4>
                        <span className="text-[9px] text-surface-600 font-mono whitespace-nowrap ml-2">
                          {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest truncate">
                        {notification.niche} • {notification.channelName || notification.channel}
                      </p>
                    </div>
                    
                    <ChevronRight size={16} className={`text-surface-700 group-hover:text-orbit-400 transition-all ${selectedNotification?.id === notification.id ? 'rotate-90 text-orbit-400' : ''}`} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Detail Section */}
        <div className="lg:col-span-7 xl:col-span-8 glass-card rounded-[2.5rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {selectedNotification ? (
              <motion.div
                key={selectedNotification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Detail Header */}
                <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-surface-900 rounded-2xl border border-white/10 flex items-center justify-center text-orbit-400 shadow-2xl">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white font-display tracking-tight">{selectedNotification.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-surface-500 font-black uppercase tracking-widest">{selectedNotification.email}</span>
                        <span className="w-1 h-1 bg-surface-700 rounded-full"></span>
                        <span className="text-[10px] text-orbit-400 font-black uppercase tracking-widest">{new Date(selectedNotification.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDelete(selectedNotification.id)}
                      className="p-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/20 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="p-4 bg-surface-900 hover:bg-surface-800 text-surface-400 rounded-2xl border border-white/5 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                  {/* Formatted Message Template */}
                  <section>
                    <h5 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-orbit-500/30"></span> Application Intelligence
                    </h5>
                    <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5 font-mono text-sm leading-relaxed text-surface-300 relative group">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ShieldCheck className="text-orbit-500" size={20} />
                      </div>
                      <pre className="whitespace-pre-wrap font-mono">
                        {selectedNotification.formattedMessage || `Creator Application\n\nName: ${selectedNotification.name}\nEmail: ${selectedNotification.email}\nChannel Url: ${selectedNotification.channel}\nSubscribers: ${selectedNotification.subs}\nNiche: ${selectedNotification.niche}\nMessage: ${selectedNotification.message}`}
                      </pre>
                    </div>
                  </section>

                  {/* Quick Actions / Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-surface-900/30 rounded-2xl border border-white/5">
                      <div className="text-[9px] text-surface-500 font-black uppercase tracking-widest mb-2">Channel</div>
                      <div className="text-white font-black text-sm truncate">{selectedNotification.channelName || 'N/A'}</div>
                      <a href={selectedNotification.channel} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orbit-400 text-[10px] font-black uppercase tracking-widest mt-3 hover:text-orbit-300 transition-colors">
                        <ExternalLink size={12} />
                        Visit Channel
                      </a>
                    </div>
                    
                    <div className="p-6 bg-surface-900/30 rounded-2xl border border-white/5">
                      <div className="text-[9px] text-surface-500 font-black uppercase tracking-widest mb-2">Subscribers</div>
                      <div className="text-white font-black text-sm">{selectedNotification.subs}</div>
                      <div className="flex items-center gap-2 text-surface-600 text-[10px] font-black uppercase tracking-widest mt-3">
                        <AlertCircle size={12} />
                        Self-Reported
                      </div>
                    </div>

                    <div className="p-6 bg-surface-900/30 rounded-2xl border border-white/5">
                      <div className="text-[9px] text-surface-500 font-black uppercase tracking-widest mb-2">Attachments</div>
                      {selectedNotification.zipUrl ? (
                        <>
                          <div className="text-emerald-400 font-black text-sm">ZIP Archive</div>
                          <a href={selectedNotification.zipUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orbit-400 text-[10px] font-black uppercase tracking-widest mt-3 hover:text-orbit-300 transition-colors">
                            <FileArchive size={12} />
                            Download ZIP
                          </a>
                        </>
                      ) : (
                        <div className="text-surface-600 font-black text-sm">No Attachments</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex justify-center">
                    <button className="px-10 py-5 orbit-gradient text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-orbit-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                      <CheckCircle size={18} />
                      Approve Application
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-surface-900/50 rounded-[2rem] flex items-center justify-center text-surface-700 border border-white/5">
                  <Mail size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white font-display tracking-tight">Select a Notification</h3>
                  <p className="text-surface-500 text-sm max-w-xs mx-auto mt-2">
                    Review incoming creator applications and system alerts from the list on the left.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
