
import React, { useEffect } from 'react';
import { Villa, Language } from '../types';
import { translations } from '../translations';
// Fix: Import LogoTheKey which is used in the footer section of the page
import { LogoTheKey } from './Navbar';

interface VillaDetailPageProps {
  villa: Villa;
  onNavigate: (view: any) => void;
  lang: Language;
}

const VillaDetailPage: React.FC<VillaDetailPageProps> = ({ villa, onNavigate, lang }) => {
  const t = translations[lang].villa;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => onNavigate('villas-holiday')}
          className="flex items-center space-x-3 text-white/40 hover:text-luxury-gold transition-colors mb-20 uppercase tracking-widest text-[10px] font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>{t.back}</span>
        </button>

        {/* Hero Info Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">
          <div className="space-y-16 animate-slide-up">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block">{villa.category} Collection</span>
                <span className="px-3 py-1 border border-luxury-gold/20 rounded-full text-[8px] uppercase tracking-widest text-luxury-gold">Holiday Rental</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-serif text-white leading-tight">{villa.name}</h1>
              <p className="text-2xl md:text-3xl font-serif italic text-white/80 leading-relaxed">
                {villa.location}, Ibiza
              </p>
              
              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                <div className="luxury-card p-6 rounded-[30px] text-center border border-white/5">
                  <span className="block text-luxury-gold text-2xl font-serif mb-1">{villa.bedrooms}</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">{t.beds}</span>
                </div>
                <div className="luxury-card p-6 rounded-[30px] text-center border border-white/5">
                  <span className="block text-luxury-gold text-2xl font-serif mb-1">{villa.bathrooms}</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">{t.baths}</span>
                </div>
                <div className="luxury-card p-6 rounded-[30px] text-center border border-white/5">
                  <span className="block text-luxury-gold text-2xl font-serif mb-1">{villa.maxGuests}</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">{t.guests}</span>
                </div>
                <div className="luxury-card p-6 rounded-[30px] text-center border border-white/10 bg-luxury-gold/5">
                  <span className="block text-luxury-gold text-sm font-serif mb-1">{villa.priceRange}</span>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Price Range</span>
                </div>
              </div>
            </div>

            <div className="space-y-8 text-white/60 text-lg font-light leading-relaxed text-justify">
              {villa.fullDescription?.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border border-white/5 relative group animate-fade-in">
             <img src={villa.imageUrl} className="w-full h-full object-cover" alt={villa.name} />
             <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/40 to-transparent"></div>
          </div>
        </div>

        {/* Features & Seasonal Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          {/* Key Features */}
          <div className="luxury-card p-12 rounded-[50px] space-y-10 border border-white/5">
            <h3 className="text-3xl font-serif text-white flex items-center space-x-6">
              <span className="w-10 h-px bg-luxury-gold"></span>
              <span>{t.features}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {villa.features?.map((f, i) => (
                <div key={i} className="flex items-center space-x-4 group">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-white/60 text-[11px] uppercase tracking-[0.2em] font-bold">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Pricing Table */}
          {villa.seasonalPrices && (
            <div className="luxury-card p-12 rounded-[50px] space-y-10 border border-luxury-gold/10 bg-luxury-gold/5">
              <h3 className="text-3xl font-serif text-white flex items-center space-x-6">
                <span className="w-10 h-px bg-luxury-gold"></span>
                <span>{t.pricing}</span>
              </h3>
              <div className="overflow-hidden rounded-3xl border border-white/5">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-white/5 text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold">
                      <th className="px-8 py-5">{t.month}</th>
                      <th className="px-8 py-5 text-right">{t.weekly}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/70">
                    {villa.seasonalPrices.map((sp, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-4 font-serif italic text-lg">{sp.month}</td>
                        <td className="px-8 py-4 text-right font-bold tracking-widest">{sp.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Map Section */}
        {villa.locationMapUrl && (
          <div className="mb-32 space-y-12">
            <div className="text-center">
              <span className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Discovery</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white">{t.location}</h2>
            </div>
            <div className="aspect-[21/9] w-full rounded-[60px] overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
              <iframe 
                src={villa.locationMapUrl}
                className="w-full h-full border-none"
                loading="lazy"
                title="Property Map"
              ></iframe>
            </div>
          </div>
        )}

        {/* Gallery */}
        <div className="space-y-12 mb-32">
          <div className="text-center">
             <span className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Aesthetics</span>
             <h2 className="text-4xl md:text-6xl font-serif text-white italic">Gallery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {villa.gallery?.map((img, i) => (
              <div key={i} className="aspect-square rounded-[40px] overflow-hidden border border-white/5 group relative cursor-pointer">
                  <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale hover:grayscale-0" alt="Gallery" />
                  <div className="absolute inset-0 bg-luxury-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-3xl mx-auto space-y-12 bg-luxury-slate/30 p-20 rounded-[80px] border border-white/5">
          <LogoTheKey className="w-12 h-20 mx-auto opacity-50" />
          <h3 className="text-4xl md:text-5xl font-serif text-white italic">Experience the Hidden.</h3>
          <p className="text-white/40 font-light leading-relaxed">Our lifestyle managers ensure that every second of your stay in {villa.name} is orchestrated with absolute precision.</p>
          <button 
            onClick={() => {
              const el = document.getElementById('contact');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-luxury-gold text-luxury-blue px-14 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl hover:scale-105"
          >
            {t.inquire}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VillaDetailPage;
