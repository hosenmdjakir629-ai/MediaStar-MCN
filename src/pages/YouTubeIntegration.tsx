import MainLayout from "../layout/MainLayout";
import ConnectYouTube from "../components/ConnectYouTube";

export default function YouTubeIntegration() {
  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">YouTube Integration</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Connect Your Channel</h3>
        <p className="mb-4 text-slate-600">
          Connect your YouTube channel to enable analytics, video performance syncing, and Content ID management.
        </p>
        <ConnectYouTube />
      </div>
    </MainLayout>
  );
}
