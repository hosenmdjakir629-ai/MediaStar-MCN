import React, { useState } from 'react';
import { Save, Bell, User, Check, Shield, Globe, FileText, HelpCircle, X, AlertCircle, Play, Users, Plus, Trash2, Key, Activity } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [defaultPolicy, setDefaultPolicy] = useState('Monetize in all countries');
  const [autoClaim, setAutoClaim] = useState(true);
  const [showPolicyGuide, setShowPolicyGuide] = useState(false);

  // Team State
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@mediastar.network', role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah@mediastar.network', role: 'Content Manager', status: 'Active' },
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Content Manager' });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInvite = () => {
      if (!newMember.name || !newMember.email) return;
      setTeamMembers([...teamMembers, { id: Date.now(), ...newMember, status: 'Pending' }]);
      setShowInviteModal(false);
      setNewMember({ name: '', email: '', role: 'Content Manager' });
  };

  const removeMember = (id: number) => {
      if(confirm('Remove this team member?')) {
          setTeamMembers(teamMembers.filter(m => m.id !== id));
      }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-10">
      {/* Profile Settings */}
      <div className="bg-orbit-800 rounded-2xl p-8 border border-orbit-700">
        <div className="flex items-center space-x-3 mb-6">
            <User className="text-orbit-500" />
            <h3 className="text-xl font-bold text-white">Profile Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Network Name</label>
                <input type="text" defaultValue="OrbitX MCN" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:border-orbit-500 outline-none transition-colors" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin Email</label>
                <input type="email" defaultValue="admin@mediastar.network" className="w-full bg-orbit-900 border border-orbit-700 rounded-xl px-4 py-3 text-white focus:border-orbit-500 outline-none transition-colors" />
            </div>
        </div>
      </div>

      {/* Server Health (New) */}
      <div className="bg-orbit-800 rounded-2xl p-8 border border-orbit-700">
        <div className="flex items-center space-x-3 mb-6">
            <Activity className="text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Server Health & API Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-orbit-900/50 border border-orbit-700 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">API Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-lg font-bold text-white">Operational</span>
                </div>
            </div>
            <div className="p-4 bg-orbit-900/50 border border-orbit-700 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Response Time</p>
                <span className="text-lg font-bold text-white">24ms</span>
            </div>
            <div className="p-4 bg-orbit-900/50 border border-orbit-700 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Uptime</p>
                <span className="text-lg font-bold text-white">99.98%</span>
            </div>
        </div>
        <div className="mt-4 p-4 bg-orbit-900/30 border border-orbit-700/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orbit-500/10 rounded-lg text-orbit-500">
                    <Globe size={18} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Primary Endpoint</p>
                    <p className="text-xs text-gray-500">https://api.orbitx.mcn/v1</p>
                </div>
            </div>
            <button className="text-xs font-bold text-orbit-500 hover:text-orbit-400 transition-colors">Test Connection</button>
        </div>
      </div>

      {/* Team & Roles Section (New) */}
      <div className="bg-orbit-800 rounded-2xl p-8 border border-orbit-700">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
                <Users className="text-purple-400" />
                <h3 className="text-xl font-bold text-white">Team & Roles</h3>
            </div>
            <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orbit-500 hover:bg-orbit-400 text-white rounded-lg text-sm font-bold transition-all"
            >
                <Plus size={16} />
                <span>Invite Member</span>
            </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-orbit-700">
            <table className="w-full text-left">
                <thead className="bg-orbit-900/50 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-orbit-700 bg-orbit-900/20">
                    {teamMembers.map(member => (
                        <tr key={member.id} className="hover:bg-orbit-700/30">
                            <td className="p-4">
                                <div className="font-bold text-white text-sm">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.email}</div>
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    member.role === 'Administrator' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                    member.role === 'Content Manager' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                }`}>
                                    {member.role === 'Administrator' && <Key size={12} />}
                                    {member.role === 'Content Manager' && <FileText size={12} />}
                                    {member.role}
                                </span>
                            </td>
                             <td className="p-4">
                                <span className={`text-xs font-bold ${member.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button onClick={() => removeMember(member.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Role Descriptions Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orbit-900/30 border border-orbit-700/50 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-sm">
                    <Key size={14} /> Administrator
                 </div>
                 <p className="text-xs text-gray-500">Full access to all settings, payouts, user management, and network analytics.</p>
            </div>
            <div className="p-4 bg-orbit-900/30 border border-orbit-700/50 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
                    <FileText size={14} /> Content Manager
                 </div>
                 <p className="text-xs text-gray-500">Specific access to manage videos, assets, and claims in the YouTube CMS. Cannot access payouts.</p>
            </div>
        </div>
      </div>

      {/* Monetization & Policies */}
      <div className="bg-orbit-800 rounded-2xl p-8 border border-orbit-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shield size={100} />
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center space-x-3">
                <Shield className="text-green-400" />
                <div>
                    <h3 className="text-xl font-bold text-white">Content ID & Policies</h3>
                    <p className="text-xs text-gray-400">Manage global monetization rules.</p>
                </div>
            </div>
            <button 
                onClick={() => setShowPolicyGuide(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orbit-900 border border-orbit-600 rounded-lg text-sm text-gray-300 hover:text-white hover:border-orbit-500 transition-all"
            >
                <HelpCircle size={16} />
                <span>Policy Guide</span>
            </button>
        </div>

        <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Global Default Upload Policy</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <select 
                            value={defaultPolicy}
                            onChange={(e) => setDefaultPolicy(e.target.value)}
                            className="w-full bg-orbit-900 border border-orbit-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-orbit-500 outline-none appearance-none cursor-pointer"
                        >
                            <option>Monetize in all countries</option>
                            <option>Track in all countries</option>
                            <option>Block in all countries</option>
                            <option>Monetize in US; Track elsewhere</option>
                        </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        This policy applies to all new videos uploaded by linked channels unless a specific channel override is set.
                    </p>
                </div>
                
                <div className="flex flex-col justify-center">
                     <div className="flex items-center justify-between p-4 bg-orbit-900/50 rounded-xl border border-orbit-700/50">
                        <div>
                            <h4 className="font-medium text-white">Auto-Claim Uploads</h4>
                            <p className="text-xs text-gray-500">Automatically create assets & claims for new uploads.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={autoClaim} 
                                onChange={(e) => setAutoClaim(e.target.checked)} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-orbit-800 rounded-2xl p-8 border border-orbit-700">
         <div className="flex items-center space-x-3 mb-6">
            <Bell className="text-orbit-accent" />
            <h3 className="text-xl font-bold text-white">Notifications</h3>
        </div>
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orbit-900/50 rounded-xl">
                <div>
                    <h4 className="font-medium text-white">Daily Digest</h4>
                    <p className="text-xs text-gray-500">Receive a daily summary of network performance.</p>
                </div>
                 <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orbit-500"></div>
                </div>
            </div>
             <div className="flex items-center justify-between p-4 bg-orbit-900/50 rounded-xl">
                <div>
                    <h4 className="font-medium text-white">Payment Alerts</h4>
                    <p className="text-xs text-gray-500">Get notified when payouts are processed.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orbit-500"></div>
                </div>
            </div>
        </div>
      </div>
      
       <div className="flex justify-end sticky bottom-6 z-10">
        <button 
            onClick={handleSave}
            className={`flex items-center space-x-2 px-8 py-3 font-bold rounded-xl shadow-lg transition-all transform active:scale-95 ${saved ? 'bg-green-500 text-white' : 'bg-orbit-500 hover:bg-orbit-400 text-white shadow-orbit-500/20'}`}
        >
            {saved ? <Check size={20} /> : <Save size={20} />}
            <span>{saved ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
       </div>

       {/* Invite Modal */}
       {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowInviteModal(false)}>
            <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-md shadow-2xl relative p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-white mb-4">Invite Team Member</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Name</label>
                        <input 
                            type="text" 
                            value={newMember.name} 
                            onChange={e => setNewMember({...newMember, name: e.target.value})}
                            className="w-full bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-2 text-white outline-none focus:border-orbit-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Email</label>
                        <input 
                            type="email" 
                            value={newMember.email} 
                            onChange={e => setNewMember({...newMember, email: e.target.value})}
                            className="w-full bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-2 text-white outline-none focus:border-orbit-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Role</label>
                        <select 
                            value={newMember.role}
                            onChange={e => setNewMember({...newMember, role: e.target.value})}
                            className="w-full bg-orbit-800 border border-orbit-700 rounded-xl px-4 py-2 text-white outline-none focus:border-orbit-500"
                        >
                            <option value="Administrator">Administrator</option>
                            <option value="Content Manager">Content Manager</option>
                            <option value="Analyst">Analyst</option>
                        </select>
                    </div>
                    
                    {newMember.role === 'Content Manager' && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                            <strong>Permissions:</strong> Can view, edit, and manage video assets, claims, and policies. No access to financial data.
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button onClick={() => setShowInviteModal(false)} className="flex-1 py-2 bg-orbit-700 hover:bg-orbit-600 text-white rounded-xl">Cancel</button>
                        <button onClick={handleInvite} className="flex-1 py-2 bg-orbit-500 hover:bg-orbit-400 text-white rounded-xl font-bold">Send Invite</button>
                    </div>
                </div>
            </div>
        </div>
      )}

       {/* Policy Guide Modal */}
       {showPolicyGuide && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowPolicyGuide(false)}>
            <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-orbit-700 bg-orbit-800 flex justify-between items-center sticky top-0 z-20">
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                             <FileText size={20} />
                         </div>
                         <h3 className="text-lg font-bold text-white">Automating Monetization Policies</h3>
                     </div>
                     <button onClick={() => setShowPolicyGuide(false)} className="text-gray-400 hover:text-white">
                         <X size={20} />
                     </button>
                </div>

                <div className="p-8 space-y-8">
                     
                     <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-orbit-800 border border-orbit-600 flex items-center justify-center font-bold text-white shrink-0">1</div>
                         <div>
                             <h4 className="text-lg font-bold text-white mb-2">Set a Global Default Policy</h4>
                             <p className="text-gray-400 text-sm mb-3">This is the "master switch" for your entire network.</p>
                             <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                 <li>Sign in to Studio Content Manager.</li>
                                 <li>From the left menu, select <strong>Policies</strong>.</li>
                                 <li>Find the policy (e.g., "Monetize in all countries").</li>
                                 <li>Click the Select action dropdown and choose <strong>Set as default upload</strong>.</li>
                             </ul>
                         </div>
                     </div>

                     <div className="w-full h-px bg-orbit-700/50"></div>

                     <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-orbit-800 border border-orbit-600 flex items-center justify-center font-bold text-white shrink-0">2</div>
                         <div>
                             <h4 className="text-lg font-bold text-white mb-2">Enable "Monetize Uploads" for Specific Channels</h4>
                             <p className="text-gray-400 text-sm mb-3">You must give permission to new channels to be monetized by your CMS.</p>
                             <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                 <li>Go to the <strong>Channels</strong> tab in Content Manager.</li>
                                 <li>Click on the specific channel name.</li>
                                 <li>Under Permissions, toggle <strong>Monetize uploads</strong> to Enabled.</li>
                             </ul>
                         </div>
                     </div>

                     <div className="w-full h-px bg-orbit-700/50"></div>

                     <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-orbit-800 border border-orbit-600 flex items-center justify-center font-bold text-white shrink-0">3</div>
                         <div>
                             <h4 className="text-lg font-bold text-white mb-2">Set Channel-Specific Defaults</h4>
                             <p className="text-gray-400 text-sm mb-3">For specific channels requiring different settings:</p>
                             <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                 <li>Switch into that specific channel (Profile Icon {'>'} Switch Account).</li>
                                 <li>Go to <strong>Settings {'>'} Upload defaults</strong>.</li>
                                 <li>Under Monetization, ensure ad types are checked.</li>
                             </ul>
                         </div>
                     </div>

                     <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 mt-6">
                         <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
                         <div>
                             <h5 className="font-bold text-yellow-500 text-sm mb-1">Quick Troubleshooting</h5>
                             <ul className="text-xs text-yellow-200/80 space-y-1">
                                 <li><strong>Existing Videos:</strong> Default policies only affect <em>future</em> uploads. For existing videos, bulk edit in the Videos tab.</li>
                                 <li><strong>Claim vs Monetize:</strong> Ensure a "Partner-uploaded claim" exists in the Claims section if ads aren't showing.</li>
                             </ul>
                         </div>
                     </div>
                </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default SettingsView;