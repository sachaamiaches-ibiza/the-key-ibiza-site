
import React from 'react';
import { LogoTheKey } from './Navbar';
import { Language } from '../types';
import { translations } from '../translations';

interface HeroProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, lang }) => {
  const t = translations[lang];
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-luxury-blue pt-20 lg:pt-32">
      {/* Ambient Matte Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-luxury-slate via-luxury-blue to-luxury-blue opacity-80"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] xl:w-[900px] h-[300px] md:h-[600px] xl:h-[900px] bg-luxury-gold/5 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] xl:w-[800px] h-[250px] md:h-[500px] xl:h-[800px] bg-luxury-gold/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 text-center px-6 w-full max-w-[1920px] mx-auto flex flex-col items-center justify-center">
        {/* Central Logo */}
        <div className="flex flex-col items-center mb-6 md:mb-10 lg:mb-12 animate-slide-up w-full">
           <LogoTheKey className="w-16 h-24 md:w-28 md:h-36 lg:w-32 lg:h-44 xl:w-40 xl:h-56 text-luxury-gold mb-6 md:mb-8" />
           <span className="text-luxury-gold uppercase tracking-[0.6em] md:tracking-[1em] xl:tracking-[1.2em] text-[8px] md:text-[10px] lg:text-xs font-black block">
            {t.nav.tagline}
          </span>
        </div>
        
        {/* Main Title - Responsive scaling and Optical Centering */}
        <div className="flex flex-col items-center mb-10 md:mb-14 lg:mb-20 xl:mb-28 animate-slide-up w-full" style={{animationDelay: '100ms'}}>
          <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[13rem] xl:text-[16rem] font-serif leading-[0.85] text-white tracking-tighter uppercase whitespace-nowrap">
            THE KEY
          </h1>
          <div className="w-full flex justify-center">
            {/* Reducción ligera del margen negativo para crear el espacio solicitado entre las palabras */}
            <span className="text-gradient italic text-3xl sm:text-4xl md:text-5xl
  tracking-[0.3em] md:tracking-[0.5em] pl-[0.3em] md:pl-[0.5em]
  lg:pl-[0.6em] -mt-1.5 md:-mt-5 lg:-mt-10 xl:-mt-12"
  style={{ fontFamily: 'Playfair Display, serif' }}
>
              IBIZAs
            </span>
          </div>
        </div>
        
        <p className="max-w-3xl xl:max-w-5xl mx-auto text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light mb-12 md:mb-16 lg:mb-24 tracking-wide leading-relaxed animate-slide-up" style={{animationDelay: '200ms'}}>
          {t.hero.subtitle} <br className="hidden md:block"/>
          <span className="text-luxury-gold/50 text-sm md:text-lg lg:text-xl xl:text-2xl block mt-4 italic tracking-[0.15em] lg:tracking-[0.25em] xl:tracking-[0.35em] font-medium">
            {t.hero.keyline}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 xl:gap-14 animate-slide-up w-full" style={{animationDelay: '300ms'}}>
          <button 
            onClick={() => onNavigate('services')}
            className="group px-10 md:px-14 lg:px-20 py-5 md:py-6 bg-luxury-gold text-luxury-blue font-bold rounded-full hover:bg-white transition-all transform hover:-translate-y-1 duration-500 w-full md:w-auto shadow-2xl flex items-center justify-center space-x-6"
          >
            <span className="uppercase tracking-[0.25em] lg:tracking-[0.4em] text-[10px] lg:text-[11px] xl:text-[12px]">{t.hero.explore}</span>
            <LogoTheKey className="w-4 h-6 lg:w-5 lg:h-8 text-luxury-blue transition-transform group-hover:rotate-12" />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 md:px-14 lg:px-20 py-5 md:py-6 border border-luxury-gold/30 backdrop-blur-3xl rounded-full hover:border-luxury-gold hover:bg-white/5 transition-all font-bold text-white w-full md:w-auto uppercase tracking-[0.25em] lg:tracking-[0.4em] text-[10px] lg:text-[11px] xl:text-[12px]"
          >
            {t.hero.request}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20 cursor-pointer hidden md:block" onClick={() => {
         const el = document.getElementById('explore-world');
         el?.scrollIntoView({ behavior: 'smooth' });
      }}>
        <svg className="w-6 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>
    </section>
  );
};

export default Hero;
