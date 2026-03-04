import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function ApiKeySelector() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // Check if we already have a key in the environment
      const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 
                    (import.meta.env.VITE_API_KEY as string);
      
      if (envKey && envKey !== "undefined" && envKey !== "missing-key") {
        setHasKey(true);
        return;
      }

      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true); 
      }
    };
    checkKey();
  }, []);

  const handleOpenSelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success as per instructions
      window.location.reload(); // Reload to ensure new key is picked up by build/env
    }
  };

  if (hasKey === true || hasKey === null) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] max-w-sm">
      <div className="glass border border-amber-500/50 p-6 rounded-2xl shadow-2xl bg-amber-950/20 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Configuración de IA Requerida</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Para utilizar las funciones de análisis de documentos, debes seleccionar una API Key válida.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleOpenSelector}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" /> Seleccionar API Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-slate-500 hover:text-white flex items-center justify-center gap-1 transition-colors"
              >
                Documentación de Facturación <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
