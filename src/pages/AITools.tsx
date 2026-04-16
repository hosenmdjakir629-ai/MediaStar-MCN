import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { generateVideoIdeas, suggestThumbnail, generateVideoTitle, generateDescriptionAndTags, getViralScore, analyzeSEO, suggestBestUploadTime, compareCompetitors } from "../services/aiService";

export default function AITools() {
  const [topic, setTopic] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [niche, setNiche] = useState("");
  const [channelName, setChannelName] = useState("");
  const [competitorName, setCompetitorName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'ideas' | 'thumbnail' | 'title' | 'descriptionTags' | 'viral' | 'seo' | 'uploadTime' | 'competitor') => {
    setLoading(true);
    try {
      let data;
      if (action === 'ideas') data = await generateVideoIdeas(topic);
      else if (action === 'thumbnail') data = await suggestThumbnail(topic);
      else if (action === 'title') data = await generateVideoTitle(topic);
      else if (action === 'descriptionTags') data = await generateDescriptionAndTags(topic);
      else if (action === 'viral') data = await getViralScore(videoTitle, description);
      else if (action === 'seo') data = await analyzeSEO(videoTitle, description, tags.split(","));
      else if (action === 'uploadTime') data = await suggestBestUploadTime(niche);
      else if (action === 'competitor') data = await compareCompetitors(channelName, competitorName);
      setResult(data);
    } catch (error) {
      console.error("Error calling AI service:", error);
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">Advanced AI Growth Tools</h2>
      <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic or channel niche..." className="w-full p-2 border rounded" />
        <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video Title..." className="w-full p-2 border rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Video Description..." className="w-full p-2 border rounded" />
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)..." className="w-full p-2 border rounded" />
        <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche..." className="w-full p-2 border rounded" />
        <div className="flex gap-2">
          <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Your Channel..." className="w-full p-2 border rounded" />
          <input type="text" value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder="Competitor Channel..." className="w-full p-2 border rounded" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => handleAction('ideas')} className="bg-purple-600 text-white px-4 py-2 rounded">Video Ideas</button>
          <button onClick={() => handleAction('thumbnail')} className="bg-purple-600 text-white px-4 py-2 rounded">Thumbnail Ideas</button>
          <button onClick={() => handleAction('title')} className="bg-green-600 text-white px-4 py-2 rounded">SEO Titles</button>
          <button onClick={() => handleAction('descriptionTags')} className="bg-green-600 text-white px-4 py-2 rounded">Desc & Tags</button>
          <button onClick={() => handleAction('viral')} className="bg-red-600 text-white px-4 py-2 rounded">🔥 Viral Score</button>
          <button onClick={() => handleAction('seo')} className="bg-blue-600 text-white px-4 py-2 rounded">📊 SEO Score</button>
          <button onClick={() => handleAction('uploadTime')} className="bg-amber-600 text-white px-4 py-2 rounded">⏰ Best Upload Time</button>
          <button onClick={() => handleAction('competitor')} className="bg-indigo-600 text-white px-4 py-2 rounded">🏆 Competitor Analysis</button>
        </div>
      </div>
      {loading && <p>Processing...</p>}
      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">AI Analysis:</h3>
          <pre className="whitespace-pre-wrap">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </MainLayout>
  );
}
