import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Network, FunctionSquare as Function, ArrowRight, Github, Twitter, Linkedin, ExternalLink, Globe, Zap, Search } from 'lucide-react';
import VerificationDemo from './components/VerificationDemo';
import IssuerCenter from './components/IssuerCenter';
import PublicValidator from './components/PublicValidator';
import BetaForm from './components/BetaForm';
import { useLanguage } from './context/LanguageContext';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
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
          <a href="#issuer" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
            {t('issuer.title')}
          </a>
          <a href="#validator" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
            {t('validator.title')}
          </a>
          <a href="#case-studies" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
            {t('nav.caseStudies')}
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4 bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${language === 'en' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${language === 'es' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ES
            </button>
          </div>
          <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
            {t('nav.getStarted')}
          </button>
        </div>
      </div>
    </header>
  );
};

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
  const { t } = useLanguage();

  return (
    <div className="min-h-screen grid-bg selection:bg-primary selection:text-white scroll-smooth">
      <Navbar />
      
      <main>
        {/* Hero Section with Issuer Center (Step 1) */}
        <section id="issuer" className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                {t('hero.badge')}
              </div>
              
              <h2 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white">
                {t('hero.title')} <br />
                <span className="text-primary text-glow">{t('hero.truth')}</span>
              </h2>
              
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-light">
                {t('issuer.desc')}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#validator" className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                  {t('nav.verification')} <ArrowRight className="w-5 h-5" />
                </a>
                <button className="px-8 py-4 glass text-white rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                  {t('hero.docsBtn')} <ExternalLink className="w-4 h-4 opacity-50" />
                </button>
              </div>

              <div className="pt-12 grid grid-cols-3 gap-8 border-t border-white/5">
                {[
                  { label: t('hero.stats.assets'), value: '1.2M+' },
                  { label: t('hero.stats.nodes'), value: '4,829' },
                  { label: t('hero.stats.uptime'), value: '99.99%' },
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
              <IssuerCenter />
            </motion.div>
          </div>
        </section>

        {/* Public Validator Section (Step 2) */}
        <section id="validator" className="py-32 bg-slate-950/30 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="w-16 h-16 bg-accent-teal/10 rounded-2xl flex items-center justify-center text-accent-teal">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {t('validator.title')}
                </h2>
                <p className="text-slate-400 text-lg font-light leading-relaxed">
                  {t('validator.desc')}
                </p>
                <div className="p-6 glass rounded-2xl border border-white/5">
                  <h4 className="text-white font-bold mb-2">{t('validator.zeroTrustTitle')}</h4>
                  <p className="text-slate-500 text-sm">
                    {t('validator.zeroTrustDesc')}
                  </p>
                </div>
                
                <ul className="space-y-4 pt-4">
                  {[
                    t('features.immutability.title'),
                    t('features.independence.title'),
                    t('features.math.title')
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-accent-teal/20 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-accent-teal" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <PublicValidator />
              </div>
            </div>
          </div>
        </section>

        {/* Why It's Different Section */}
        <section className="py-32 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">{t('features.title')}</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                {t('features.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Lock}
                title={t('features.immutability.title')}
                description={t('features.immutability.desc')}
              />
              <FeatureCard 
                icon={Network}
                title={t('features.independence.title')}
                description={t('features.independence.desc')}
              />
              <FeatureCard 
                icon={Function}
                title={t('features.math.title')}
                description={t('features.math.desc')}
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
              
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter">{t('cta.title')}</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                {t('cta.subtitle')}
              </p>
              
              <BetaForm />
              
              <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
                {t('cta.terms')}
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
                {t('footer.desc')}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">{t('footer.resources')}</h4>
              <ul className="space-y-4">
                {[
                  { label: t('footerLinks.docs'), href: '#' },
                  { label: t('footerLinks.api'), href: '#' },
                  { label: t('footerLinks.status'), href: '#' },
                  { label: t('footerLinks.security'), href: '#' }
                ].map(item => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-slate-500 hover:text-primary transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">{t('footer.connect')}</h4>
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
            <p className="text-xs text-slate-600">{t('footer.rights')}</p>
            <div className="flex gap-8">
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">{t('footer.terms')}</a>
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">{t('footer.cookies')}</a>
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
