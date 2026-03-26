import { GoogleGenAI, Type } from "@google/genai";
import { AIStrategyResponse } from "../types";

export const generateContentStrategy = async (
  niche: string,
  recentTopic: string,
  channelName: string
): Promise<AIStrategyResponse | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined");
    // Return mock data if key is missing to keep the app functional
    return getMockStrategy(niche, recentTopic, channelName);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
      You are an expert YouTube content strategist for the OrbitX MCN Network.
      Analyze the following context and provide actionable advice.
      
      Channel Name: ${channelName}
      Niche: ${niche}
      Recent Focus Topic: ${recentTopic}

      Provide:
      1. 5 Viral Title Ideas suitable for this niche.
      2. A brief paragraph on how to optimize the video description for SEO.
      3. 10 high-traffic tags/keywords.
      4. 3 "Content Gaps" or underserved topics in this niche right now.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleIdeas: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            descriptionOptimization: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            contentGaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIStrategyResponse;

  } catch (error: any) {
    if (error && (error.name === 'AbortError' || error.message?.toLowerCase().includes('aborted') || error.message?.includes('The user aborted a request'))) {
      console.debug("OrbitX MCN: Gemini request aborted.");
      return null;
    } else {
      console.warn("OrbitX MCN: Gemini API error. Returning mock strategy.", error);
      return getMockStrategy(niche, recentTopic, channelName);
    }
  }
};

const getMockStrategy = (niche: string, recentTopic: string, channelName: string): AIStrategyResponse => {
  return {
    titleIdeas: [
      `Why ${recentTopic} is Changing the Industry Forever`,
      `I Tried ${recentTopic} for 7 Days (Shocking Results)`,
      `The Ultimate Guide to ${niche} in 2024`,
      `Stop Doing This With ${recentTopic}!`,
      `${channelName} Special: The Truth About ${recentTopic}`
    ],
    descriptionOptimization: `To optimize for "${recentTopic}", ensure your first two lines explicitly state the value proposition. Include the phrase "${recentTopic}" naturally in the first sentence. Add timestamps for key moments (Intro, ${recentTopic} Explained, Final Verdict) to improve retention. Use bullet points for key takeaways.`,
    tags: [
      recentTopic, niche, "2024 trends", "tutorial", "review", 
      "how to", "best tips", "viral", `${niche} guide`, "explained"
    ],
    contentGaps: [
      `Advanced tutorials for ${recentTopic} that go beyond basics`,
      `Budget-friendly alternatives in the ${niche} space`,
      `Real-world case studies involving ${recentTopic}`
    ]
  };
};
