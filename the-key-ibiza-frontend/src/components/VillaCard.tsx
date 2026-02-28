
import React, { useState } from 'react';
import { Villa, Language } from '../types';
import { translations } from '../translations';
import { IconBed, IconBath, IconGuests } from './ServiceIcons';
import WatermarkedImage from './WatermarkedImage';
import { getCardImageUrl } from '../utils/cloudinaryUrl';

// Helper to convert villa name to URL-friendly slug
function nameToUrlSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .trim();
}

interface VillaCardProps {
  villa: Villa;
  onNavigate?: (view: any) => void;
  lang: Language;
  calculatedPrice?: number | null;
  hasDateRange?: boolean;
}

const VillaCard: React.FC<VillaCardProps> = ({ villa, onNavigate, lang, calculatedPrice, hasDateRange }) => {
  const t = translations[lang].villa;
  const btnText = lang === 'en' ? 'Discover Property' : (lang === 'es' ? 'Descubrir Propiedad' : 'Découvrir la Propriété');
  const isInvenioVilla = villa.id?.startsWith('invenio-');

  // Use full quality header images
  const images = villa.headerImages && villa.headerImages.length > 0 ? villa.headerImages : [villa.imageUrl];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="group relative flex flex-col h-full luxury-card rounded-[24px] md:rounded-[40px] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-luxury-gold/10 hover:-translate-y-2 cursor-pointer border border-white/5"
      onClick={() => onNavigate && onNavigate(`villa-${nameToUrlSlug(villa.name)}`)}
    >
      {/* Photo Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <WatermarkedImage
          src={getCardImageUrl(images[currentImageIndex])}
          alt={villa.name}
          className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
          watermarkSize="card"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all z-10"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-all z-10"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Badge - z-20 to appear above watermark */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 px-3 md:px-4 py-1 md:py-1.5 bg-luxury-blue/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center z-20">
          <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] font-bold text-luxury-gold italic text-center">{villa.district || villa.location || 'Ibiza'}</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 p-5 md:p-8 flex flex-col justify-between bg-luxury-slate/30">
        <div>
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-serif text-white group-hover:text-luxury-gold transition-colors duration-500 mb-2 md:mb-3">{villa.name}</h3>
              {/* Added Descriptive Phrase */}
              <p className="text-white/60 text-xs md:text-sm font-serif italic leading-relaxed group-hover:text-white/80 transition-colors line-clamp-2">
                {villa.shortDescription}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 py-4 md:py-6 border-y border-white/5 mb-4 md:mb-6">
            <div className="flex flex-col items-center text-center">
              <IconBed className="w-5 h-5 md:w-6 md:h-6 mb-1.5 md:mb-2" />
              <span className="text-white text-[10px] md:text-xs font-bold">{villa.bedrooms}</span>
              <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-white/30">{t.beds}</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-white/5">
              <IconBath className="w-5 h-5 md:w-6 md:h-6 mb-1.5 md:mb-2" />
              <span className="text-white text-[10px] md:text-xs font-bold">{villa.bathrooms}</span>
              <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-white/30">{t.baths}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <IconGuests className="w-5 h-5 md:w-6 md:h-6 mb-1.5 md:mb-2" />
              <span className="text-white text-[10px] md:text-xs font-bold">{villa.maxGuests}</span>
              <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-white/30">{lang === 'en' ? 'Guests' : (lang === 'es' ? 'Personas' : 'Invités')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col items-center text-center">
            {hasDateRange && calculatedPrice && !isInvenioVilla ? (
              <>
                <span className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-luxury-gold/60 font-bold mb-1">Total for Selected Period</span>
                <span className="text-base md:text-lg font-bold text-white tracking-wide">
                  {calculatedPrice.toLocaleString()} €
                </span>
              </>
            ) : (
              <>
                <span className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-white/30 font-bold mb-1">Weekly Price Range</span>
                <span className="text-xs md:text-sm font-medium text-white/90 tracking-widest font-serif italic">
                  {villa.priceRange || villa.price}
                </span>
              </>
            )}
          </div>

          <button className="w-full py-3 md:py-4 rounded-full bg-luxury-gold text-luxury-blue border border-luxury-gold text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] font-bold transition-all duration-500 group-hover:bg-luxury-blue group-hover:text-luxury-gold">
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VillaCard;
