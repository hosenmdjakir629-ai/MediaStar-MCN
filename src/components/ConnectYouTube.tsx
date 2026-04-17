import { useState, useEffect } from "react";
import api from "../lib/api";

export default function ConnectYouTube() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await api.get('/channels/my');
      setIsConnected(res.data && res.data.length > 0);
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await api.get('/youtube/auth/url');
      const { url } = response.data;
      
      const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          authWindow?.close();
          window.removeEventListener('message', handleMessage);
          setIsConnected(true);
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error("Error connecting YouTube:", error);
    }
  };

  if (isLoading) return <div>Checking connection...</div>;

  return (
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
  );
}
