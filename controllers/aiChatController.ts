import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../config/db';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const chat = async (req: Request, res: Response) => {
  const { sessionId, message, role, systemInstruction } = req.body;
  const userId = (req as any).user.uid;

  if (!db) {
    return res.status(500).json({ error: 'Firestore not initialized' });
  }

  try {
    const sessionRef = doc(db as Firestore, 'ai_chat_sessions', sessionId || `session_${userId}_${Date.now()}`);
    const sessionSnap = await getDoc(sessionRef);

    let messages: any[] = [];
    if (sessionSnap.exists()) {
      messages = sessionSnap.data().messages;
    } else {
      await setDoc(sessionRef, { userId, createdAt: new Date(), messages: [] });
    }

    const modelName = role === 'complex' ? 'gemini-3.1-pro-preview' : (role === 'fast' ? 'gemini-3.1-flash-lite-preview' : 'gemini-3-flash-preview');

    const result = await ai.models.generateContent({
      model: modelName,
      contents: message,
      config: {
        systemInstruction
      }
    });

    const responseText = result.text || '';

    const newMessages = [...messages, { role: 'user', content: message }, { role: 'model', content: responseText }];
    await updateDoc(sessionRef, { messages: newMessages });

    res.json({ sessionId: sessionRef.id, response: responseText, messages: newMessages });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: 'AI processing failed' });
  }
};
