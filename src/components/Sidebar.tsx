import { Home, PlaySquare, DollarSign, Users, Settings, BarChart3, Megaphone, ShieldAlert, Zap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="w-64 bg-[#0D0D0D] border-r border-[#262626] h-screen p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-10">
        <img 
          src="https://lh3.googleusercontent.com/p/AF1QipNzSxcM8hFfSmRRw18y1tUwgzrEJZ19mwfVdfwO=s1474-w768-h1474-rw" 
          alt="OrbitX Logo"
          className="w-8 h-8 rounded-lg object-cover"
          referrerPolicy="no-referrer"
        />
        <h1 className="text-xl font-bold text-white tracking-tight">OrbitX</h1>
      </div>

      <nav className="space-y-2 flex-1">
        {[
            { icon: Home, label: 'Dashboard', path: '/' },
            { icon: PlaySquare, label: 'YouTube Integration', path: '/youtube' },
            { icon: DollarSign, label: 'Earnings', path: '/earnings' },
            { icon: BarChart3, label: 'Analytics', path: '/analytics' },
            { icon: Megaphone, label: 'Brand Deals', path: '/deals' },
            { icon: ShieldAlert, label: 'Copyright', path: '/copyright' },
            { icon: Users, label: 'Team', path: '/team' },
            { icon: BookOpen, label: 'Education Hub', path: '/education' },
            { icon: Settings, label: 'Settings', path: '/settings' },
        ].map((item) => (
            <Link 
                key={item.label}
                to={item.path} 
                className="flex items-center gap-3 text-[#A1A1A1] hover:text-white hover:bg-[#1A1A1A] p-3 rounded-lg transition-all duration-200"
            >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
            </Link>
        ))}
      </nav>
    </div>
  );
}
