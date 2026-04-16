import React, { useState } from 'react';
import MainLayout from '../layout/MainLayout';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileText, 
  Cloud, 
  RefreshCw, 
  History, 
  ShieldCheck, 
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Parser } from 'json2csv';

export default function BackupExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState('2026-04-14 10:30 AM');
  const [backupHistory] = useState([
    { id: 1, date: '2026-04-14 10:30 AM', size: '12.4 MB', status: 'Success', type: 'Auto' },
    { id: 2, date: '2026-04-13 10:30 AM', size: '12.1 MB', status: 'Success', type: 'Auto' },
    { id: 3, date: '2026-04-12 02:15 PM', size: '11.8 MB', status: 'Success', type: 'Manual' },
  ]);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      const doc = new jsPDF() as any;
      doc.setFontSize(20);
      doc.text('OrbitX Network - Channel Analytics Report', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      const tableData = [
        ['Video Title', 'Views', 'Watch Time', 'Revenue'],
        ['How to Grow on YouTube', '12,450', '450h', '$125.40'],
        ['OrbitX Network Intro', '8,200', '320h', '$82.00'],
        ['Creator Tips 2026', '15,100', '610h', '$151.00'],
      ];

      autoTable(doc, {
        startY: 40,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }
      });

      doc.save('OrbitX_Analytics_Report.pdf');
      setIsExporting(false);
    }, 1500);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const data = [
        { title: 'How to Grow on YouTube', views: 12450, watchTime: '450h', revenue: 125.40 },
        { title: 'OrbitX Network Intro', views: 8200, watchTime: '320h', revenue: 82.00 },
        { title: 'Creator Tips 2026', views: 15100, watchTime: '610h', revenue: 151.00 },
      ];
      const parser = new Parser();
      const csv = parser.parse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'OrbitX_Analytics_Data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1000);
  };

  const handleCloudBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setLastBackup(new Date().toLocaleString());
      setIsBackingUp(false);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Backup & Export</h1>
          <p className="text-slate-500 mt-1">Export your data and manage secure cloud backups.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Export Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-indigo-600" />
                Export Reports
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-indigo-200 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Analytics PDF Report</h4>
                  <p className="text-xs text-slate-500 mb-6">A visual summary of your channel performance, earnings, and growth metrics.</p>
                  <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                  </button>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-emerald-200 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Raw Data (CSV)</h4>
                  <p className="text-xs text-slate-500 mb-6">Detailed spreadsheet containing all video-level analytics and transaction history.</p>
                  <button 
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                    {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download CSV
                  </button>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-amber-200 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <FileJson className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Full Channel Export</h4>
                  <p className="text-xs text-slate-500 mb-6">Complete export of your profile, linked channels, and contract details in JSON format.</p>
                  <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center border-dashed">
                  <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center text-slate-300 mb-4">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-400 mb-1">Custom Report</h4>
                  <p className="text-[10px] text-slate-400">Coming Soon: Build your own custom data reports.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <History className="w-6 h-6 text-indigo-600" />
                Backup History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-4">Date & Time</th>
                      <th className="pb-4">Size</th>
                      <th className="pb-4">Type</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {backupHistory.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                              <Database className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{item.date}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-500">{item.size}</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            item.type === 'Auto' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.status}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Cloud Backup Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-indigo-600" />
                Cloud Backup
              </h3>
              
              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 mb-6 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-indigo-900 mb-1">Secure Storage</h4>
                <p className="text-xs text-indigo-600 leading-relaxed">Your data is encrypted and backed up to our secure cloud servers daily.</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Last Backup</span>
                  <span className="text-slate-900 font-bold">{lastBackup}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Storage Used</span>
                  <span className="text-slate-900 font-bold">45.2 MB / 500 MB</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[9%] rounded-full"></div>
                </div>
              </div>

              <button 
                onClick={handleCloudBackup}
                disabled={isBackingUp}
                className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isBackingUp ? 'Backing up...' : 'Backup Now'}
              </button>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <AlertCircle className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">Data Retention</h3>
              <p className="text-sm text-slate-400 mb-6 relative z-10 leading-relaxed">
                We keep your backup history for up to 30 days. You can download any previous version from the history panel.
              </p>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold relative z-10 cursor-pointer hover:text-indigo-300 transition-colors">
                Read Privacy Policy
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Auto-Backup</h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-700">Daily Sync</span>
                </div>
                <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
