import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RateLimitModal({ isOpen, onClose }: RateLimitModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                <Lock className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {t('rateLimit.title')}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {t('rateLimit.desc')}
                </p>
              </div>

              <div className="w-full space-y-3 pt-4">
                <a 
                  href="#cta" 
                  onClick={onClose}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-primary/30"
                >
                  {t('rateLimit.btn')} <ArrowRight className="w-4 h-4" />
                </a>
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-slate-500 hover:text-white font-bold transition-colors text-sm"
                >
                  {t('rateLimit.close')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
