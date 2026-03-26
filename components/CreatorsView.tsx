import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MoreHorizontal, CheckCircle, AlertCircle, Trash2, X, Edit2, Save, XCircle, Camera, Youtube, TrendingUp, DollarSign, Users, Link as LinkIcon, Unlink, RefreshCw, ExternalLink, Check, ShieldCheck, Upload, Mail, UserPlus, Info, HelpCircle, Plus, Briefcase, Zap, Lock, Shield, Globe, Video, Clock, ImageUp, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { Creator } from '../types';
import { fetchChannelDataByHandle } from '../services/youtubeService';

interface CreatorsViewProps {
  creators: Creator[];
  onAddCreator: (creator?: Partial<Creator>) => void;
  onDeleteCreator: (id: string) => void;
  onUpdateCreator: (creator: Creator) => void;
  isAdmin?: boolean;
}

const Sparkline = ({ data, trend }: { data: number[], trend: string }) => {
  const chartData = useMemo(() => data.map((val, i) => ({ value: val })), [data]);
  const color = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#6366f1';
  
  return (
    <div className="w-20 h-8 sm:w-24 sm:h-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const NICHES = [
  'Gaming',
  'Tech',
  'Lifestyle',
  'Education',
  'Entertainment',
  'Music',
  'Vlogging',
  'Finance',
];

const CreatorsView: React.FC<CreatorsViewProps> = ({ creators, onAddCreator, onDeleteCreator, onUpdateCreator, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Creator | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  
  // Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteChannelUrl, setInviteChannelUrl] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<Creator['status']>('Pending');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createChannelName, setCreateChannelName] = useState('');
  const [createOwnerName, setCreateOwnerName] = useState('');
  const [createNiche, setCreateNiche] = useState('General');
  const [createStatus, setCreateStatus] = useState<Creator['status']>('Pending');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [creatorToDelete, setCreatorToDelete] = useState<Creator | null>(null);
  
  // YouTube Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [channelHandleInput, setChannelHandleInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSyncCreator = async (e: React.MouseEvent, creator: Creator) => {
    e.stopPropagation();
    if (!creator.linkedChannelHandle) return;
    
    setSyncingId(creator.id);
    try {
      const data = await fetchChannelDataByHandle(creator.linkedChannelHandle);
      if (data) {
        onUpdateCreator({
          ...creator,
          channelName: data.title,
          name: data.title,
          subscribers: parseInt(data.statistics.subscriberCount),
          totalViews: parseInt(data.statistics.viewCount),
          videoCount: parseInt(data.statistics.videoCount),
          avatarUrl: data.thumbnails.medium.url,
          youtubeChannelId: data.id,
          lastSynced: new Date().toISOString()
        });
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('operationType')) throw err;
      if (err instanceof Error && (err.name === 'AbortError' || err.message?.toLowerCase().includes('aborted') || err.message?.includes('The user aborted a request'))) {
          console.debug("YouTube sync aborted.");
      } else {
          console.error("Sync error:", err);
      }
    } finally {
      setSyncingId(null);
    }
  };

  const handleCreateCreator = () => {
    if (!createChannelName || !createOwnerName) return;
    onAddCreator({
      channelName: createChannelName,
      name: createOwnerName,
      status: createStatus,
      niche: createNiche,
      revenue: 0,
      subscribers: 0,
      totalViews: 0,
      videoCount: 0,
      avatarUrl: 'https://i.pravatar.cc/150',
    });
    setShowCreateModal(false);
    setCreateChannelName('');
    setCreateOwnerName('');
  };

  const handleToggleVerify = (e: React.MouseEvent, creator: Creator) => {
    e.stopPropagation();
    onUpdateCreator({
      ...creator,
      isVerified: !creator.isVerified
    });
  };

  const itemsPerPage = 8;
  const filteredCreators = creators.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.channelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  const paginatedCreators = filteredCreators.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRowClick = (creator: Creator) => {
    setSelectedCreator(creator);
    setEditForm({ ...creator });
    setIsEditing(false);
  };

  const handleEditClick = (creator: Creator) => {
    setSelectedCreator(creator);
    setEditForm({ ...creator });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editForm) {
      setIsSavingLocal(true);
      // Simulate database write delay
      await new Promise(resolve => setTimeout(resolve, 600));
      onUpdateCreator(editForm);
      setSelectedCreator(editForm);
      setIsEditing(false);
      setIsSavingLocal(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCreator(null);
    setEditForm(null);
    setIsEditing(false);
    setChannelHandleInput('');
    setSyncSuccess(false);
  };

  const processAvatarFile = (file: File) => {
    if (file && editForm) {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => prev ? ({ ...prev, avatarUrl: reader.result as string }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processAvatarFile(e.target.files[0]);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processAvatarFile(e.dataTransfer.files[0]);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Suspended': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleConnectChannel = async () => {
    if (!channelHandleInput || !editForm) return;
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      const data = await fetchChannelDataByHandle(channelHandleInput);
      if (data) {
        setEditForm({
          ...editForm,
          linkedChannelHandle: channelHandleInput,
          youtubeChannelId: data.id,
          channelName: data.title,
          subscribers: parseInt(data.statistics.subscriberCount),
          totalViews: parseInt(data.statistics.viewCount),
          videoCount: parseInt(data.statistics.videoCount),
          lastSynced: new Date().toLocaleString()
        });
        setSyncSuccess(true);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('operationType')) throw err;
      if (err instanceof Error && (err.name === 'AbortError' || err.message?.toLowerCase().includes('aborted') || err.message?.includes('The user aborted a request'))) {
        console.debug("YouTube fetch aborted in CreatorsView.");
      } else {
        console.error("YouTube fetch error:", err);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendInvite = () => {
    if (!inviteChannelUrl) return;
    onAddCreator({
      channelName: inviteChannelUrl,
      name: inviteEmail.split('@')[0] || 'Pending Creator',
      status: inviteStatus
    });
    setShowInviteModal(false);
    setInviteChannelUrl('');
    setInviteEmail('');
  };

  const handleDeleteClick = (e: React.MouseEvent, creator: Creator) => {
    e.stopPropagation();
    setCreatorToDelete(creator);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (creatorToDelete) {
      onDeleteCreator(creatorToDelete.id);
      setShowDeleteModal(false);
      setCreatorToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-surface-500 group-focus-within:text-orbit-400 transition-all duration-500" size={20} />
          <input 
            type="text" 
            placeholder="Search creators, niches, or channels..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-14 pr-6 py-4 bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] text-white placeholder-surface-500 focus:outline-none focus:ring-4 focus:ring-orbit-500/10 focus:border-orbit-500/30 transition-all shadow-2xl"
          />
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button 
            onClick={() => setShowInviteModal(true)} 
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 px-8 py-4 bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] text-surface-400 hover:text-white hover:bg-white/5 transition-all shadow-2xl group"
          >
            <Mail size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Invite</span>
          </button>
          <button 
            onClick={() => { 
              setCreateChannelName(''); 
              setCreateOwnerName('');
              setCreateNiche('General');
              setCreateStatus('Pending');
              setShowCreateModal(true); 
            }} 
            className="flex-1 md:flex-none flex items-center justify-center space-x-3 px-10 py-4 orbit-gradient text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-orbit-500/20 transition-all active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            <span>Add Creator</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-white/[0.01] text-surface-500 text-[10px] uppercase tracking-[0.3em] font-black">
                <th className="p-8 border-b border-white/5">Creator Intelligence</th>
                <th className="p-8 border-b border-white/5 text-center">Lifecycle</th>
                <th className="p-8 border-b border-white/5 text-center">Growth</th>
                <th className="p-8 border-b border-white/5 text-right">Subscribers</th>
                <th className="p-8 border-b border-white/5 text-right">Revenue</th>
                <th className="p-8 border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedCreators.map((creator) => (
                <tr 
                  key={creator.id} 
                  onClick={() => handleRowClick(creator)} 
                  className="hover:bg-white/[0.02] transition-all cursor-pointer group"
                >
                  <td className="p-8">
                    <div className="flex items-center space-x-5">
                      <div className="relative">
                        <img 
                          src={creator.avatarUrl} 
                          alt={creator.name} 
                          className="w-14 h-14 rounded-2xl border border-white/10 object-cover shadow-2xl group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                        />
                        {creator.isVerified && (
                          <div className="absolute -top-1.5 -right-1.5 bg-orbit-500 rounded-full p-1 border-2 border-surface-950 shadow-2xl">
                            <Check size={10} strokeWidth={4} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-black text-white text-base group-hover:text-orbit-400 transition-colors font-display tracking-tight">{creator.channelName}</div>
                          {creator.isVerified && <CheckCircle size={14} className="text-orbit-400" />}
                          {isAdmin && (
                            <button 
                              onClick={(e) => handleToggleVerify(e, creator)}
                              className={`ml-1 p-1 rounded-lg transition-all ${creator.isVerified ? 'text-orbit-400 hover:text-orbit-300' : 'text-surface-600 hover:text-surface-400'}`}
                              title={creator.isVerified ? "Unverify Channel" : "Verify Channel"}
                            >
                              <ShieldCheck size={14} />
                            </button>
                          )}
                        </div>
                        <div className="text-[10px] text-surface-500 flex items-center gap-3 mt-1 font-black uppercase tracking-widest">
                          <span>{creator.name}</span>
                          <span className="w-1 h-1 bg-surface-700 rounded-full"></span>
                          <span className="text-orbit-400">{creator.niche}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(creator.status)}`}>
                      {creator.status}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <Sparkline 
                        data={creator.subscriberHistory || [10, 25, 15, 35, 20, 45, 30]} 
                        trend={creator.trend} 
                      />
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="text-sm font-black text-white font-mono tracking-tighter">{formatNumber(creator.subscribers)}</div>
                    <p className="text-[9px] text-surface-600 font-bold uppercase">Total Subs</p>
                  </td>
                  <td className="p-8 text-right">
                    <div className="text-sm font-black text-emerald-400 font-mono tracking-tighter">৳{creator.revenue.toLocaleString()}</div>
                    <p className="text-[9px] text-surface-600 font-bold uppercase">Earnings</p>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end space-x-3">
                       {isAdmin && (
                         <>
                           <button 
                             onClick={(e) => handleSyncCreator(e, creator)} 
                             disabled={syncingId === creator.id}
                             className={`p-3 text-surface-500 hover:text-white bg-surface-900 border border-white/5 rounded-2xl disabled:opacity-50 transition-all duration-500 hover:border-white/10`}
                             title="Sync Data"
                           >
                              <RefreshCw size={18} className={`${syncingId === creator.id ? 'animate-spin' : ''}`} />
                           </button>
                         </>
                       )}
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleEditClick(creator); }} 
                        className="p-3 text-surface-500 hover:text-white bg-surface-900 border border-white/5 rounded-2xl transition-all duration-500 hover:border-white/10"
                       >
                          <Edit2 size={18} />
                       </button>
                       <button 
                        onClick={(e) => handleDeleteClick(e, creator)} 
                        className="p-3 text-surface-500 hover:text-rose-400 bg-surface-900 border border-white/5 rounded-2xl transition-all duration-500 hover:border-rose-500/30 hover:bg-rose-500/5"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Edit Modal */}
      <AnimatePresence>
        {selectedCreator && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-surface-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl glass-card rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 orbit-gradient"></div>
              
              {/* Left Side: Profile Info */}
              <div className="w-full md:w-1/3 bg-white/[0.02] p-10 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto custom-scrollbar">
                <div className="relative mb-8 group">
                  <div 
                    className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-surface-900 border-2 ${isEditing ? 'border-dashed border-orbit-500/50 cursor-pointer hover:border-orbit-500' : 'border-white/10'} overflow-hidden transition-all shadow-2xl shadow-orbit-500/10`}
                    onClick={() => isEditing && fileInputRef.current?.click()}
                  >
                    <img src={editForm.avatarUrl} alt={editForm.name} className="w-full h-full object-cover" />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Camera size={24} />
                        <span className="text-[10px] mt-2 font-black tracking-widest">UPLOAD</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  {editForm.isVerified && (
                    <div className="absolute -top-2 -right-2 bg-orbit-500 rounded-full p-2 border-4 border-surface-950 shadow-2xl">
                      <Check size={14} strokeWidth={4} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="w-full space-y-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editForm.channelName} 
                      onChange={(e) => setEditForm({...editForm, channelName: e.target.value})} 
                      className="w-full bg-surface-900/50 border border-white/10 rounded-2xl px-4 py-3 text-xl font-black text-white text-center focus:border-orbit-500 outline-none font-display tracking-tight"
                      placeholder="Channel Name"
                    />
                  ) : (
                    <h3 className="text-2xl font-black text-white font-display tracking-tight">{editForm.channelName}</h3>
                  )}
                  <p className="text-orbit-400 text-[10px] font-black uppercase tracking-[0.2em]">{editForm.niche}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                  <div className="bg-surface-900/50 p-5 rounded-2xl border border-white/5">
                    <div className="text-xl font-black text-white font-mono tracking-tighter">{formatNumber(editForm.subscribers)}</div>
                    <div className="text-[8px] text-surface-500 font-black uppercase tracking-widest mt-1">Subscribers</div>
                  </div>
                  <div className="bg-surface-900/50 p-5 rounded-2xl border border-white/5">
                    <div className="text-xl font-black text-emerald-400 font-mono tracking-tighter">৳{editForm.revenue.toLocaleString()}</div>
                    <div className="text-[8px] text-surface-500 font-black uppercase tracking-widest mt-1">Revenue</div>
                  </div>
                </div>

                <div className="mt-10 w-full space-y-4">
                  <div className="p-5 bg-surface-900/30 rounded-2xl border border-white/5 text-left">
                    <div className="text-[9px] text-surface-500 font-black uppercase tracking-widest mb-3">Lifecycle Status</div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(editForm.status)}`}>
                        {editForm.status}
                      </span>
                      <span className="text-[10px] text-surface-400 font-mono">{editForm.youtubeChannelId ? 'LINKED' : 'UNLINKED'}</span>
                    </div>
                  </div>
                  
                  {!isEditing && (
                    <button 
                      onClick={() => window.open(`https://youtube.com/${editForm.linkedChannelHandle || ''}`, '_blank')}
                      className="w-full py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-white transition-all flex items-center justify-center gap-3 group"
                    >
                      <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
                      View on YouTube
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side: Content & Controls */}
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h4 className="text-xl font-black text-white font-display tracking-tight">Channel Intelligence</h4>
                    <p className="text-surface-500 text-[10px] font-black uppercase tracking-widest mt-1">System parameters & connectivity</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-surface-500 hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={isSavingLocal} className="px-8 py-3 orbit-gradient text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-orbit-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2">
                          {isSavingLocal ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                          {isSavingLocal ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-surface-900 border border-white/5 hover:bg-surface-800 rounded-2xl text-xs text-white font-black uppercase tracking-widest transition-all">
                        <Edit2 size={14} />
                        Edit Profile
                      </button>
                    )}
                    <button onClick={handleCloseModal} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-surface-500 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Core Information Section */}
                  <section>
                    <h5 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-orbit-500/30"></span> Core Parameters
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Owner Identity</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orbit-500/30 transition-all font-medium disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Content Niche</label>
                        <select 
                          disabled={!isEditing}
                          value={editForm.niche}
                          onChange={(e) => setEditForm({...editForm, niche: e.target.value})}
                          className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orbit-500/30 transition-all font-medium appearance-none disabled:opacity-50"
                        >
                          {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Application Details Section */}
                  {(editForm.email || editForm.phone || editForm.goal || editForm.channel || editForm.subs) && (
                    <section>
                      <h5 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-blue-500/30"></span> Application Details
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {editForm.email && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Email</label>
                            <div className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white font-medium">
                              {editForm.email}
                            </div>
                          </div>
                        )}
                        {editForm.phone && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">WhatsApp / Phone</label>
                            <div className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white font-medium">
                              {editForm.phone}
                            </div>
                          </div>
                        )}
                        {editForm.channel && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Submitted Channel Link</label>
                            <div className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white font-medium truncate">
                              {editForm.channel}
                            </div>
                          </div>
                        )}
                        {editForm.subs && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Submitted Subscribers</label>
                            <div className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white font-medium">
                              {editForm.subs}
                            </div>
                          </div>
                        )}
                        {editForm.goal && (
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Creator Goal</label>
                            <div className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white font-medium whitespace-pre-wrap">
                              {editForm.goal}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Connectivity Section */}
                  <section>
                    <h5 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-red-500/30"></span> YouTube Integration
                    </h5>
                    <div className="glass-card p-8 rounded-[2rem] border border-white/5">
                      {editForm.linkedChannelHandle ? (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-red-600/20 transform -rotate-3">
                              <Youtube size={32} />
                            </div>
                            <div>
                              <div className="text-lg font-black text-white font-mono tracking-tight">{editForm.linkedChannelHandle}</div>
                              <div className="text-[10px] text-surface-500 font-mono uppercase tracking-widest mt-1">ID: {editForm.youtubeChannelId || 'N/A'}</div>
                              <div className="text-[9px] text-surface-600 font-bold uppercase mt-1">Last Sync: {editForm.lastSynced || 'Never'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleSyncCreator(null as any, selectedCreator)} 
                              className="p-4 bg-surface-900 hover:bg-surface-800 text-white rounded-2xl border border-white/5 transition-all group"
                              title="Sync Now"
                            >
                              <RefreshCw size={18} className={syncingId === selectedCreator.id ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                            </button>
                            <button 
                              onClick={() => setEditForm({...editForm, linkedChannelHandle: undefined, youtubeChannelId: undefined})}
                              className="p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl border border-red-500/20 transition-all"
                              title="Unlink Channel"
                            >
                              <Unlink size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative flex-1 group">
                            <Youtube className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input 
                              type="text" 
                              value={channelHandleInput}
                              onChange={(e) => setChannelHandleInput(e.target.value)}
                              placeholder="Enter Channel Handle (e.g. @OrbitXMCN)"
                              className="w-full pl-14 pr-6 py-4 bg-surface-950 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-red-500 transition-all font-mono text-sm"
                            />
                          </div>
                          <button 
                            onClick={handleConnectChannel}
                            disabled={!channelHandleInput || isSyncing}
                            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                          >
                            {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <LinkIcon size={16} />}
                            <span>Connect</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Additional Settings */}
                  <section>
                    <h5 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-emerald-500/30"></span> Monetization & Policy
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-6 bg-surface-900/30 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] text-surface-500 font-black uppercase tracking-widest mb-1">Monetization</div>
                          <div className="text-white font-black text-sm">{editForm.monetizationStatus || 'Disabled'}</div>
                        </div>
                        <div 
                          onClick={() => isEditing && setEditForm({...editForm, monetizationStatus: editForm.monetizationStatus === 'Enabled' ? 'Disabled' : 'Enabled'})}
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${editForm.monetizationStatus === 'Enabled' ? 'bg-emerald-500' : 'bg-surface-800'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${editForm.monetizationStatus === 'Enabled' ? 'left-7' : 'left-1'}`}></div>
                        </div>
                      </div>
                      <div className="p-6 bg-surface-900/30 rounded-2xl border border-white/5">
                        <label className="text-[9px] text-surface-500 font-black uppercase mb-2 block tracking-widest">Upload Policy</label>
                        <select 
                          disabled={!isEditing}
                          value={editForm.uploadPolicy || 'Global Default'}
                          onChange={(e) => setEditForm({...editForm, uploadPolicy: e.target.value})}
                          className="w-full bg-transparent text-white font-black text-sm outline-none appearance-none disabled:opacity-50"
                        >
                          <option value="Global Default">Global Default</option>
                          <option value="Monetize All">Monetize All</option>
                          <option value="Block Worldwide">Block Worldwide</option>
                        </select>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals for Create/Invite */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-surface-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-card rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 orbit-gradient"></div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white font-display tracking-tight">Invite Creator</h3>
                  <p className="text-surface-500 text-[10px] font-black uppercase tracking-widest mt-1">Onboard new intelligence</p>
                </div>
                <button onClick={() => setShowInviteModal(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-surface-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Channel Handle</label>
                  <input 
                    type="text" 
                    value={inviteChannelUrl} 
                    onChange={e => setInviteChannelUrl(e.target.value)}
                    placeholder="@handle"
                    className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orbit-500/30 transition-all font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                  <input 
                    type="email" 
                    value={inviteEmail} 
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="creator@example.com"
                    className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orbit-500/30 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Initial Status</label>
                  <select 
                    value={inviteStatus}
                    onChange={(e) => setInviteStatus(e.target.value as Creator['status'])}
                    className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orbit-500/30 transition-all font-medium appearance-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
                <button 
                  onClick={handleSendInvite}
                  className="w-full py-5 orbit-gradient text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-orbit-500/20 active:scale-[0.98] transition-all mt-4"
                >
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-surface-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 orbit-gradient"></div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white font-display tracking-tight">Add Creator</h3>
                  <p className="text-surface-500 text-[10px] font-black uppercase tracking-widest mt-1">Manual entry or sync protocol</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-surface-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-8">
                <div className="flex p-1.5 bg-surface-950 rounded-2xl border border-white/5 shadow-inner">
                  <button 
                    onClick={() => setInviteStatus('Processing')} 
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all duration-500 ${inviteStatus === 'Processing' ? 'bg-surface-800 text-white shadow-xl' : 'text-surface-500 hover:text-surface-300'}`}
                  >
                    MANUAL ENTRY
                  </button>
                  <button 
                    onClick={() => setInviteStatus('Active')} 
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all duration-500 ${inviteStatus === 'Active' ? 'bg-red-600 text-white shadow-xl' : 'text-surface-500 hover:text-surface-300'}`}
                  >
                    YOUTUBE SYNC
                  </button>
                </div>

                {inviteStatus === 'Active' ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Channel Handle</label>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={channelHandleInput} 
                          onChange={e => setChannelHandleInput(e.target.value)} 
                          className="flex-1 bg-surface-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500 font-mono text-sm shadow-inner" 
                          placeholder="@handle" 
                        />
                        <button 
                          onClick={async () => {
                            if (!channelHandleInput) return;
                            setIsSyncing(true);
                            try {
                              const data = await fetchChannelDataByHandle(channelHandleInput);
                              if (data) {
                                onAddCreator({
                                  channelName: data.title,
                                  name: data.title,
                                  subscribers: parseInt(data.statistics.subscriberCount),
                                  totalViews: parseInt(data.statistics.viewCount),
                                  videoCount: parseInt(data.statistics.videoCount),
                                  avatarUrl: data.thumbnails.medium.url,
                                  linkedChannelHandle: channelHandleInput,
                                  youtubeChannelId: data.id,
                                  status: 'Active'
                                });
                                setShowCreateModal(false);
                                setChannelHandleInput('');
                              }
                            } catch (err) {
                              if (err instanceof Error && err.message.includes('operationType')) throw err;
                              if (err instanceof Error && (err.name === 'AbortError' || err.message?.toLowerCase().includes('aborted') || err.message?.includes('The user aborted a request'))) {
                                console.debug("YouTube fetch aborted in CreatorsView.");
                              } else {
                                console.error(err);
                              }
                            } finally {
                              setIsSyncing(false);
                            }
                          }}
                          disabled={isSyncing || !channelHandleInput}
                          className="px-8 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-xl shadow-red-600/30 active:scale-95"
                        >
                          {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Youtube size={18} />}
                          <span className="text-[10px] uppercase tracking-widest">Sync</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Channel Name</label>
                      <input 
                        type="text" 
                        value={createChannelName}
                        onChange={(e) => setCreateChannelName(e.target.value)}
                        className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orbit-500/30 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Owner Name</label>
                      <input 
                        type="text" 
                        value={createOwnerName}
                        onChange={(e) => setCreateOwnerName(e.target.value)}
                        className="w-full px-6 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orbit-500/30 transition-all font-medium"
                      />
                    </div>
                    <button 
                      onClick={handleCreateCreator}
                      className="w-full py-5 orbit-gradient text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-orbit-500/20 active:scale-[0.98] transition-all mt-4"
                    >
                      Create Profile
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showDeleteModal && creatorToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-surface-950/90 backdrop-blur-xl p-4 animate-fade-in" onClick={() => setShowDeleteModal(false)}>
            <div className="glass-panel rounded-[2.5rem] w-full max-w-md shadow-2xl relative p-10 text-center flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
                <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-500/10">
                    <ShieldAlert size={48} className="text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-white font-display">Confirm Deletion</h3>
                  <p className="text-surface-400 leading-relaxed">
                      Are you sure you want to delete <span className="text-white font-bold">{creatorToDelete.name}</span>? This action is permanent and will remove all associated records.
                  </p>
                </div>
                <div className="flex gap-4 w-full pt-4">
                    <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-surface-800 hover:bg-surface-700 text-white rounded-2xl font-bold transition-all">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95">Delete Record</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CreatorsView;