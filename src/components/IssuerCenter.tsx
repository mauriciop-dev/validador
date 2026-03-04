import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Shield, CheckCircle, Loader2, Cpu, FileText, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function IssuerCenter() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'sealing' | 'success'>('idle');
  const [hash, setHash] = useState('');

  const handleIssue = () => {
    setStatus('analyzing');
    setTimeout(() => {
      setStatus('sealing');
      setTimeout(() => {
        setHash('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
        setStatus('success');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white">{t('issuer.title')}</h3>
          <p className="text-slate-500 text-xs uppercase tracking-widest">{t('issuer.subtitle')}</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Zap className="w-6 h-6" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleIssue}
            className="border-2 border-dashed border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-900/50 group cursor-pointer hover:border-primary transition-all"
          >
            <Upload className="w-12 h-12 text-slate-500 group-hover:text-primary mb-4 transition-colors" />
            <p className="text-slate-300 font-bold mb-2">{t('issuer.upload')}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">PDF • DOCX • PNG</p>
          </motion.div>
        )}

        {(status === 'analyzing' || status === 'sealing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-2">
                {status === 'analyzing' ? t('issuer.analyzing') : t('issuer.sealing')}
              </h4>
              <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: status === 'analyzing' ? 2 : 3 }}
                  className="h-full bg-primary shadow-[0_0_10px_rgba(15,73,189,0.5)]"
                />
              </div>
            </div>

            {status === 'sealing' && (
              <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                    className="h-1 bg-primary/30 rounded"
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white">{t('issuer.success')}</h4>
                <p className="text-xs text-slate-400">{t('issuer.recorded')}</p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{t('issuer.hash')}</p>
                <div className="font-mono text-xs text-primary bg-primary/5 p-3 rounded-lg break-all border border-primary/10">
                  {hash}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Polygon Mainnet</span>
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-xs font-bold text-white hover:text-primary transition-colors"
                >
                  {t('issuer.btn')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
