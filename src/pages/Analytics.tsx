import React, { useEffect, useState } from "react";
import { BarChart3, Users, Eye, DollarSign } from "lucide-react";
import api from "../lib/api";

export function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/youtube/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch YouTube stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateHealthScore = (stats: any) => {
    const views = parseInt(stats.statistics.viewCount);
    const subs = parseInt(stats.statistics.subscriberCount);
    const videos = parseInt(stats.statistics.videoCount);

    // Heuristic score (0-100)
    // 1. Engagement: Views/Subs ratio (rough engagement proxy)
    const engagementScore = Math.min((views / (subs + 1)) * 50, 40);
    // 2. Productivity: Videos/Time (proxy)
    const productivityScore = Math.min(videos / 2, 30);
    // 3. Growth: Subscriber volume (proxy)
    const growthScore = Math.min(subs / 1000, 30);

    const score = Math.round(engagementScore + productivityScore + growthScore);
    
    let explanation = "Your channel's health is calculated based on engagement (view-to-subscriber ratio), productivity (video output), and audience growth. ";
    if (score > 80) explanation += "Excellent performance!";
    else if (score > 50) explanation += "Solid growth, keep it up!";
    else explanation += "Consider engaging more with your community to boost your score.";

    return { score, explanation };
  };

  const metrics = stats ? [
    { title: "Total Views", value: parseInt(stats.statistics.viewCount).toLocaleString(), icon: Eye, trend: "+15%" },
    { title: "Total Subscribers", value: parseInt(stats.statistics.subscriberCount).toLocaleString(), icon: Users, trend: "+5%" },
    { title: "Total Revenue", value: "$8,450", icon: DollarSign, trend: "+12%" },
    { 
      title: "Channel Health Score", 
      value: `${calculateHealthScore(stats).score}/100`, 
      icon: BarChart3, 
      trend: calculateHealthScore(stats).explanation
    },
  ] : [];

  if (isLoading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-4 md:p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3 tracking-tight">
        <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
          <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
        </div>
        Analytics Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-5 md:p-6 rounded-xl md:rounded-2xl transition-all hover:bg-[#0A0A0A]/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm text-[#A1A1A1] font-medium tracking-wide uppercase">{metric.title}</span>
              <metric.icon className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{metric.value}</div>
            <div className={`text-xs md:text-sm ${metric.title === 'Channel Health Score' ? 'text-[#39FF14]' : 'text-[#39FF14]'}`}>
              {metric.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
