import React from "react";
import { BarChart3, Users, Eye, DollarSign } from "lucide-react";
import { StatCard } from "../components/StatCard";

export function Analytics() {
  // Placeholder data
  const metrics = [
    { title: "Total Views", value: "1.2M", icon: Eye, trend: "+15%" },
    { title: "Total Subscribers", value: "45.2K", icon: Users, trend: "+5%" },
    { title: "Total Revenue", value: "$8,450", icon: DollarSign, trend: "+12%" },
  ];

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
