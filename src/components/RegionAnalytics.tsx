import { useRegion } from "../contexts/RegionContext";
import { Globe, TrendingUp, Users, MapPin } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";

const regionData = [
  { name: 'United States', value: 45, color: '#6366f1' },
  { name: 'United Kingdom', value: 15, color: '#8b5cf6' },
  { name: 'Bangladesh', value: 20, color: '#10b981' },
  { name: 'India', value: 12, color: '#f59e0b' },
  { name: 'Others', value: 8, color: '#94a3b8' },
];

export function RegionAnalytics() {
  const { region } = useRegion();

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Region-based Analytics</h3>
          <p className="text-sm text-[#A1A1A1]">Audience distribution by country</p>
        </div>
        <div className="p-2 bg-[#1A1A1A] rounded-lg border border-[#262626]">
          <Globe className="w-5 h-5 text-[#6366f1]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '12px', border: '1px solid #262626', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {regionData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-[#A1A1A1]">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">{item.value}%</span>
                <div className="w-24 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ backgroundColor: item.color, width: `${item.value}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#262626] grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#262626]">
          <div className="flex items-center gap-2 text-[#A1A1A1] text-xs mb-1">
            <MapPin className="w-3 h-3" />
            Top Region
          </div>
          <div className="text-lg font-bold text-white">United States</div>
        </div>
        <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#262626]">
          <div className="flex items-center gap-2 text-[#A1A1A1] text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            Growth Rate
          </div>
          <div className="text-lg font-bold text-[#10b981]">+24.5%</div>
        </div>
      </div>
    </div>
  );
}
