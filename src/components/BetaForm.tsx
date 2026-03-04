import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
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
      if (!supabase) {
        // Mock success if Supabase is not configured
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        setMessage(t('cta.successMsg'));
        return;
      }

      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, joined_at: new Date().toISOString() }]);

      if (error) throw error;

      setStatus('success');
      setMessage(t('cta.priorityMsg'));
    } catch (err: any) {
      console.error('Signup error:', err);
      setStatus('error');
      setMessage(err.message || t('cta.errorMsg'));
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-white">{t('cta.success')}</h4>
          <p className="text-sm text-slate-400">{message}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('cta.placeholder')}
            required
            className="w-full bg-white/5 border border-slate-700 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 min-w-[140px]"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {t('cta.btn')}
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-3 text-xs text-red-400 text-center">{message}</p>
      )}
      <p className="mt-6 text-[10px] text-slate-500 text-center uppercase tracking-widest">
        {t('cta.limited')}
      </p>
    </form>
  );
}
