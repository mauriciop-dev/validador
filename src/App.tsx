import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Network, FunctionSquare as Function, ArrowRight, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import VerificationDemo from './components/VerificationDemo';
import BetaForm from './components/BetaForm';

const Navbar = () => (
  <header className="sticky top-0 z-50 glass border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-white uppercase">
          ProDig <span className="text-primary">Trust Lab</span>
        </h1>
      </div>
      <nav className="hidden md:flex items-center gap-10">
        {['Platform', 'Verification', 'Case Studies', 'Enterprise'].map((item) => (
          <a key={item} href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
            {item}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
          Get Started
        </button>
      </div>
    </div>
  </header>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-8 rounded-3xl border border-white/5 group hover:border-primary/50 transition-all"
  >
    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default function App() {
  return (
    <div className="min-h-screen grid-bg selection:bg-primary selection:text-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Blockchain v3.0 Live
              </div>
              
              <h2 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white">
                The Proof of <br />
                <span className="text-primary text-glow">Truth.</span>
              </h2>
              
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-light">
                Eliminate professional fraud with cryptographic certainty. Secure labor certifications and digital assets on an immutable global ledger.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                  Try Live Demo <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 glass text-white rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                  Technical Docs <ExternalLink className="w-4 h-4 opacity-50" />
                </button>
              </div>

              <div className="pt-12 grid grid-cols-3 gap-8 border-t border-white/5">
                {[
                  { label: 'VERIFIED ASSETS', value: '1.2M+' },
                  { label: 'NODES ACTIVE', value: '4,829' },
                  { label: 'UPTIME', value: '99.99%' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <VerificationDemo />
            </motion.div>
          </div>
        </section>

        {/* Why It's Different Section */}
        <section className="py-32 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">Why it's different</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Our decentralized architecture redefines how professional records are managed, authenticated, and shared globally.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Lock}
                title="Immutability"
                description="Once a certification is hashed and recorded on the ledger, it can never be altered or deleted. Stored forever with decentralized redundancy."
              />
              <FeatureCard 
                icon={Network}
                title="Independence"
                description="Verification happens directly on-chain. No reliance on centralized HR databases, private servers, or third-party intermediaries."
              />
              <FeatureCard 
                icon={Function}
                title="Mathematical Truth"
                description="Trust is replaced by code. Zero-knowledge proofs and cryptographic hashing provide 100% mathematical certainty of record authenticity."
              />
            </div>
          </div>
        </section>

        {/* CTA / Beta Form */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10" />
          
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass rounded-[3rem] p-12 md:p-24 border border-primary/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter">Ready to secure your future?</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Join our closed beta for enterprise partners and early adopters. Secure your spot in the truth economy.
              </p>
              
              <BetaForm />
              
              <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
                By joining, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-20 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-bold tracking-tighter text-white uppercase">ProDig</h1>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                Building the infrastructure for a more transparent and verifiable future. Decentralized trust for the modern workforce.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-4">
                {['Documentation', 'API Reference', 'Status', 'Security'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
            <p className="text-xs text-slate-600">© 2024 ProDig Trust Lab. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Background Accents */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-accent-teal/5 rounded-full blur-[150px] -z-20 pointer-events-none" />
    </div>
  );
}
