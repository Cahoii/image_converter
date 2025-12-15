import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert File/Blob to Base64
export const fileToBase64 = async (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove Data-URI prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const analyzeImage = async (file: File): Promise<{ suggestedName: string; description: string }> => {
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình.");
  }

  try {
    const base64Data = await fileToBase64(file);

    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: `Analyze this image and provide:
            1. A short, SEO-friendly filename (in English or Vietnamese, lowercase, no spaces, use hyphens) that describes the image content. Do not include the file extension.
            2. A concise description (caption) of the image in Vietnamese.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedName: { type: Type.STRING, description: "The optimized filename without extension" },
            description: { type: Type.STRING, description: "A concise description in Vietnamese" }
          },
          required: ["suggestedName", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
