
import React, { useEffect, useState, useMemo } from 'react';
import { getVillas } from '../constants';
import VillaCard from './VillaCard';
import FooterSEO from './FooterSEO';
import { Language, Villa } from '../types';
import { translations } from '../translations';

interface VillaListingPageProps {
  category: string;
  onNavigate: (view: any) => void;
  lang: Language;
}

const AMENITIES = ["Sea View", "Tennis Court", "Sea Access", "Jacuzzi", "Gym", "Staff included"];

const VillaListingPage: React.FC<VillaListingPageProps> = ({ category, onNavigate, lang }) => {
  const VILLAS = getVillas(lang);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    category: 'All',
    minBedrooms: 0,
    minGuests: 0,
    location: 'All',
    minPrice: 0,
    maxPrice: 200000,
    selectedAmenities: [] as string[]
  });

  const listingType = useMemo(() => {
    if (category === 'villas-holiday') return 'holiday';
    if (category === 'villas-longterm') return 'longterm';
    if (category === 'villas-sale') return 'sale';
    return 'holiday';
  }, [category]);

  const villasOfType = useMemo(() => {
    return VILLAS.filter(v => v.listingType === listingType);
  }, [VILLAS, listingType]);

  const uniqueLocations = useMemo(() => {
    return ['All', ...Array.from(new Set(villasOfType.map(v => v.location)))];
  }, [villasOfType]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const getTitle = () => {
    switch (category) {
      case 'villas-holiday': return lang === 'en' ? 'Holiday Rentals' : (lang === 'es' ? 'Alquiler Vacacional' : 'Location Saisonnière');
      case 'villas-longterm': return lang === 'en' ? 'Long-term Stays' : (lang === 'es' ? 'Larga Estancia' : 'Longue Durée');
      case 'villas-sale': return lang === 'en' ? 'Properties for Sale' : (lang === 'es' ? 'Propiedades en Venta' : 'Propriétés à Vendre');
      default: return 'Villa Collection';
    }
  };

  const filteredVillas = useMemo(() => {
    return villasOfType.filter(v => {
      const matchCat = searchFilters.category === 'All' || v.category === searchFilters.category;
      const matchBeds = v.bedrooms >= searchFilters.minBedrooms;
      const matchGuests = (v.maxGuests || 0) >= searchFilters.minGuests;
      const matchLoc = searchFilters.location === 'All' || v.location === searchFilters.location;
      const matchPrice = (v.numericPrice || 0) >= searchFilters.minPrice && (v.numericPrice || 0) <= searchFilters.maxPrice;
      
      const matchAmenities = searchFilters.selectedAmenities.every(amenity => 
        v.features?.some(f => f.toLowerCase() === amenity.toLowerCase())
      );
      
      return matchCat && matchBeds && matchGuests && matchLoc && matchPrice && matchAmenities;
    });
  }, [searchFilters, villasOfType]);

  const toggleAmenity = (amenity: string) => {
    setSearchFilters(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter(a => a !== amenity)
        : [...prev.selectedAmenities, amenity]
    }));
  };

  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10 animate-slide-up">
          <div className="space-y-6">
            <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic">Privilege Portfolio</span>
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-none">{getTitle()}</h1>
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-4 px-10 py-5 rounded-full border transition-all uppercase tracking-widest text-[10px] font-bold ${isFilterOpen ? 'bg-luxury-gold text-luxury-blue border-luxury-gold shadow-[0_0_30px_rgba(196,164,97,0.3)]' : 'border-white/10 text-white/60 hover:border-white/30'}`}
          >
            <span>{isFilterOpen ? (lang === 'en' ? 'Close Filters' : (lang === 'es' ? 'Cerrar Filtros' : 'Fermer')) : (lang === 'en' ? 'Search & Filter' : (lang === 'es' ? 'Buscar y Filtrar' : 'Filtrer'))}</span>
            <svg className={`w-4 h-4 transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>

        {/* Advanced Filter Panel */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isFilterOpen ? 'max-h-[1000px] mb-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="luxury-card p-12 md:p-16 rounded-[60px] border border-white/5 space-y-12 bg-luxury-blue/40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Architectural Style</label>
                <select 
                  value={searchFilters.category}
                  onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                >
                  {['All', 'Modern', 'Traditional', 'Cliffs', 'Beachfront'].map((c: string) => <option key={c} value={c} className="bg-luxury-blue">{c}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Island Region</label>
                <select 
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                >
                  {uniqueLocations.map((l: string) => <option key={l} value={l} className="bg-luxury-blue">{l}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Capacity</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number"
                    placeholder="Beds+"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                    onChange={(e) => setSearchFilters({...searchFilters, minBedrooms: parseInt(e.target.value) || 0})}
                  />
                  <input 
                    type="number"
                    placeholder="Guests+"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                    onChange={(e) => setSearchFilters({...searchFilters, minGuests: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Weekly Budget</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number"
                    placeholder="Min €"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                    onChange={(e) => setSearchFilters({...searchFilters, minPrice: parseInt(e.target.value) || 0})}
                  />
                  <input 
                    type="number"
                    placeholder="Max €"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                    onChange={(e) => setSearchFilters({...searchFilters, maxPrice: parseInt(e.target.value) || 1000000})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6 pt-8 border-t border-white/5">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-4">Exclusive Features</label>
              <div className="flex flex-wrap gap-4">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${searchFilters.selectedAmenities.includes(amenity) ? 'bg-luxury-gold text-luxury-blue border-luxury-gold shadow-lg shadow-luxury-gold/20' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 animate-fade-in">
          {filteredVillas.map(villa => (
            <VillaCard key={villa.id} villa={villa} onNavigate={onNavigate} lang={lang} />
          ))}
        </div>

        {filteredVillas.length === 0 && (
          <div className="py-48 text-center space-y-10 animate-fade-in">
            <div className="w-24 h-px bg-luxury-gold/30 mx-auto"></div>
            <p className="text-white/20 font-serif italic text-4xl">No property matches your exact criteria.</p>
            <p className="text-white/40 font-light max-w-xl mx-auto leading-relaxed">Our portfolio includes confidential off-market residences. Please reach out to our lifestyle managers for a bespoke selection tailored to your needs.</p>
          </div>
        )}

        <FooterSEO 
          onNavigate={onNavigate} 
          lang={lang}
          title={lang === 'es' ? "Especialistas en Real Estate de Lujo e Inversión Inmobiliaria en Ibiza" : "Ibiza Luxury Real Estate & Property Investment Specialists"}
          description={lang === 'es' ? 
            "Descubra el portfolio más exclusivo de alquileres vacacionales de lujo y propiedades en venta en Ibiza, cuidadosamente seleccionado por The Key. Nuestra división de Real Estate se especializa en activos inmobiliarios de alta gama, desde fincas tradicionales del siglo XVIII meticulosamente restauradas con materiales nobles, hasta villas minimalistas de vanguardia arquitectónica con vistas panorámicas a Es Vedrà, Formentera y el mar Mediterráneo. Entendemos que la adquisición o el alquiler de una villa de lujo en Ibiza es una decisión estratégica de estilo de vida; por ello, proporcionamos acceso privilegiado a listados 'off-market' y residencias confidenciales que no se encuentran en los portales públicos convencionales. Ya sea que busque una residencia en primera línea de mar en Cala Jondal, una propiedad icónica en Es Cubells o un refugio privado de diseño en las colinas de San José, nuestro equipo de expertos consultores le guiará en cada fase de la inversión inmobiliaria, asegurando una gestión impecable, segura y discreta en todas las Islas Baleares." : 
            "Discover the most exclusive portfolio of luxury holiday rentals and properties for sale in Ibiza, carefully curated by The Key. Our Real Estate division specializes in high-end property assets, from meticulously restored 18th-century traditional fincas using noble materials to cutting-edge minimalist villas with panoramic views of Es Vedrà, Formentera, and the Mediterranean Sea. We understand that acquiring or renting a luxury villa in Ibiza is a strategic lifestyle decision; therefore, we provide privileged access to off-market listings and confidential residences not found on conventional public portals. Whether you are seeking a frontline sea residence in Cala Jondal, an iconic property in Es Cubells, or a private designer retreat in the San José hills, our team of expert consultants will guide you through every phase of real estate investment, ensuring flawless, secure, and discreet management throughout the Balearic Islands."}
          links={[
            { label: "VIP Concierge Services", view: 'services' },
            { label: "Yacht Charters Ibiza", view: 'service-yacht' },
            { label: "Wellness & Yoga Vision", view: 'service-wellness' },
            { label: "Contact our Property Managers", view: 'contact' },
            { label: "Back to Home", view: 'home' }
          ]}
        />
      </div>
    </div>
  );
};

export default VillaListingPage;
