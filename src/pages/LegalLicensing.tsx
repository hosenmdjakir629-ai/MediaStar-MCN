import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { FileText, PenTool, ShieldCheck, FileSignature } from "lucide-react";

export default function LegalLicensing() {
  const [contracts] = useState([
    { id: 1, title: "Creator Agreement - John Vlogs", status: "Signed", date: "2026-04-10" },
    { id: 2, title: "Brand Deal - TechReviews", status: "Pending Signature", date: "2026-04-14" },
  ]);

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Legal & Licensing</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><FileText /></div>
            <div>
              <h3 className="font-semibold">Auto Contract</h3>
              <p className="text-xs text-slate-500">Generate new agreements</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><PenTool /></div>
            <div>
              <h3 className="font-semibold">Digital Sign</h3>
              <p className="text-xs text-slate-500">Manage signatures</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><ShieldCheck /></div>
            <div>
              <h3 className="font-semibold">License Panel</h3>
              <p className="text-xs text-slate-500">Manage active licenses</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Contracts</h2>
          <div className="space-y-4">
            {contracts.map(contract => (
              <div key={contract.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSignature className="text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{contract.title}</p>
                    <p className="text-xs text-slate-500">{contract.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${contract.status === 'Signed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {contract.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
