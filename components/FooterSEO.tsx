
import React from 'react';
import { Language } from '../types';

interface FooterSEOProps {
  onNavigate: (view: any) => void;
  lang: Language;
  title: string;
  description: string;
  links: { label: string; view: string }[];
}

const FooterSEO: React.FC<FooterSEOProps> = ({ onNavigate, lang, title, description, links }) => {
  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-20" style={{ backgroundColor: '#0B1C26' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h4 className="text-luxury-gold text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-black mb-6 inline-block border-b border-luxury-gold/20 pb-4">
          {title}
        </h4>
        <p className="text-white/50 text-[13px] md:text-sm font-light leading-relaxed mb-10 text-center max-w-3xl mx-auto">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(link.view)}
              className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold/40 hover:text-luxury-gold border-b border-transparent hover:border-luxury-gold/40 pb-1.5 transition-all font-bold"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterSEO;
