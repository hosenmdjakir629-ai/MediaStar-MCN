import React, { useState, useRef } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle, AlertCircle, Trash2, X, Edit2, Save, XCircle, Camera, Youtube, TrendingUp, DollarSign, Users, Link as LinkIcon, Unlink, RefreshCw, ExternalLink, Check, ShieldCheck, Upload, Mail, UserPlus, Info, HelpCircle, Plus, Briefcase, Zap, Lock, Shield, Globe, Video, Clock, ImageUp } from 'lucide-react';
import { Creator } from '../types';
import { fetchChannelDataByHandle } from '../services/youtubeService';

interface CreatorsViewProps {
  creators: Creator[];
  onAddCreator: (creator?: Partial<Creator>) => void;
  onDeleteCreator: (id: string) => void;
  onUpdateCreator: (creator: Creator) => void;
}

const CreatorsView: React.FC<CreatorsViewProps> = ({ creators, onAddCreator, onDeleteCreator, onUpdateCreator }) => {
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
  
  // YouTube Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [channelHandleInput, setChannelHandleInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          channelName: data.title,
          subscribers: parseInt(data.statistics.subscriberCount),
          totalViews: parseInt(data.statistics.viewCount),
          videoCount: parseInt(data.statistics.videoCount),
          lastSynced: new Date().toLocaleString()
        });
        setSyncSuccess(true);
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search customers & channels..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-3 bg-orbit-800 border border-orbit-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orbit-500 transition-all"
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button onClick={() => setShowInviteModal(true)} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-3 bg-orbit-800 border border-orbit-700 rounded-xl text-gray-300 hover:text-white transition-all">
            <Mail size={18} />
            <span>Invite</span>
          </button>
          <button onClick={() => { setCreateChannelName(''); setShowCreateModal(true); }} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-orbit-500 hover:bg-orbit-400 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95">
            <Plus size={18} />
            <span>Add Creator</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-orbit-800 border border-orbit-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-orbit-900/50 text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 sm:p-4 font-bold">Creator Detail</th>
                <th className="p-3 sm:p-4 font-bold text-center">Lifecycle</th>
                <th className="p-3 sm:p-4 font-bold text-right">Subscribers</th>
                <th className="p-3 sm:p-4 font-bold text-right">Revenue</th>
                <th className="p-3 sm:p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orbit-700">
              {paginatedCreators.map((creator) => (
                <tr key={creator.id} onClick={() => handleRowClick(creator)} className="hover:bg-orbit-700/30 transition-colors cursor-pointer group">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3">
                      <img src={creator.avatarUrl} alt={creator.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-orbit-700 object-cover" />
                      <div>
                        <div className="font-bold text-white text-xs sm:text-sm group-hover:text-orbit-400 transition-colors">{creator.channelName}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">{creator.name} • {creator.niche}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(creator.status)}`}>
                      {creator.status}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-right">
                    <div className="text-xs sm:text-sm font-bold text-white font-mono">{formatNumber(creator.subscribers)}</div>
                  </td>
                  <td className="p-3 sm:p-4 text-right">
                    <div className="text-xs sm:text-sm font-bold text-white font-mono">৳{creator.revenue.toLocaleString()}</div>
                  </td>
                  <td className="p-3 sm:p-4 text-right">
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                       <button onClick={(e) => { e.stopPropagation(); handleEditClick(creator); }} className="p-1.5 sm:p-2 text-gray-400 hover:text-white bg-orbit-900/50 rounded-lg">
                          <Edit2 size={14} className="sm:w-4 sm:h-4" />
                       </button>
                       <button onClick={(e) => { e.stopPropagation(); onDeleteCreator(creator.id); }} className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 bg-orbit-900/50 rounded-lg">
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
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
      {selectedCreator && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={handleCloseModal}>
           <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="p-4 sm:p-6 border-b border-orbit-700 bg-orbit-800 sticky top-0 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                        {/* Avatar Upload Section */}
                        <div 
                            className={`relative group w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-orbit-900 border-2 ${isEditing ? 'border-dashed border-orbit-400 cursor-pointer hover:border-orbit-300' : 'border-orbit-700'} overflow-hidden transition-all shrink-0`}
                            onDrop={isEditing ? handleDrop : undefined}
                            onDragOver={isEditing ? (e) => { e.preventDefault(); setIsDragging(true); } : undefined}
                            onDragLeave={isEditing ? () => setIsDragging(false) : undefined}
                            onClick={() => isEditing && fileInputRef.current?.click()}
                            title={isEditing ? "Click to upload image" : ""}
                        >
                            <img src={editForm.avatarUrl} alt={editForm.name} className="w-full h-full object-cover" />
                             {isEditing && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                    <Camera size={16} className="sm:w-5 sm:h-5" />
                                    <span className="text-[8px] sm:text-[10px] mt-1 font-bold">UPLOAD</span>
                                </div>
                             )}
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*"
                             />
                        </div>

                        <div className="w-full overflow-hidden">
                            {isEditing ? (
                                <div className="space-y-2 sm:space-y-3">
                                  <div className="flex gap-2">
                                      <input type="text" value={editForm.channelName} onChange={(e) => setEditForm({...editForm, channelName: e.target.value})} className="bg-orbit-900 border border-orbit-700 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-lg font-bold text-white focus:border-orbit-500 outline-none w-full shadow-inner placeholder-gray-600" placeholder="Channel Name" />
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                      <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="bg-orbit-900 border border-orbit-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-300 focus:border-orbit-500 outline-none w-full sm:w-1/2 shadow-inner placeholder-gray-600" placeholder="Owner Name" />
                                      <input type="text" value={editForm.avatarUrl} onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})} className="bg-orbit-900 border border-orbit-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-500 focus:border-orbit-500 outline-none w-full sm:w-1/2 shadow-inner font-mono" placeholder="Image URL (Optional)" />
                                  </div>
                                </div>
                            ) : (
                              <>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">{editForm.channelName}</h2>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                    <span className="truncate max-w-[100px]">{editForm.name}</span>
                                    <span>•</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black border uppercase ${getStatusStyle(editForm.status)}`}>
                                        {editForm.status}
                                    </span>
                                </div>
                              </>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 border-orbit-700 pt-4 sm:pt-0">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white font-bold transition-colors">Cancel</button>
                                <button onClick={handleSave} disabled={isSavingLocal} className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50">
                                    {isSavingLocal ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                                    <span>{isSavingLocal ? 'Commiting...' : 'Save'}</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-orbit-800 border border-orbit-700 hover:bg-orbit-700 rounded-xl text-xs sm:text-sm text-gray-300 font-bold transition-all whitespace-nowrap">
                                    <Edit2 size={14} />
                                    <span>Edit</span>
                                </button>
                                <button onClick={handleCloseModal} className="p-1.5 sm:p-2 text-gray-500 hover:text-white">
                                    <X size={20} className="sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                     <div className="lg:col-span-1 space-y-6">
                         {isEditing ? (
                            <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700 space-y-6">
                                <div>
                                    <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                                        <Shield size={14} className="text-orbit-400" /> LifeCycle Management
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-gray-500 font-black uppercase mb-1 block">Record Status</label>
                                            <select 
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Creator['status'] })}
                                                className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orbit-500 shadow-inner"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Suspended">Suspended</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 font-black uppercase mb-1 block">Content Niche</label>
                                            <input 
                                                type="text" 
                                                value={editForm.niche}
                                                onChange={(e) => setEditForm({ ...editForm, niche: e.target.value })}
                                                className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orbit-500 shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-orbit-700">
                                    <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                                        <DollarSign size={14} className="text-green-400" /> Revenue Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-orbit-900 rounded-xl border border-orbit-700">
                                            <span className="text-sm text-gray-300">Monetization</span>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={editForm.monetizationStatus === 'Enabled'} 
                                                    onChange={(e) => setEditForm({...editForm, monetizationStatus: e.target.checked ? 'Enabled' : 'Disabled'})} 
                                                    className="sr-only peer" 
                                                />
                                                <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 font-black uppercase mb-1 block">Upload Policy</label>
                                            <select 
                                                value={editForm.uploadPolicy || 'Global Default'}
                                                onChange={(e) => setEditForm({ ...editForm, uploadPolicy: e.target.value })}
                                                className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orbit-500 shadow-inner"
                                            >
                                                <option value="Global Default">Global Default</option>
                                                <option value="Monetize All">Monetize All</option>
                                                <option value="Block Worldwide">Block Worldwide</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         ) : (
                             <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700 space-y-6">
                                 <div className="flex justify-between items-center">
                                    <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp size={14} /> Analytics Hub
                                    </h3>
                                    <div className="px-2 py-0.5 bg-orbit-900 rounded-lg text-[10px] font-mono text-orbit-400 border border-orbit-700">LIVE</div>
                                 </div>
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">Subscribers</span><span className="text-white font-mono font-bold">{formatNumber(editForm.subscribers)}</span></div>
                                     <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">Total Views</span><span className="text-white font-mono font-bold">{formatNumber(editForm.totalViews || 0)}</span></div>
                                     <div className="flex justify-between items-center"><span className="text-gray-500 text-sm">Network Earnings</span><span className="text-green-400 font-mono font-bold">৳{editForm.revenue.toLocaleString()}</span></div>
                                     <div className="pt-4 border-t border-orbit-700">
                                         <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider mb-2"><span>Network Policy</span><span>{editForm.uploadPolicy || 'Default'}</span></div>
                                         <div className="h-1.5 bg-orbit-900 rounded-full overflow-hidden"><div className="h-full bg-orbit-500 w-[65%]"></div></div>
                                     </div>
                                 </div>
                             </div>
                         )}
                     </div>

                     <div className="lg:col-span-2 space-y-6">
                         <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
                             <div className="flex justify-between items-start mb-6">
                                 <div>
                                     <h3 className="text-lg font-bold text-white flex items-center gap-2"><Youtube className="text-red-500" /> API Connectivity</h3>
                                     <p className="text-sm text-gray-400">Manage real-time YouTube Content ID link.</p>
                                 </div>
                                 {editForm.linkedChannelHandle && <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-black tracking-widest">STABLE</div>}
                             </div>
                             {editForm.linkedChannelHandle ? (
                                 <div className="p-5 bg-orbit-900/50 border border-orbit-700 rounded-2xl space-y-4">
                                     <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20"><Youtube size={24} /></div>
                                             <div>
                                                 <div className="font-bold text-white font-mono">{editForm.linkedChannelHandle}</div>
                                                 <div className="text-xs text-gray-500">Last Synced: {editForm.lastSynced || 'Never'}</div>
                                             </div>
                                         </div>
                                         <div className="flex gap-2">
                                             <button onClick={() => window.open(`https://youtube.com/${editForm.linkedChannelHandle}`, '_blank')} className="p-2.5 bg-orbit-800 hover:bg-orbit-700 text-gray-300 rounded-xl border border-orbit-700 transition-colors"><ExternalLink size={18} /></button>
                                             <button onClick={() => setEditForm({...editForm, linkedChannelHandle: undefined})} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors"><Unlink size={18} /></button>
                                         </div>
                                     </div>
                                     {syncSuccess && <div className="p-2 bg-green-500/10 rounded-lg text-xs text-green-400 flex items-center gap-2"><Check size={14} />Synchronized with latest YouTube Data.</div>}
                                 </div>
                             ) : (
                                 <div className="space-y-4">
                                     <div className="flex gap-3">
                                         <input type="text" value={channelHandleInput} onChange={(e) => setChannelHandleInput(e.target.value)} placeholder="Enter Channel Handle (e.g. @MediaStarMCN)" className="flex-1 bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 transition-all font-mono shadow-inner" />
                                         <button onClick={handleConnectChannel} disabled={!channelHandleInput || isSyncing} className="px-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-600/20">
                                             {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <LinkIcon size={18} />}
                                             <span>SYNC</span>
                                         </button>
                                     </div>
                                 </div>
                             )}
                         </div>

                         <div className="bg-orbit-800 rounded-2xl p-6 border border-orbit-700">
                             <h3 className="text-lg font-bold text-white mb-4">Customer Intelligence</h3>
                             <div className="grid grid-cols-2 gap-6">
                                 <div className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700">
                                     <label className="text-[10px] text-gray-500 font-black uppercase mb-1 block">Network Status</label>
                                     <div className="text-white font-bold">{editForm.monetizationStatus === 'Enabled' ? 'Direct Monetization' : 'O&O Non-Monetized'}</div>
                                 </div>
                                 <div className="p-4 bg-orbit-900/50 rounded-xl border border-orbit-700">
                                     <label className="text-[10px] text-gray-500 font-black uppercase mb-1 block">Revenue Tier</label>
                                     <div className="text-orbit-400 font-bold flex items-center gap-2">
                                         <Briefcase size={14} /> Tier 1 (80/20)
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
           </div>
        </div>
      )}

      {/* Modals for Create/Invite */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowInviteModal(false)}>
            <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-md shadow-2xl relative p-8" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-white mb-6">Invite Creator</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Channel URL / Handle</label>
                        <input type="text" value={inviteChannelUrl} onChange={e => setInviteChannelUrl(e.target.value)} className="w-full bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orbit-500" placeholder="@handle" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Invite Email</label>
                        <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orbit-500" placeholder="creator@example.com" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Initial Status</label>
                      <select 
                          value={inviteStatus}
                          onChange={(e) => setInviteStatus(e.target.value as Creator['status'])}
                          className="w-full bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orbit-500"
                      >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Active">Active</option>
                      </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setShowInviteModal(false)} className="flex-1 py-3 bg-orbit-700 hover:bg-orbit-600 text-white rounded-xl font-bold transition-colors">Cancel</button>
                        <button onClick={handleSendInvite} className="flex-1 py-3 bg-orbit-500 hover:bg-orbit-400 text-white rounded-xl font-bold transition-all shadow-lg">Send Invite</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowCreateModal(false)}>
            <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-md shadow-2xl relative p-8" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-white mb-6">Add New Creator</h3>
                <div className="space-y-4">
                    <div className="flex p-1 bg-orbit-800 rounded-xl border border-orbit-700 mb-4">
                        <button 
                            onClick={() => setInviteStatus('Processing')} 
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${inviteStatus === 'Processing' ? 'bg-orbit-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            MANUAL
                        </button>
                        <button 
                            onClick={() => setInviteStatus('Active')} 
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${inviteStatus === 'Active' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            YOUTUBE SYNC
                        </button>
                    </div>

                    {inviteStatus === 'Active' ? (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Channel Handle</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={channelHandleInput} 
                                    onChange={e => setChannelHandleInput(e.target.value)} 
                                    className="flex-1 bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 font-mono" 
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
                                                    status: 'Active'
                                                });
                                                setShowCreateModal(false);
                                                setChannelHandleInput('');
                                            }
                                        } catch (err) {
                                            console.error(err);
                                        } finally {
                                            setIsSyncing(false);
                                        }
                                    }}
                                    disabled={isSyncing || !channelHandleInput}
                                    className="px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl disabled:opacity-50"
                                >
                                    {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Youtube size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">Enter a YouTube handle to automatically pull channel data.</p>
                        </div>
                    ) : (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Channel Name</label>
                            <input type="text" value={createChannelName} onChange={e => setCreateChannelName(e.target.value)} className="w-full bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orbit-500" placeholder="e.g. MrBeast" />
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-orbit-700 hover:bg-orbit-600 text-white rounded-xl font-bold transition-colors">Cancel</button>
                        {inviteStatus !== 'Active' && (
                            <button 
                                onClick={() => {
                                    onAddCreator({ channelName: createChannelName, status: 'Processing' });
                                    setShowCreateModal(false);
                                }} 
                                disabled={!createChannelName}
                                className="flex-1 py-3 bg-orbit-500 hover:bg-orbit-400 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
                            >
                                Create
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CreatorsView;