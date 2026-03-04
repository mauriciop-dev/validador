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
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black px-4 py-3 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p className="font-medium text-sm">
          <span className="font-bold">Acción requerida:</span> Para usar las funciones de IA (Notaría), debes configurar una API Key de Gemini.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs underline hover:text-black/80 flex items-center gap-1"
        >
          Facturación <ExternalLink className="w-3 h-3" />
        </a>
        <button
          onClick={handleOpenSelector}
          className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-black/80 transition-colors flex items-center gap-2"
        >
          <Key className="w-4 h-4" />
          Configurar API Key
        </button>
      </div>
    </div>
  );
}
