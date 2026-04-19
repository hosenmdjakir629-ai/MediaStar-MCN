import { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";
import MainLayout from "../layout/MainLayout";
import { Upload, FileAudio, FileVideo, Clock, CheckCircle, XCircle, Search, ChevronDown, ChevronUp, AlertTriangle, Loader2 } from "lucide-react";

interface Asset {
  id: string;
  title: string;
  type: 'Audio' | 'Video';
  status: 'Active' | 'Processing' | 'Rejected';
  fileUrl?: string;
}

interface Claim {
  id: string;
  videoTitle: string;
  claimant: string;
  matchPercentage: number;
  status: 'Monetized' | 'Blocked';
}

export default function ContentLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  
  const handleFileUpload = useCallback(async (file: File) => {
    if (!auth.currentUser) return;
    setIsUploading(true);
    const storageRef = ref(storage, `content_assets/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const fileUrl = await getDownloadURL(uploadTask.ref);

    await addDoc(collection(db, 'content_id_assets'), {
      title: file.name,
      type: file.type.startsWith('audio') ? 'Audio' : 'Video',
      status: 'Processing',
      fileUrl,
      ownerUid: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });
    setIsUploading(false);
  }, []);

  // Asset Form State
  const [newAsset, setNewAsset] = useState({ title: '', type: 'Audio', policy: 'Monetize', artist: '', isrc: '', videoLink: '', videoContentId: '' });
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);

  useEffect(() => {
    const assetsQuery = query(collection(db, "content_id_assets"), orderBy("createdAt", "desc"));
    const unsubscribeAssets = onSnapshot(assetsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Asset));
      setAssets(data);
    });

    // Mock claims for demonstration based on user request
    setClaims([
      { id: '1', videoTitle: 'Deep House Mix 2026', claimant: 'DJ OrbitX', matchPercentage: 98, status: 'Blocked' },
      { id: '2', videoTitle: 'Tutorial: Unreal Engine 5', claimant: 'TechVibes', matchPercentage: 72, status: 'Monetized' },
      { id: '3', videoTitle: 'Viral Cat Video', claimant: 'FunnyPets', matchPercentage: 95, status: 'Blocked' },
    ]);

    return () => unsubscribeAssets();
  }, []);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsCreatingAsset(true);

    try {
      let fileUrl = '';
      if (assetFile) {
        const storageRef = ref(storage, `content_assets/${auth.currentUser.uid}/${Date.now()}_${assetFile.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, assetFile);
        fileUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, 'content_id_assets'), {
        ...newAsset,
        fileUrl,
        ownerUid: auth.currentUser.uid,
        status: 'Processing',
        createdAt: serverTimestamp()
      });

      setNewAsset({ title: '', type: 'Audio', policy: 'Monetize', artist: '', isrc: '', videoLink: '', videoContentId: '' });
      setAssetFile(null);
      alert('Asset created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create asset');
    } finally {
      setIsCreatingAsset(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-8 bg-black min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Content Library</h2>

        {/* --- Add New Asset Form --- */}
        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-2xl shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-6">Add New Asset</h3>
          <form onSubmit={handleCreateAsset} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Asset Title" className="bg-black border border-white/10 p-3 rounded-lg text-white" value={newAsset.title} onChange={(e) => setNewAsset({...newAsset, title: e.target.value})} required/>
            <select className="bg-black border border-white/10 p-3 rounded-lg text-white" value={newAsset.type} onChange={(e) => setNewAsset({...newAsset, type: e.target.value as any})}><option>Audio</option><option>Video</option></select>
            <select className="bg-black border border-white/10 p-3 rounded-lg text-white" value={newAsset.policy} onChange={(e) => setNewAsset({...newAsset, policy: e.target.value as any})}><option>Monetize</option><option>Block</option><option>Track</option></select>
            <input type="text" placeholder="Artist" className="bg-black border border-white/10 p-3 rounded-lg text-white" value={newAsset.artist} onChange={(e) => setNewAsset({...newAsset, artist: e.target.value})} required/>
            <input type="text" placeholder="ISRC" className="bg-black border border-white/10 p-3 rounded-lg text-white" value={newAsset.isrc} onChange={(e) => setNewAsset({...newAsset, isrc: e.target.value})} />
            <input type="text" placeholder="Video Content ID (Optional)" className="bg-black border border-white/10 p-3 rounded-lg text-white" value={newAsset.videoContentId} onChange={(e) => setNewAsset({...newAsset, videoContentId: e.target.value})} />
            <input type="text" placeholder="Video Link (Optional)" className="bg-black border border-white/10 p-3 rounded-lg text-white" value={newAsset.videoLink} onChange={(e) => setNewAsset({...newAsset, videoLink: e.target.value})} />
            <input type="file" onChange={(e) => setAssetFile(e.target.files?.[0] || null)} className="col-span-2 text-sm text-[#A1A1A1] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#D4AF37] file:text-black hover:file:bg-[#D4AF37]/90" />
            <button disabled={isCreatingAsset} className="col-span-2 bg-[#39FF14] text-black p-3 rounded-lg font-bold hover:bg-[#39FF14]/90 flex items-center justify-center gap-2">
              {isCreatingAsset && <Loader2 className="animate-spin" size={18}/>}
              Create Asset
            </button>
          </form>
        </div>

        {/* --- Claims Management --- */}
        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-6">Detected Claim Matches</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#A1A1A1] text-xs uppercase tracking-wider border-b border-white/10">
                <th className="pb-4">Video Title</th>
                <th className="pb-4">Claimant</th>
                <th className="pb-4">Match %</th>
                <th className="pb-4">Status</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {claims.map((claim) => (
                <>
                  <tr key={claim.id} className={`hover:bg-white/5 transition-colors ${claim.matchPercentage > 90 ? 'shadow-[0_0_20px_rgba(220,38,38,0.4)] border-l-4 border-red-600 bg-red-950/20' : ''}`}>
                    <td className="py-4 font-medium">{claim.videoTitle}</td>
                    <td className="py-4 text-[#A1A1A1]">{claim.claimant}</td>
                    <td className="py-4 font-mono text-[#39FF14]">{claim.matchPercentage}%</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${claim.status === 'Blocked' ? 'bg-red-500/10 text-red-500' : 'bg-[#39FF14]/10 text-[#39FF14]'}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => setExpandedClaim(expandedClaim === claim.id ? null : claim.id)}>
                        {expandedClaim === claim.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </td>
                  </tr>
                  {expandedClaim === claim.id && (
                    <tr className="bg-[#0A0A0A]">
                      <td colSpan={5} className="p-4 text-sm text-[#A1A1A1]">
                        <div className="flex items-center gap-2 mb-2 font-semibold text-white">
                          <AlertTriangle size={16} className="text-[#D4AF37]" />
                          Claim Details
                        </div>
                        Detailed matching information and manual review options for claim {claim.id}...
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Asset Uploader & List --- */}
        <div 
          className="border-2 border-dashed border-[#D4AF37]/50 rounded-2xl p-10 mb-8 text-center bg-[#0A0A0A]/50 hover:border-[#D4AF37] transition-all cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
        >
          <Upload className="mx-auto mb-4 text-[#D4AF37]" size={40} />
          <p className="text-lg font-semibold">Drag & drop files here</p>
          <p className="text-[#A1A1A1] text-sm">Or click to browse (Audio / Video)</p>
        </div>

        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Registered Content</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input type="text" placeholder="Search assets..." className="pl-10 pr-4 py-2 bg-black border border-white/10 rounded-lg text-sm" />
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#A1A1A1] text-xs uppercase tracking-wider border-b border-white/10">
                <th className="pb-4">Asset</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium">{asset.title}</td>
                  <td className="py-4 text-[#A1A1A1] flex items-center gap-2">
                    {asset.type === 'Audio' ? <FileAudio size={16} /> : <FileVideo size={16} />}
                    {asset.type}
                  </td>
                  <td className="py-4">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${
                      asset.status === 'Active' ? 'bg-[#39FF14]/10 text-[#39FF14]' : 
                      asset.status === 'Processing' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {asset.status === 'Active' && <CheckCircle size={14} />}
                      {asset.status === 'Processing' && <Clock size={14} />}
                      {asset.status === 'Rejected' && <XCircle size={14} />}
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="h-8 w-24 bg-white/5 rounded-md flex items-center justify-center text-xs text-[#A1A1A1]">
                      {asset.type === 'Audio' ? 'Waveform' : 'Thumbnail'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
