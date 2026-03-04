import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BetaForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const response = await fetch('https://formspree.io/f/xnjbekoj', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setMessage(t('cta.successMsg'));
      } else {
        const data = await response.json();
        throw new Error(data.error || t('cta.errorMsg'));
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setStatus('error');
      setMessage(err.message || t('cta.errorMsg'));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('cta.placeholder')}
              required
              disabled={status === 'success' || status === 'loading'}
              className="w-full bg-white/5 border border-slate-700 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all placeholder:text-slate-600 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <>
                {t('cta.btn')}
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 flex items-center justify-center gap-2 text-emerald-400"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="font-bold text-sm">{t('cta.success')}</span>
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-xs text-red-400 text-center"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="mt-6 text-[10px] text-slate-500 text-center uppercase tracking-widest">
        {t('cta.limited')}
      </p>
    </div>
  );
}
