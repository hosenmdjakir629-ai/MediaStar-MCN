import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { generateSEOContent } from "../services/seoService";

export default function SEOTools() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (type: 'title' | 'description' | 'tags') => {
    setLoading(true);
    try {
      const data = await generateSEOContent(topic, type);
      setResult(data);
    } catch (error) {
      console.error("Error generating SEO content:", error);
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">SEO & Growth Tools</h2>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <input 
          type="text" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="Enter video topic..." 
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex gap-2">
          <button onClick={() => handleGenerate('title')} className="bg-blue-600 text-white px-4 py-2 rounded">Generate Titles</button>
          <button onClick={() => handleGenerate('description')} className="bg-blue-600 text-white px-4 py-2 rounded">Generate Description</button>
          <button onClick={() => handleGenerate('tags')} className="bg-blue-600 text-white px-4 py-2 rounded">Generate Tags</button>
        </div>
      </div>
      {loading && <p>Generating...</p>}
      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </MainLayout>
  );
}
