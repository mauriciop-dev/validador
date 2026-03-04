import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  maxDuration: 60, // Extend timeout for Gemini analysis
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { fileData, mimeType } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "No se han recibido datos del archivo." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "API Key de Gemini no configurada en Vercel." });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: fileData,
                mimeType: mimeType || "application/pdf",
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

    const result = JSON.parse(response.text || "{}");
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en Vercel Function:", error);
    return res.status(500).json({ error: error.message || "Error interno en el servidor de Vercel." });
  }
}
