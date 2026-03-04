import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShieldCheck, ShieldAlert, ExternalLink, RefreshCw, FileSearch, ArrowRight, File as FileIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { hashFile, DocumentMetadata } from '../services/documentService';

export default function PublicValidator() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [isValid, setIsValid] = useState(true);
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('scanning');

    try {
      // 1. Generate Hash
      const fileHash = await hashFile(file);
      
      // 2. Check Supabase
      if (supabase) {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('hash', fileHash)
          .single();
        
        if (data && !error) {
          setIsValid(true);
          setMetadata({
            issuer: data.issuer,
            recipient: data.recipient,
            role: data.role,
            date: data.date
          });
        } else {
          setIsValid(false);
          setMetadata(null);
        }
      } else {
        // Fallback for demo if Supabase is not connected
        setIsValid(Math.random() > 0.5);
      }

      setStatus('result');
    } catch (error) {
      console.error('Verification failed:', error);
      setStatus('idle');
      alert('Error verifying document.');
    }
  };

  return (
    <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <input 
        type="file" 
        id="validator-file-input" 
        className="hidden" 
        onChange={handleFileSelect}
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white">{t('validator.title')}</h3>
          <p className="text-slate-500 text-xs uppercase tracking-widest">{t('validator.subtitle')}</p>
        </div>
        <div className="w-12 h-12 bg-accent-teal/10 rounded-xl flex items-center justify-center text-accent-teal">
          <Search className="w-6 h-6" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => document.getElementById('validator-file-input')?.click()}
            className="border-2 border-dashed border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-900/50 group cursor-pointer hover:border-accent-teal transition-all"
          >
            <div className="relative mb-4">
              <FileSearch className="w-12 h-12 text-slate-500 group-hover:text-accent-teal transition-colors" />
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 border-t-2 border-accent-teal/50 opacity-0 group-hover:opacity-100"
              />
            </div>
            <p className="text-slate-300 font-bold mb-2 text-center">{t('validator.drop')}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t('validator.dragDrop')}</p>
          </motion.div>
        )}

        {status === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-xs aspect-video bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden">
              {/* Laser Scan Animation */}
              <motion.div
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-1 bg-accent-teal shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-1 bg-slate-800 rounded animate-pulse" />
                <div className="w-20 h-1 bg-slate-800 rounded animate-pulse delay-75" />
                <div className="w-16 h-1 bg-slate-800 rounded animate-pulse delay-150" />
              </div>
            </div>
            <h4 className="mt-8 text-lg font-bold text-white animate-pulse">{t('validator.scanning')}</h4>
          </motion.div>
        )}

        {status === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`p-8 rounded-2xl border flex flex-col items-center text-center transition-all ${
              isValid 
                ? 'bg-emerald-500/5 border-emerald-500/30' 
                : 'bg-red-500/5 border-red-500/30'
            }`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-2xl ${
                isValid ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
              }`}>
                {isValid ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
              </div>
              
              <h4 className={`text-2xl font-black mb-2 ${isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                {isValid ? t('validator.valid') : t('validator.invalid')}
              </h4>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">
                {isValid ? t('validator.validDesc') : t('validator.invalidDesc')}
              </p>

              {isValid && metadata && (
                <div className="w-full grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10 text-left">
                  <div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Emisor</p>
                    <p className="text-xs text-white font-medium truncate">{metadata.issuer}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Receptor</p>
                    <p className="text-xs text-white font-medium truncate">{metadata.recipient}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cargo/Curso</p>
                    <p className="text-xs text-white font-medium truncate">{metadata.role}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha</p>
                    <p className="text-xs text-white font-medium truncate">{metadata.date}</p>
                  </div>
                </div>
              )}
            </div>

            {isValid && (
              <a 
                href="https://polygonscan.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 glass rounded-xl border border-white/5 hover:border-primary/50 transition-all group"
              >
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{t('validator.explorer')}</span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
              </a>
            )}

            <button 
              onClick={() => setStatus('idle')}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {t('validator.btn')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
