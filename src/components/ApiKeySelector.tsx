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
  const [showManual, setShowManual] = useState(false);
  const [manualKey, setManualKey] = useState('');

  useEffect(() => {
    const verify = async () => {
      // Check for manual key first
      const savedKey = localStorage.getItem('PRODIG_MANUAL_KEY');
      if (savedKey && savedKey.length > 10) {
        setHasKey(true);
        return;
      }

      const isKeyValid = checkActualKey();
      
      if (!isKeyValid) {
        if (window.aistudio) {
          try {
            const selected = await window.aistudio.hasSelectedApiKey();
            setHasKey(selected);
          } catch (e) {
            setHasKey(false);
          }
        } else {
          setHasKey(false);
        }
      } else {
        setHasKey(true);
      }
    };

    verify();
    const interval = setInterval(verify, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenSelector = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true);
        setTimeout(() => window.location.reload(), 500);
      } catch (err) {
        alert("No se pudo abrir el selector. Por favor, usa la opción 'Ingresar manualmente' o el icono de la llave en la barra superior.");
      }
    } else {
      setShowManual(true);
    }
  };

  const saveManualKey = () => {
    if (manualKey.trim().length > 10) {
      localStorage.setItem('PRODIG_MANUAL_KEY', manualKey.trim());
      setHasKey(true);
      window.location.reload();
    }
  };

  if (hasKey) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] bg-amber-500 text-black px-4 py-4 shadow-2xl border-b-2 border-amber-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black/20 p-2 rounded-full animate-pulse">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">
              Configuración de IA Requerida
            </p>
            <p className="text-xs font-medium opacity-80">
              Vincule su clave para activar el análisis de documentos de la Notaría.
            </p>
          </div>
        </div>

        {showManual ? (
          <div className="flex items-center gap-2 bg-black/10 p-1 rounded-lg">
            <input 
              type="password"
              placeholder="Pega tu API Key aquí..."
              className="bg-white px-3 py-2 rounded-md text-xs w-64 border-none focus:ring-2 focus:ring-black"
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
            />
            <button 
              onClick={saveManualKey}
              className="bg-black text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-slate-800"
            >
              Guardar
            </button>
            <button 
              onClick={() => setShowManual(false)}
              className="text-xs px-2 hover:underline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowManual(true)}
              className="text-xs font-bold underline hover:text-black/60"
            >
              ¿Problemas? Ingresar manualmente
            </button>
            <button
              onClick={handleOpenSelector}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              <Key className="w-5 h-5" />
              VINCULAR CLAVE AHORA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
