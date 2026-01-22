import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: In a production environment, ensure API_KEY is set in your environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Transcribes audio data using Gemini Flash model.
 * @param audioDataUrl - The base64 data URL of the audio (e.g., "data:audio/webm;base64,...")
 * @returns The transcribed text string.
 */
export const transcribeAudio = async (audioDataUrl: string): Promise<string> => {
  try {
    // Extract the raw base64 string (remove the "data:audio/webm;base64," prefix)
    const base64Data = audioDataUrl.split(',')[1];
    const mimeType = audioDataUrl.split(';')[0].split(':')[1] || 'audio/webm';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Trascrivi questo audio fedelmente in italiano. Non aggiungere commenti, solo il testo parlato."
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster transcription
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    return "";
  }
};
