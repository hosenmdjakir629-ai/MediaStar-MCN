import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Search, Filter, AlertTriangle, FileVideo, Music, PlaySquare, Gavel, FileText, CheckCircle2, XCircle, Clock, ChevronDown, Download, Upload } from 'lucide-react';
import { CopyrightClaim, ContentAsset } from '../types';

const MOCK_CLAIMS: CopyrightClaim[] = [
  { id: 'C-1001', videoId: 'v1a2b3c4', videoTitle: 'Top 10 Gaming Moments 2025', claimant: 'Epic Sounds Records', type: 'Audio', status: 'Active', date: '2025-10-15', policy: 'Monetize', creatorId: 'user1' },
  { id: 'C-1002', videoId: 'v5d6e7f8', videoTitle: 'Vlog: My Trip to Japan', claimant: 'Sony Music Entertainment', type: 'Melody', status: 'Disputed', date: '2025-11-02', policy: 'Block', creatorId: 'user2' },
  { id: 'C-1003', videoId: 'v9g0h1i2', videoTitle: 'Reacting to Funny Memes', claimant: 'Viral Videos LLC', type: 'Video', status: 'Released', date: '2025-11-20', policy: 'Track', creatorId: 'user3' },
  { id: 'C-1004', videoId: 'v3j4k5l6', videoTitle: 'How to build a PC', claimant: 'Tech Tunes', type: 'Audio', status: 'Appealed', date: '2025-12-05', policy: 'Monetize', creatorId: 'user1' },
];

const MOCK_ASSETS: ContentAsset[] = [
  { id: 'A-5001', title: 'OrbitX Intro Theme', type: 'Sound Recording', ownership: 'Global', matches: 142, dailyViews: 45000, status: 'Active' },
  { id: 'A-5002', title: 'Gaming Highlights Compilation Vol 1', type: 'Web', ownership: 'North America, Europe', matches: 38, dailyViews: 12000, status: 'Active' },
  { id: 'A-5003', title: 'Tech Review Background Music', type: 'Audio', ownership: 'Global', matches: 512, dailyViews: 150000, status: 'Active' },
  { id: 'A-5004', title: 'Old Vlog Outro', type: 'Sound Recording', ownership: 'Global', matches: 5, dailyViews: 300, status: 'Inactive' },
] as any;

