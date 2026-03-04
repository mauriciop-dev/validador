import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Shield, CheckCircle, Loader2, Cpu, Database } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Step = 'upload' | 'hashing' | 'validating' | 'success';

export default function VerificationDemo() {
  const [step, setStep] = useState<Step>('upload');
  const [progress, setProgress] = useState(0);
  const [hash, setHash] = useState('');

  const generateHash = () => {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleUpload = () => {
    setStep('hashing');
    setProgress(0);
  };

  useEffect(() => {
    if (step === 'hashing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setHash(generateHash());
            setTimeout(() => setStep('validating'), 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }

    if (step === 'validating') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const reset = () => {
    setStep('upload');
    setProgress(0);
    setHash('');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30 animate-pulse" />
      
      <div className="relative glass rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
            VERIFICATION_ENGINE_V1.02
          </span>
        </div>

        <div className="space-y-12">
          {/* Step 1: Upload */}
          <div className={cn("transition-opacity duration-500", step !== 'upload' && "opacity-40")}>
            <div className="flex items-start gap-4 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <h4 className="font-bold text-white">Upload Certification</h4>
            </div>
            
            {step === 'upload' ? (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                onClick={handleUpload}
                className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-900/50 group cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
                <p className="text-sm font-medium text-slate-500">Drag Labor Certification PDF here</p>
                <p className="text-[10px] text-slate-600 mt-2">Supports PDF, PNG, JPG (Max 10MB)</p>
              </motion.div>
            ) : (
              <div className="border border-slate-800 rounded-2xl p-4 flex items-center gap-3 bg-slate-900/30">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-300">certification_v4.pdf</p>
                  <p className="text-[10px] text-slate-500">2.4 MB • Uploaded</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Hashing */}
          <div className={cn("transition-opacity duration-500", step === 'upload' && "opacity-20", step !== 'hashing' && step !== 'upload' && "opacity-40")}>
            <div className="flex items-start gap-4 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <h4 className="font-bold text-white">Cryptographic Hashing</h4>
            </div>
            
            <div className="glass border-primary/30 rounded-2xl p-6 relative overflow-hidden">
              {step === 'hashing' && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-teal to-transparent opacity-50" 
                />
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-accent-teal flex items-center gap-2">
                  {step === 'hashing' && <Loader2 className="w-3 h-3 animate-spin" />}
                  {step === 'hashing' ? 'SHA-256 GENERATION...' : 'HASH GENERATED'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{progress}% COMPLETE</span>
              </div>
              
              <div className="font-mono text-primary text-sm break-all leading-relaxed">
                {hash || '0x' + '•'.repeat(60)}
              </div>
            </div>
          </div>

          {/* Step 3: Validation */}
          <div className={cn("transition-opacity duration-500", (step === 'upload' || step === 'hashing') && "opacity-20")}>
            <div className="flex items-start gap-4 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <h4 className="font-bold text-white">Blockchain Validation</h4>
            </div>
            
            <button 
              disabled={step !== 'validating' && step !== 'success'}
              className={cn(
                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all group relative overflow-hidden",
                step === 'validating' ? "bg-accent-teal/10 text-accent-teal border border-accent-teal/30" : 
                step === 'success' ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500 border border-slate-700"
              )}
            >
              {step === 'validating' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Validating Nodes...
                </>
              ) : step === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Verified on Global Blockchain
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Awaiting Hash...
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-20"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl shadow-emerald-500/20"
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-black mb-2 text-white">Verification Complete</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-xs">
                The document has been successfully validated against the global ledger.
              </p>
              
              <div className="w-full space-y-3 mb-8">
                <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                  <span className="text-slate-500">BLOCK NUMBER</span>
                  <span className="text-accent-teal">#18,492,031</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                  <span className="text-slate-500">TIMESTAMP</span>
                  <span className="text-slate-300">{new Date().toISOString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                  <span className="text-slate-500">STATUS</span>
                  <span className="text-emerald-400">FINALIZED</span>
                </div>
              </div>

              <button 
                onClick={reset}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Verify Another Document
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
