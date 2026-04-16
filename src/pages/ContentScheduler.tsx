import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { Calendar as CalendarIcon, Clock, Plus, Video, RefreshCw, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

type ScheduledPost = {
  id: string;
  title: string;
  scheduledAt: string;
  status: 'Scheduled' | 'Published' | 'Failed';
  type: 'YouTube' | 'Facebook' | 'Auto-Repost';
};

export default function ContentScheduler() {
  const [posts, setPosts] = useState<ScheduledPost[]>([
    { id: '1', title: 'My Awesome Vlog #42', scheduledAt: '2026-04-16T10:00:00Z', status: 'Scheduled', type: 'YouTube' },
    { id: '2', title: 'Gaming Highlights - Week 15', scheduledAt: '2026-04-17T15:30:00Z', status: 'Scheduled', type: 'YouTube' },
    { id: '3', title: 'Shorts: Best Moments', scheduledAt: '2026-04-15T08:00:00Z', status: 'Published', type: 'Auto-Repost' },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Failed': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Content Scheduler PRO</h1>
            <p className="text-slate-500">Plan and automate your content distribution</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
              <button 
                onClick={() => setView('weekly')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'weekly' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setView('monthly')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Monthly
              </button>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Schedule Post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg border border-slate-200">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg border border-slate-200">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarIcon className="w-4 h-4" />
                  Today is April 15, 2026
                </div>
              </div>

              {/* Weekly Grid */}
              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-slate-50 py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="bg-white min-h-[120px] p-2 group hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-medium text-slate-400">{13 + i}</span>
                    {i === 2 && (
                      <div className="mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <p className="text-[10px] font-bold text-indigo-700 truncate">Vlog #42</p>
                        <p className="text-[8px] text-indigo-500">10:00 AM</p>
                      </div>
                    )}
                    {i === 4 && (
                      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <p className="text-[10px] font-bold text-emerald-700 truncate">Gaming Highlights</p>
                        <p className="text-[8px] text-emerald-500">03:30 PM</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto Repost System */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-indigo-600" />
                    Auto Repost System
                  </h3>
                  <p className="text-sm text-slate-500">Automatically cross-post your content</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <p className="text-sm font-bold text-slate-900 mb-1">YouTube → Facebook</p>
                  <p className="text-xs text-slate-500 mb-3">Repost new videos to Facebook Page</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Delay: 2 hours</span>
                    <button className="text-xs text-indigo-600 font-bold">Configure</button>
                  </div>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <p className="text-sm font-bold text-slate-900 mb-1">YouTube → Instagram Reels</p>
                  <p className="text-xs text-slate-500 mb-3">Extract and repost Shorts</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Delay: Instant</span>
                    <button className="text-xs text-indigo-600 font-bold">Configure</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Queue */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Upcoming Queue
              </h3>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{post.type}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{post.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(post.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                View Full Queue
              </button>
            </div>

            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Pro Scheduler Tips
              </h3>
              <p className="text-sm text-indigo-100 mb-4">
                Scheduling content during peak hours can increase engagement by up to 40%.
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all">
                Analyze Best Times
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
