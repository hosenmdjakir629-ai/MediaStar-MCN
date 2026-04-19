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
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-black border border-[#D4AF37] text-[#D4AF37] rounded-lg font-semibold hover:bg-[#D4AF37]/10 transition-all text-sm">Manage Policy</button>
          <button className="px-5 py-2.5 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#D4AF37]/90 transition-all text-sm flex items-center gap-2">
            <Plus size={18} /> Upload Asset
          </button>
        </div>
      </div>
      
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm">
              <h3 className="text-[#A1A1A1] text-xs uppercase tracking-wide font-medium mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-[#39FF14]">$12,450.00</p>
            </div>
            <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm">
              <h3 className="text-[#A1A1A1] text-xs uppercase tracking-wide font-medium mb-2">Active Claims</h3>
              <p className="text-3xl font-bold text-[#D4AF37]">42</p>
            </div>
            <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm">
              <h3 className="text-[#A1A1A1] text-xs uppercase tracking-wide font-medium mb-2">Resolved Claims</h3>
              <p className="text-3xl font-bold text-white">1,280</p>
            </div>
            <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm">
              <h3 className="text-[#A1A1A1] text-xs uppercase tracking-wide font-medium mb-2">Views</h3>
              <p className="text-3xl font-bold text-white">{stats?.statistics?.viewCount || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2 backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-6 rounded-2xl shadow-sm">
                <h3 className="text-white font-semibold mb-6 flex items-center">
                   <span className="w-1.5 h-6 bg-[#39FF14] rounded-full mr-3"></span>
                   Content Usage Trends
                </h3>
                <ChartCard title="" />
            </div>
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 shadow-inner backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-[#D4AF37] rounded-full mr-3"></span>
                  Recent Videos
                </h3>
                <div className="space-y-4">
                  {videos.map((video: any) => (
                    <div key={video.id.videoId} className="flex items-center gap-4 hover:bg-[#1A1A1A] p-2 rounded-lg transition-colors">
                      <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className="w-16 h-12 rounded-lg object-cover" />
                      <p className="text-[#A1A1A1] text-sm truncate font-medium">{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-[#050505]/50 backdrop-blur-sm p-6">
            <RegionAnalytics />
          </div>
        </>
      )}
    </div>
  );
}
