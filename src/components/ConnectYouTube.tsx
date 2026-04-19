import { useState, useEffect } from "react";
import api from "../lib/api";

import { useState, useEffect } from "react";
import api from "../lib/api";
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react";

export default function ConnectYouTube() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [channelInfo, setChannelInfo] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await api.get('/channels/my');
      if (res.data && res.data.length > 0) {
        setIsConnected(true);
        setChannelInfo(res.data[0]);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
        await api.post('/youtube/sync');
        await checkConnection();
        alert('Sync completed successfully');
    } catch (error) {
        console.error("Error syncing:", error);
        alert('Failed to sync channel data');
    } finally {
        setIsSyncing(false);
    }
  }

  const handleConnect = async () => {
    try {
      const response = await api.get('/youtube/auth/url');
      const { url } = response.data;
      const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          authWindow?.close();
          window.removeEventListener('message', handleMessage);
          try {
            await api.post('/youtube/auth/save', { tokens: event.data.tokens });
            setIsConnected(true);
            window.location.reload();
          } catch (error) {
            console.error("Error saving channel info:", error);
          }
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error("Error connecting YouTube:", error);
    }
  };

  if (isLoading) return <div className="text-[#A1A1A1]">Checking connection...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${isConnected ? 'bg-[#39FF14]/10 text-[#39FF14]' : 'bg-red-500/10 text-red-500'}`}>
          {isConnected ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {isConnected ? 'Connected' : 'Not Connected'}
        </div>
        {!isConnected && (
          <button onClick={handleConnect} className="bg-[#D4AF37] text-black px-6 py-2 rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition-all">
            Connect YouTube Channel
          </button>
        )}
      </div>
      
      {isConnected && channelInfo && (
        <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl flex justify-between items-center">
            <div className="flex items-center gap-4">
                <img src={channelInfo.snippet.thumbnails.default.url} alt="Channel" className="w-16 h-16 rounded-2xl"/>
                <div>
                  <p className="font-bold text-white text-lg">{channelInfo.snippet.title}</p>
                  <p className="text-[#A1A1A1] text-sm">{parseInt(channelInfo.statistics.subscriberCount).toLocaleString()} Subscribers</p>
                </div>
            </div>
          <button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      )}
    </div>
  );
}
