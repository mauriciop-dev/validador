import { GoogleGenAI, Type } from "@google/genai";

// Helper to get the most up-to-date API key
const getApiKey = () => {
  // Try multiple sources for the API key
  const key = (import.meta.env.VITE_GEMINI_API_KEY as string) || 
              (import.meta.env.VITE_API_KEY as string) ||
              "";
  
  // Basic validation to avoid using placeholder strings
  if (!key || key === "undefined" || key === "missing-key") {
    return null;
  }
  return key;
};

export interface DocumentMetadata {
  issuer: string;
  recipient: string;
  role: string;
  date: string;
}

export async function analyzeDocument(file: File): Promise<DocumentMetadata> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined. AI features will fail.");
    throw new Error("API_KEY_MISSING");
  }

  const base64Data = await fileToBase64(file);
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64Data.split(',')[1],
              mimeType: file.type || "application/pdf",
            },
          },
          {
            text: "Analyze this professional certification and extract the following information in JSON format: issuer (the company or institution), recipient (the person receiving the certificate), role (the job title or course name), and date (the date of issuance). If any field is missing, use 'Unknown'.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          issuer: { type: Type.STRING },
          recipient: { type: Type.STRING },
          role: { type: Type.STRING },
          date: { type: Type.STRING },
        },
        required: ["issuer", "recipient", "role", "date"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as DocumentMetadata;
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    return {
      issuer: "Unknown",
      recipient: "Unknown",
      role: "Unknown",
      date: "Unknown",
    };
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex}`;
}
