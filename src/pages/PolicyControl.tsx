import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { ToggleLeft, ToggleRight, Database, ShieldAlert, Zap } from "lucide-react";

export default function PolicyControl() {
  const [rules, setRules] = useState([
    { id: 1, name: "High Confidence Audio Match", threshold: 80, policy: "Block", active: true },
    { id: 2, name: "Low Confidence Video Match", threshold: 50, policy: "Track", active: true },
    { id: 3, name: "Public Domain Assets", threshold: 0, policy: "Monetize", active: false },
  ]);

  return (
    <MainLayout>
      <div className="p-8 bg-black min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Policy Control Panel</h2>
        
        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="text-[#39FF14]" />
            <h3 className="text-xl font-semibold">Rule-Based Automation</h3>
          </div>
          
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-[#050505] border border-white/5 rounded-xl hover:border-[#D4AF37]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${rule.active ? 'bg-[#39FF14]/10' : 'bg-gray-800'}`}>
                    <ShieldAlert size={20} className={rule.active ? 'text-[#39FF14]' : 'text-gray-500'} />
                  </div>
                  <div>
                    <p className="font-semibold">{rule.name}</p>
                    <p className="text-xs text-[#A1A1A1]">If match confidence {'>'} {rule.threshold}% THEN {rule.policy}</p>
                  </div>
                </div>
                <button onClick={() => setRules(rules.map(r => r.id === rule.id ? {...r, active: !r.active} : r))}>
                  {rule.active ? <ToggleRight size={32} className="text-[#39FF14]" /> : <ToggleLeft size={32} className="text-gray-600" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
