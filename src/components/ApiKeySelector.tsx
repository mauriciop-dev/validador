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

// Same logic as documentService to ensure consistency
const checkActualKey = () => {
  const globalKey = (globalThis as any).process?.env?.API_KEY || 
                    (globalThis as any).process?.env?.GEMINI_API_KEY;
  
  const viteKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 
                  (import.meta.env.VITE_API_KEY as string);
  
  const key = globalKey || viteKey || "";
  
  return key.length > 10 && key !== "undefined" && key !== "missing-key";
};

export default function ApiKeySelector() {
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const verify = async () => {
      const isKeyValid = checkActualKey();
      
      if (!isKeyValid) {
        if (window.aistudio) {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } else {
          setHasKey(false);
        }
      } else {
        setHasKey(true);
      }
    };

    verify();
    const interval = setInterval(verify, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenSelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  if (hasKey) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] bg-amber-500 text-black px-4 py-4 shadow-2xl flex items-center justify-between border-b-2 border-amber-600">
      <div className="flex items-center gap-4">
        <div className="bg-black/20 p-2 rounded-full animate-pulse">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-black text-sm uppercase tracking-tight">
            Configuración de IA Requerida
          </p>
          <p className="text-xs font-medium opacity-80">
            Para que la Notaría Digital pueda analizar documentos, debes vincular tu API Key de Gemini.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold underline hover:text-black/60 flex items-center gap-1"
        >
          Facturación <ExternalLink className="w-3 h-3" />
        </a>
        <button
          onClick={handleOpenSelector}
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-2"
        >
          <Key className="w-5 h-5" />
          VINCULAR CLAVE AHORA
        </button>
      </div>
    </div>
  );
}
