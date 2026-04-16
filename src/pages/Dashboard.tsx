import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { RealTimeDashboard } from "@/components/RealTimeDashboard";
import { RegionAnalytics } from "@/components/RegionAnalytics";
import api from "@/lib/api";

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, videosRes] = await Promise.all([
          api.get('/youtube/stats'),
          api.get('/youtube/videos')
        ]);
        setStats(statsRes.data.data);
        setVideos(videosRes.data);
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-[#0D0D0D] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Home</h1>
      
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <>
          <div className="mb-6">
            <RealTimeDashboard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Subscribers" value={stats?.statistics?.subscriberCount || 'N/A'} trend="+12%" />
            <StatCard title="Views" value={stats?.statistics?.viewCount || 'N/A'} trend="+8%" />
            <StatCard title="Videos" value={stats?.statistics?.videoCount || 'N/A'} trend="+5%" />
            <StatCard title="Watch Time" value="2.1M hrs" trend="+5%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
                <ChartCard title="Growth Analytics" />
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 shadow-sm">
                <h3 className="text-white font-semibold mb-4">Recent Videos</h3>
                <div className="space-y-4">
                  {videos.map((video: any) => (
                    <div key={video.id.videoId} className="flex items-center gap-3">
                      <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className="w-16 h-12 rounded" />
                      <p className="text-[#A1A1A1] text-sm truncate">{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          <div className="mb-6">
            <RegionAnalytics />
          </div>
        </>
      )}
    </div>
  );
}
