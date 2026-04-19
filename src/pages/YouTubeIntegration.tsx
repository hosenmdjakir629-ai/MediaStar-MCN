import MainLayout from "../layout/MainLayout";
import ConnectYouTube from "../components/ConnectYouTube";

export default function YouTubeIntegration() {
  return (
    <MainLayout>
      <div className="p-8 bg-black min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Integration Hub</h2>
        <div className="backdrop-blur-md bg-[#0A0A0A]/50 border border-white/10 p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Channel Sync Dashboard</h3>
          <p className="mb-8 text-[#A1A1A1]">
            Connect your YouTube channel to enable synchronization for analytics, video performance tracking, and Content ID protections.
          </p>
          <ConnectYouTube />
        </div>
      </div>
    </MainLayout>
  );
}
