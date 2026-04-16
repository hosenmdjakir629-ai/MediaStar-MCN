import { useState } from "react";

export default function EducationHub() {
  const [courses] = useState([
    { title: "YouTube Growth Masterclass", level: "Beginner", duration: "4h", progress: 100 },
    { title: "Advanced SEO & Analytics", level: "Advanced", duration: "6h", progress: 45 },
    { title: "Monetization Strategies", level: "Intermediate", duration: "3h", progress: 0 },
  ]);

  const tutorials = [
    { title: "Editing for Viral Retention", duration: "15m", category: "Editing" },
    { title: "Thumbnail Design Secrets", duration: "10m", category: "Design" },
    { title: "Scripting for High Engagement", duration: "20m", category: "Writing" },
  ];

  const blogTips = [
    { title: "5 Ways to Improve CTR", date: "2026-04-10" },
    { title: "Understanding Algorithm Changes", date: "2026-04-05" },
    { title: "Best Practices for Shorts", date: "2026-03-28" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Creator Education Hub</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">📚 Courses</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.title} className="p-4 border border-slate-100 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-slate-900">{course.title}</h3>
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">
                    {course.progress === 100 ? "Review" : course.progress > 0 ? "Continue" : "Start"}
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-2">{course.level} • {course.duration}</p>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">🎥 Premium Tutorials</h2>
          <div className="space-y-4">
            {tutorials.map((tutorial) => (
              <div key={tutorial.title} className="p-4 border border-slate-100 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-slate-800 font-medium block">{tutorial.title}</span>
                  <span className="text-xs text-slate-500">{tutorial.category}</span>
                </div>
                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{tutorial.duration}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">📝 Blog / Tips</h2>
          <div className="space-y-3">
            {blogTips.map(tip => (
              <div key={tip.title} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                <span className="text-slate-700">{tip.title}</span>
                <span className="text-xs text-slate-400">{tip.date}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">🎓 Certification System</h2>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <p className="text-indigo-900 font-medium">Certified YouTube Growth Expert</p>
            <p className="text-sm text-indigo-700 mt-1">Complete all masterclass courses to earn your certification.</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1 bg-white rounded-full h-3 border border-indigo-200">
                <div className="bg-indigo-600 h-3 rounded-full" style={{ width: "48%" }}></div>
              </div>
              <span className="text-sm font-bold text-indigo-900">48%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
