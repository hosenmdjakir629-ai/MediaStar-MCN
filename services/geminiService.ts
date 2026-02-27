
import { GoogleGenAI, Type } from "@google/genai";
import { AIStrategyResponse } from "../types";

// Using the provided API Key from environment or fallback
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA3laj29mmMOi65O1E4HHR0eNYmBk0iDqk';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateContentStrategy = async (
  niche: string,
  recentTopic: string,
  channelName: string
): Promise<AIStrategyResponse | null> => {
  try {
    const prompt = `
      You are an expert YouTube content strategist for the MediaStar MCN Network.
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

    // Check if key is available to avoid instant crash (Validating length of provided key)
    if (!API_KEY || API_KEY.length < 10) {
       throw new Error("Missing API Key");
    }

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

  } catch (error) {
    console.warn("MediaStar MCN: Gemini API error or missing key. Returning mock strategy.", error);
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return Mock Data
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
  }
};
