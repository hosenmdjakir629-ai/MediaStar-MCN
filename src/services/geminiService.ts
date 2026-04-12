import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateVideoIdeas = async (niche: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 viral video ideas for a YouTube channel in the ${niche} niche. For each idea, provide a catchy title and a brief description of the video content.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const optimizeTitle = async (currentTitle: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Optimize this YouTube video title for higher CTR: "${currentTitle}". Provide 3 alternative titles that are more engaging and SEO-friendly.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const suggestThumbnails = async (videoTitle: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 3 thumbnail concepts for a YouTube video titled: "${videoTitle}". Describe the visual elements, text overlays, and color schemes for each concept.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            visuals: { type: Type.STRING },
            text: { type: Type.STRING },
            colors: { type: Type.STRING }
          },
          required: ["concept", "visuals", "text", "colors"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};
