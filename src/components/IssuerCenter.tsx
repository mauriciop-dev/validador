import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Shield, CircleCheck as CheckCircle, Loader2, Cpu, FileText, Zap, File as FileIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { hashFile, analyzeDocument, DocumentMetadata } from '../services/documentService';
import RateLimitModal from './RateLimitModal';

export default function IssuerCenter() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'sealing' | 'success'>('idle');
  const [hash, setHash] = useState('');
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userIp, setUserIp] = useState<string | null>(null);

  useEffect(() => {
    // Get user IP on mount
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(err => console.error('Error fetching IP:', err));
  }, []);

  const checkRateLimit = async (): Promise<boolean> => {
    if (!userIp) return false; // Fail open if IP can't be fetched

    try {
      if (!supabase) {
        // Fallback to localStorage if Supabase is not configured
        const localData = localStorage.getItem(`rate_limit_${userIp}`);
        const now = Date.now();
        if (localData) {
          const { count, lastReset } = JSON.parse(localData);
          if (now - lastReset < 24 * 60 * 60 * 1000) {
            if (count >= 3) return true;
          } else {
            // Reset if 24h passed
            localStorage.setItem(`rate_limit_${userIp}`, JSON.stringify({ count: 0, lastReset: now }));
          }
        } else {
          localStorage.setItem(`rate_limit_${userIp}`, JSON.stringify({ count: 0, lastReset: now }));
        }
        return false;
      }

      // Supabase logic
      const { data, error } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('ip', userIp)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Supabase rate limit error:', error);
        return false;
      }

      const now = new Date().getTime();
      if (data) {
        const lastReset = new Date(data.last_reset).getTime();
        if (now - lastReset < 24 * 60 * 60 * 1000) {
          if (data.count >= 3) return true;
        } else {
          // Reset count in DB
          await supabase
            .from('rate_limits')
            .update({ count: 0, last_reset: new Date().toISOString() })
            .eq('ip', userIp);
        }
      } else {
        // Create initial record
        await supabase
          .from('rate_limits')
          .insert([{ ip: userIp, count: 0, last_reset: new Date().toISOString() }]);
      }

      return false;
    } catch (err) {
      console.error('Rate limit check failed:', err);
      return false;
    }
  };

  const incrementRateLimit = async () => {
    if (!userIp) return;

    try {
      if (!supabase) {
        const localData = localStorage.getItem(`rate_limit_${userIp}`);
        if (localData) {
          const { count, lastReset } = JSON.parse(localData);
          localStorage.setItem(`rate_limit_${userIp}`, JSON.stringify({ count: count + 1, lastReset }));
        }
        return;
      }

      const { data } = await supabase
        .from('rate_limits')
        .select('count')
        .eq('ip', userIp)
        .single();

      if (data) {
        await supabase
          .from('rate_limits')
          .update({ count: data.count + 1 })
          .eq('ip', userIp);
      }
    } catch (err) {
      console.error('Failed to increment rate limit:', err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limited = await checkRateLimit();
    if (limited) {
      setIsRateLimited(true);
      return;
    }

    setSelectedFile(file);
    setStatus('analyzing');

    try {
      // 1. Analyze with AI (now calls backend)
      const aiMetadata = await analyzeDocument(file);
      setMetadata(aiMetadata);
      
      setStatus('sealing');

      // 2. Generate Hash
      const fileHash = await hashFile(file);
      setHash(fileHash);

      // 3. Save to Supabase (if available)
      if (supabase) {
        const { error } = await supabase
          .from('certificates')
          .insert([{
            hash: fileHash,
            issuer: aiMetadata.issuer,
            recipient: aiMetadata.recipient,
            role: aiMetadata.role,
            date: aiMetadata.date,
            file_name: file.name
          }]);
        
        if (error) {
          console.error('Supabase save error:', error);
        }
      }

      setStatus('success');
      await incrementRateLimit();
    } catch (error: any) {
      console.error('Processing failed:', error);
      setStatus('idle');
      
      // Handle specific error messages from backend
      if (error.message.includes('Límite de demo')) {
        setIsRateLimited(true);
      } else {
        alert(error.message || 'Error al procesar el documento. Por favor, intente de nuevo.');
      }
    }
  };

  return (
    <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <input 
        type="file" 
        id="issuer-file-input" 
        className="hidden" 
        onChange={handleFileSelect}
        accept=".pdf,.png,.jpg,.jpeg"
      />
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
            onClick={() => document.getElementById('issuer-file-input')?.click()}
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Emisor</p>
                  <p className="text-xs text-white font-medium truncate">{metadata?.issuer}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Receptor</p>
                  <p className="text-xs text-white font-medium truncate">{metadata?.recipient}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cargo/Curso</p>
                  <p className="text-xs text-white font-medium truncate">{metadata?.role}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha</p>
                  <p className="text-xs text-white font-medium truncate">{metadata?.date}</p>
                </div>
              </div>

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

      <RateLimitModal 
        isOpen={isRateLimited} 
        onClose={() => setIsRateLimited(false)} 
      />
    </div>
  );
}
