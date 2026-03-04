import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable trust proxy for accurate IP detection behind nginx/load balancers
app.set('trust proxy', 1);

// Configure Multer for file uploads (in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Rate Limiter: 3 requests per 24 hours per IP
const analysisLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each IP to 3 requests per windowMs
  message: { error: "Límite de demo alcanzado. Solo puedes procesar 3 archivos cada 24 horas." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Gemini API Key from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDYS_P4ntp-7jVMF6cvGBR0PRD1zRD_Et8";
console.log("Configuración de API Key:", GEMINI_API_KEY ? `Presente (${GEMINI_API_KEY.substring(0, 5)}...)` : "Ausente");

app.use(express.json({ limit: '50mb' }));

async function startServer() {
  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Servidor de Notaría Digital activo" });
  });

  app.post("/api/analyze", analysisLimiter, async (req, res) => {
    console.log("Recibida solicitud de análisis JSON");
    try {
      const { fileData, mimeType } = req.body;

      if (!fileData) {
        return res.status(400).json({ error: "No se han recibido datos del archivo." });
      }

      if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Error de configuración: API Key no encontrada." });
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
      res.json(result);
    } catch (error: any) {
      console.error("Error en análisis:", error);
      res.status(500).json({ error: error.message || "Error interno al analizar el documento." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de Notaría Digital corriendo en http://localhost:${PORT}`);
  });
}

startServer();
