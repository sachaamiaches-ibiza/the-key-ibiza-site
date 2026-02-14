
import React from 'react';
import { Language } from '../types';

interface ComingSoonProps {
  title: string;
  onNavigate: (view: string) => void;
  lang: Language;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, onNavigate, lang }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0B1C26' }}>
      <div className="text-center px-6">
        <span
          className="text-luxury-gold text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-light block mb-8"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {title}
        </span>
        <h1
          className="text-4xl md:text-6xl lg:text-7xl text-white/20 italic mb-12"
          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}
        >
          Coming Soon
        </h1>
        <div className="w-16 h-px bg-luxury-gold/30 mx-auto mb-12"></div>
        <button
          onClick={() => onNavigate('home')}
          className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold/50 hover:text-luxury-gold border-b border-transparent hover:border-luxury-gold/40 pb-1 transition-all font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
