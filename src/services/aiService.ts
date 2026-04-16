import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateVideoIdeas = async (niche: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 viral video ideas for a YouTube channel in the ${niche} niche.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const predictGrowth = async (channelData: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Predict the growth for a channel with these stats: ${JSON.stringify(channelData)}. Provide a brief analysis and growth potential.`,
  });
  return response.text;
};

export const detectCopyrightRisk = async (videoContent: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this video content description for potential copyright risks: ${videoContent}. Provide a risk level (Low, Medium, High) and explanation.`,
  });
  return response.text;
};

export const suggestThumbnail = async (videoTopic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 3 thumbnail concepts for a YouTube video about: ${videoTopic}. Describe the visual elements, text, and composition.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const generateVideoTitle = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 SEO-optimized YouTube video titles for a video about: ${topic}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const generateDescriptionAndTags = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a compelling YouTube video description and 10 relevant tags for a video about: ${topic}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["description", "tags"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
};

export const getViralScore = async (videoTitle: string, description: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the viral potential of a YouTube video with title: "${videoTitle}" and description: "${description}". Provide a viral score out of 100 and a brief explanation.`,
  });
  return response.text;
};

export const analyzeSEO = async (title: string, description: string, tags: string[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the SEO for a YouTube video with title: "${title}", description: "${description}", and tags: ${tags.join(", ")}. Provide an SEO score out of 100 and suggestions for improvement.`,
  });
  return response.text;
};

export const suggestBestUploadTime = async (niche: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest the best time to upload a YouTube video for the ${niche} niche. Explain why.`,
  });
  return response.text;
};

export const compareCompetitors = async (channelName: string, competitorName: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare the YouTube channels "${channelName}" and "${competitorName}". Provide a comparison of their content strategy, engagement, and growth potential.`,
  });
  return response.text;
};
