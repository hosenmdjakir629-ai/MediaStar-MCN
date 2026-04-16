import { GoogleGenAI, Type } from "@google/genai";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateSEOContent = async (topic: string, type: 'title' | 'description' | 'tags') => {
  const schema = type === 'tags' 
    ? { type: Type.ARRAY, items: { type: Type.STRING } }
    : { type: Type.STRING };

  const prompt = type === 'title' 
    ? `Generate 5 catchy, SEO-friendly YouTube video titles for: ${topic}`
    : type === 'description'
    ? `Generate a compelling, SEO-optimized YouTube video description for: ${topic}`
    : `Generate 10 relevant, high-traffic YouTube tags for: ${topic}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text || "null");
};
