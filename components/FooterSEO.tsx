
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
    <div className="mt-40 pt-20 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity duration-1000 group/seo">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h4 className="text-luxury-gold text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-black mb-10 inline-block border-b border-luxury-gold/20 pb-4">
            {title}
          </h4>
          <p className="text-white/40 text-[13px] md:text-sm font-light leading-relaxed mb-12 text-justify md:text-center max-w-4xl mx-auto transition-colors group-hover/seo:text-white/60">
            {description}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
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
