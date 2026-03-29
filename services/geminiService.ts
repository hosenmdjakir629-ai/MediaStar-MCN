import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The platform automatically handles the API key via process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Generates content using the Gemini model.
 * @param prompt The prompt to send to the model.
 * @returns The generated text response.
 */
export async function generateContent(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content from Gemini.");
  }
}
