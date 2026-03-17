
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
    <div className="pt-24 pb-16 md:pt-40 md:pb-24" style={{ backgroundColor: '#0B1C26' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
        <h4 className="text-luxury-gold text-sm md:text-lg uppercase tracking-[0.3em] font-bold mb-8 inline-block border-b border-luxury-gold/20 pb-4">
          {title}
        </h4>
        <p className="text-white/60 text-base md:text-xl font-normal leading-loose md:leading-[2] mb-14 text-center max-w-5xl mx-auto">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(link.view)}
              className="text-sm uppercase tracking-[0.2em] text-luxury-gold/50 hover:text-luxury-gold border-b border-transparent hover:border-luxury-gold/40 pb-2 transition-all font-semibold"
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