const ContentIDView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'claims' | 'assets' | 'disputes' | 'protection'>('claims');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = MOCK_CLAIMS.filter(c => c.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) || c.claimant.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAssets = MOCK_ASSETS.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const disputes = MOCK_CLAIMS.filter(c => c.status === 'Disputed' || c.status === 'Appealed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Disputed': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Appealed': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Released': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPolicyColor = (policy: string) => {
    switch (policy) {
      case 'Monetize': return 'text-green-400';
      case 'Track': return 'text-blue-400';
      case 'Block': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-orbit-500" size={32} />
            Copyright & Content ID
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage claims, monitor assets, and protect your video ownership.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-orbit-800 border border-orbit-700 text-white rounded-xl text-sm font-bold hover:bg-orbit-700 transition-all">
            <Upload size={16} />
            <span>Upload Reference</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orbit-500 text-white rounded-xl text-sm font-bold hover:bg-orbit-400 transition-all shadow-lg shadow-orbit-500/20">
            <Gavel size={16} />
            <span>File Dispute</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-orbit-800/50 backdrop-blur-xl border border-orbit-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <AlertTriangle size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Claims</h3>
          <p className="text-3xl font-black text-white mt-1">124</p>
        </div>
        <div className="bg-orbit-800/50 backdrop-blur-xl border border-orbit-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
              <Gavel size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pending Disputes</h3>
          <p className="text-3xl font-black text-white mt-1">18</p>
        </div>
        <div className="bg-orbit-800/50 backdrop-blur-xl border border-orbit-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orbit-500/10 rounded-xl text-orbit-500">
              <FileVideo size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Monitored Assets</h3>
          <p className="text-3xl font-black text-white mt-1">1,402</p>
        </div>
        <div className="bg-orbit-800/50 backdrop-blur-xl border border-orbit-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <ShieldCheck size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Protected Revenue</h3>
          <p className="text-3xl font-black text-white mt-1">৳42.5K</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-orbit-800/50 backdrop-blur-xl border border-orbit-700 rounded-2xl overflow-hidden">
        <div className="flex border-b border-orbit-700 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'claims' ? 'border-orbit-500 text-white bg-orbit-500/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Copyright Claims
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'assets' ? 'border-orbit-500 text-white bg-orbit-500/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Content ID Assets
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'disputes' ? 'border-orbit-500 text-white bg-orbit-500/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Dispute Management
          </button>
          <button
            onClick={() => setActiveTab('protection')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'protection' ? 'border-orbit-500 text-white bg-orbit-500/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Ownership Protection
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search by title, ID, or claimant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-orbit-900/50 border border-orbit-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-orbit-500 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-orbit-900/50 border border-orbit-700 text-white rounded-xl hover:bg-orbit-800 transition-colors">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>

          {activeTab === 'claims' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-orbit-700 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4 font-bold">Video</th>
                    <th className="p-4 font-bold">Claimant</th>
                    <th className="p-4 font-bold">Type</th>
                    <th className="p-4 font-bold">Policy</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orbit-700/50">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orbit-900 rounded-lg flex items-center justify-center text-gray-400">
                            <PlaySquare size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{claim.videoTitle}</p>
                            <p className="text-xs text-gray-500 font-mono">{claim.videoId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-300">{claim.claimant}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          {claim.type === 'Audio' || claim.type === 'Melody' ? <Music size={14} /> : <FileVideo size={14} />}
                          {claim.type}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-bold ${getPolicyColor(claim.policy)}`}>{claim.policy}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">{claim.date}</td>
                      <td className="p-4 text-right">
                        <button className="text-orbit-500 hover:text-orbit-400 text-sm font-bold transition-colors">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-orbit-700 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4 font-bold">Asset Title</th>
                    <th className="p-4 font-bold">Type</th>
                    <th className="p-4 font-bold">Ownership</th>
                    <th className="p-4 font-bold">Matches</th>
                    <th className="p-4 font-bold">Daily Views</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orbit-700/50">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orbit-900 rounded-lg flex items-center justify-center text-orbit-500">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{asset.title}</p>
                            <p className="text-xs text-gray-500 font-mono">{asset.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-300">{asset.type}</td>
                      <td className="p-4 text-sm text-gray-400">{asset.ownership}</td>
                      <td className="p-4 text-sm font-bold text-white">{asset.matches}</td>
                      <td className="p-4 text-sm text-gray-400">{asset.dailyViews.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 text-sm font-bold ${asset.status === 'Active' ? 'text-green-400' : 'text-gray-500'}`}>
                          {asset.status === 'Active' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="space-y-4">
              {disputes.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-white">No Active Disputes</h3>
                  <p className="text-gray-400 mt-2">All copyright claims are currently resolved or undisputed.</p>
                </div>
              ) : (
                disputes.map(dispute => (
                  <div key={dispute.id} className="bg-orbit-900/50 border border-orbit-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${dispute.status === 'Appealed' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        <Gavel size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white">{dispute.videoTitle}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(dispute.status)}`}>
                            {dispute.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">Claimant: <span className="text-gray-300">{dispute.claimant}</span> • ID: {dispute.id}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1 text-xs text-gray-500"><Clock size={12} /> Filed: {dispute.date}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-500"><AlertTriangle size={12} /> Policy: {dispute.policy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-orbit-800 text-white text-sm font-bold rounded-lg hover:bg-orbit-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-orbit-500 text-white text-sm font-bold rounded-lg hover:bg-orbit-400 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'protection' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-orbit-900/50 border border-orbit-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-green-400" size={20} />
                  Default Match Policies
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orbit-800/50 rounded-lg border border-orbit-700/50">
                    <div>
                      <p className="font-bold text-white text-sm">User Uploads (UGC)</p>
                      <p className="text-xs text-gray-400 mt-0.5">When users upload matching content</p>
                    </div>
                    <select className="bg-orbit-900 border border-orbit-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-orbit-500">
                      <option>Monetize</option>
                      <option>Track</option>
                      <option>Block</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orbit-800/50 rounded-lg border border-orbit-700/50">
                    <div>
                      <p className="font-bold text-white text-sm">Short-form Content</p>
                      <p className="text-xs text-gray-400 mt-0.5">Matches under 60 seconds</p>
                    </div>
                    <select className="bg-orbit-900 border border-orbit-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-orbit-500">
                      <option>Track</option>
                      <option>Monetize</option>
                      <option>Block</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orbit-800/50 rounded-lg border border-orbit-700/50">
                    <div>
                      <p className="font-bold text-white text-sm">Melody Matches</p>
                      <p className="text-xs text-gray-400 mt-0.5">Cover songs and audio matches</p>
                    </div>
                    <select className="bg-orbit-900 border border-orbit-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-orbit-500">
                      <option>Monetize</option>
                      <option>Track</option>
                      <option>Block</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-orbit-900/50 border border-orbit-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-400" size={20} />
                  Ownership Conflicts
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-yellow-500 mt-0.5" size={16} />
                      <div>
                        <p className="font-bold text-white text-sm">Conflict: "Gaming Highlights Vol 1"</p>
                        <p className="text-xs text-gray-400 mt-1">Ownership conflict with 'Global Media Corp' in territories: US, CA.</p>
                        <button className="mt-3 text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors">
                          Resolve Conflict &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-orbit-800/50 border border-orbit-700/50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Auto-Resolve Settings</p>
                      <p className="text-xs text-gray-400 mt-0.5">Automatically release claims on whitelisted channels</p>
                    </div>
                    <button className="w-10 h-6 bg-orbit-500 rounded-full relative transition-colors">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentIDView;
