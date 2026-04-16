import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import MainLayout from "../layout/MainLayout";
import { useCurrency } from "../contexts/CurrencyContext";

export default function Earnings() {
  const { convert } = useCurrency();
  const [revenueStreams] = useState([
    { name: "Ad Revenue", amount: 250000 },
    { name: "Brand Deals", amount: 150000 },
    { name: "Affiliate Earnings", amount: 50200 },
  ]);

  const totalRevenue = revenueStreams.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Advanced Monetization</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="Total Revenue" value={convert(totalRevenue)} trend="+15%" />
          <StatCard title="Pending" value={convert(12400)} trend="+2%" />
          <StatCard title="Withdrawn" value={convert(380000)} trend="+10%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-800 font-semibold mb-4">Revenue Streams</h3>
            {revenueStreams.map(stream => (
              <div key={stream.name} className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{stream.name}</span>
                <span className="font-semibold text-slate-900">{convert(stream.amount)}</span>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-800 font-semibold mb-4">Revenue Prediction</h3>
            <p className="text-slate-600">AI-predicted next month revenue: <span className="font-bold text-indigo-600">{convert(485000)}</span></p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-slate-800 font-semibold mb-4">Actions</h3>
          <div className="flex gap-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Generate Invoice</button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Process Payout (bKash/Nagad)</button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-slate-800 font-semibold mb-4">Monthly Earnings</h3>
          <ChartCard title="Revenue Chart" />
        </div>
      </div>
    </MainLayout>
  );
}
