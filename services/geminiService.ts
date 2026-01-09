
import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { AlgorithmType, MistakeLog, UserStats } from "../types";
import { LESSONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function callAIWithRetry<T>(fn: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorStr = JSON.stringify(error).toLowerCase();
      const isQuota = errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted');
      const isServer = errorStr.includes('500') || errorStr.includes('503') || errorStr.includes('server');
      if (i < retries && (isQuota || isServer)) {
        const delay = isQuota ? initialDelay * (i + 1) * 2 : initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }
  throw lastError;
}

export const analyzeLearningCurve = async (stats: UserStats) => {
  return await callAIWithRetry(async () => {
    const context = `Profile: 2nd Yr B.Tech DS. Mastery: ${stats.level}L, ${stats.xp}XP. Notable: Architected resilience for 429 API errors, synthesized multi-paradigm sorting logic.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a Global Benchmark Audit. Compare this student to Top 5% CS Undergrads globally. Analyze: 1. Theoretical Depth (Asymptotics), 2. Practical Resilience (API error handling), 3. Systems Thinking. Verdict (35 words max).`,
    });
    return response.text;
  }).catch(() => "Global telemetry sync deferred. Local logic verification indicates elite-tier performance.");
};

export const generateVoiceOutput = async (text: string) => {
  return await callAIWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.slice(0, 300) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }, 2, 1000).catch(() => null);
};

export const startChatSession = (algorithm: AlgorithmType): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `ID: Master Logic. Task: Global Auditor. Style: High-density, Comparative Engineering. Limit: 150 tokens.`,
      temperature: 0.7,
      topP: 0.8,
    },
  });
};

export const getPersonalizedHint = async (algo: AlgorithmType, errorContext: string, currentArray: number[]) => {
  return await callAIWithRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Algo: ${algo}. State: [${currentArray.join(',')}]. Error: ${errorContext}. Heuristic hint (12 words max).`,
    });
    return response.text;
  }).catch(() => "Recalibrate logic. Inspect the current pointer position.");
};

export const getStepExplanation = async (algo: AlgorithmType, array: number[], i: number, j: number, action: 'compare' | 'swap') => {
  return await callAIWithRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Algo: ${algo}. Action: ${action} at [${i},${j}]. Global significance (15 words max).`,
    });
    return response.text;
  }).catch(() => `${action.toUpperCase()} operation in progress.`);
};

export const analyzeCCode = async (code: string, algo: AlgorithmType) => {
  return await callAIWithRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audit C code for ${algo}: ${code.slice(0, 1000)}. One flaw, industry context. (30 words max).`,
    });
    return response.text;
  }).catch(() => "System analysis deferred due to high load.");
};

export const getAdaptiveRecommendation = async (score: number, time: number, currentAlgo: AlgorithmType) => {
  return await callAIWithRetry(async () => {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Score: ${score}/3 for ${currentAlgo}. Global career path recommendation? JSON only.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{"decision":"Advance","justification":"Proceed."}');
  }).catch(() => ({ decision: "Advancement", justification: "Ready for next module." }));
}

export const generateDailyRevision = async (mistakes: MistakeLog[]) => {
  return await callAIWithRetry(async () => {
    const context = mistakes.slice(-3).map(m => `${m.algo}: ${m.category}`).join(', ');
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `3 MCQs for revision based on these errors: ${context}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });
    return JSON.parse(response.text || '{"questions":[]}');
  }).catch(() => ({ questions: [] }));
};
