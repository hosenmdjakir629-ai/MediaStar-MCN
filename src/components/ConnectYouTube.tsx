import { useState, useEffect } from "react";
import api from "../lib/api";

export default function ConnectYouTube() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [channelInfo, setChannelInfo] = useState<any>(null);

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

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
        await api.post('/youtube/sync');
        await checkConnection(); // Refresh data after sync
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
            // Save tokens/data returned from callback
            await api.post('/youtube/auth/save', { tokens: event.data.tokens });
            setIsConnected(true);
            window.location.reload(); // Refresh to fetch updated channel info
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

  if (isLoading) return <div>Checking connection...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {isConnected ? 'Connected' : 'Not Connected'}
        </div>
        {!isConnected && (
          <button onClick={handleConnect} className="bg-red-600 text-white px-4 py-2 rounded">
            Connect YouTube Channel
          </button>
        )}
      </div>
      {isConnected && channelInfo && (
        <div className="border border-slate-200 p-4 rounded-lg">
          <p><strong>Channel:</strong> {channelInfo.snippet.title}</p>
          <p><strong>Subscribers:</strong> {parseInt(channelInfo.statistics.subscriberCount).toLocaleString()}</p>
          <button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 disabled:bg-blue-400"
          >
            {isSyncing ? 'Syncing...' : 'Sync Channel Data'}
          </button>
        </div>
      )}
    </div>
  );
}
