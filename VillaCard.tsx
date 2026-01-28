
import React from 'react';
import { Villa, Language } from '../types';
import { translations } from '../translations';

interface VillaCardProps {
  villa: Villa;
  onNavigate?: (view: any) => void;
  lang: Language;
}

const VillaCard: React.FC<VillaCardProps> = ({ villa, onNavigate, lang }) => {
  const t = translations[lang].villa;
  const btnText = lang === 'en' ? 'Discover Property' : (lang === 'es' ? 'Descubrir Propiedad' : 'Découvrir la Propriété');

  return (
    <div 
      className="group relative flex flex-col h-full luxury-card rounded-[40px] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-luxury-gold/10 hover:-translate-y-2 cursor-pointer border border-white/5"
      onClick={() => onNavigate && onNavigate(`villa-${villa.id}`)}
    >
      {/* Photo Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={villa.imageUrl} 
          alt={villa.name} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Badge */}
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-luxury-blue/60 backdrop-blur-md border border-white/10 rounded-full">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-luxury-gold italic">{villa.category}</span>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="flex-1 p-8 flex flex-col justify-between bg-luxury-slate/30">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-luxury-gold text-[9px] uppercase tracking-[0.4em] font-bold block mb-1">{villa.location}</span>
              <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-luxury-gold transition-colors duration-500 mb-3">{villa.name}</h3>
              {/* Added Descriptive Phrase */}
              <p className="text-white/60 text-sm font-serif italic leading-relaxed group-hover:text-white/80 transition-colors">
                {villa.shortDescription}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 mb-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-luxury-gold text-lg mb-1">🛌</span>
              <span className="text-white text-xs font-bold">{villa.bedrooms}</span>
              <span className="text-[8px] uppercase tracking-widest text-white/30">{t.beds}</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-white/5">
              <span className="text-luxury-gold text-lg mb-1">🚿</span>
              <span className="text-white text-xs font-bold">{villa.bathrooms}</span>
              <span className="text-[8px] uppercase tracking-widest text-white/30">{t.baths}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-luxury-gold text-lg mb-1">👥</span>
              <span className="text-white text-xs font-bold">{villa.maxGuests}</span>
              <span className="text-[8px] uppercase tracking-widest text-white/30">{lang === 'en' ? 'Guests' : (lang === 'es' ? 'Personas' : 'Invités')}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-bold mb-1">Weekly Price Range</span>
            <span className="text-sm font-medium text-white/90 tracking-widest font-serif italic">
              {villa.priceRange || villa.price}
            </span>
          </div>
          
          <button className="w-full py-4 rounded-full border border-luxury-gold/30 text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 group-hover:bg-luxury-gold group-hover:text-luxury-blue group-hover:border-luxury-gold">
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VillaCard;
