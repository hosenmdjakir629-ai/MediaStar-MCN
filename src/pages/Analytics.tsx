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
    <div className="p-6 bg-[#0D0D0D] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 className="w-8 h-8 text-indigo-500" />
        Analytics Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-[#141414] p-6 rounded-xl border border-[#262626]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#A1A1A1]">{metric.title}</span>
              <metric.icon className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="text-3xl font-bold mb-2">{metric.value}</div>
            <div className="text-sm text-emerald-500">{metric.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
