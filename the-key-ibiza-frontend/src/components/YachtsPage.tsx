
import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../types';
import FooterSEO from './FooterSEO';

interface YachtsPageProps {
  onNavigate: (view: string) => void;
  lang: Language;
}

// Yacht data interface matching backend API
interface Yacht {
  id: number;
  name: string;
  paxMax: number;
  amarre: string;
  price: number;
  metros: number;
  location: string;
  image: string;
  description: string;
}

// Backend URL
const BACKEND_URL = 'http://localhost:5001';

const YachtsPage: React.FC<YachtsPageProps> = ({ onNavigate, lang }) => {
  const [yachtsData, setYachtsData] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    fecha: '',
    paxMax: 0,
    amarre: 'All',
    priceMax: 0,
    metros: 'All',
    localidad: 'All'
  });

  // Fetch yachts from backend
  useEffect(() => {
    const fetchYachts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/yachts`);
        const json = await res.json();
        if (json.data) {
          setYachtsData(json.data);
        }
      } catch (error) {
        console.error('Error fetching yachts:', error);
      }
      setLoading(false);
    };
    fetchYachts();
  }, []);

  // Get unique amarres from yachts data
  const uniqueAmarres = useMemo(() => {
    const amarres = new Set(yachtsData.map(y => y.amarre).filter(Boolean));
    if (amarres.size === 0) return ['All'];
    return ['All', ...Array.from(amarres)];
  }, [yachtsData]);

  // Get unique locations from yachts data
  const uniqueLocations = useMemo(() => {
    const locations = new Set(yachtsData.map(y => y.location).filter(Boolean));
    if (locations.size === 0) return ['All', 'Ibiza'];
    return ['All', ...Array.from(locations)];
  }, [yachtsData]);

  // Meter ranges
  const meterRanges = [
    { value: 'All', label: 'All Sizes' },
    { value: '0-10', label: '< 10m' },
    { value: '10-15', label: '10 - 15m' },
    { value: '15-20', label: '15 - 20m' },
    { value: '20-30', label: '20 - 30m' },
    { value: '30+', label: '> 30m' }
  ];

  // Filter yachts based on search criteria
  const filteredYachts = useMemo(() => {
    return yachtsData.filter(yacht => {
      const matchPax = searchFilters.paxMax === 0 || yacht.paxMax >= searchFilters.paxMax;
      const matchAmarre = searchFilters.amarre === 'All' || yacht.amarre === searchFilters.amarre;
      const matchPrice = searchFilters.priceMax === 0 || yacht.price <= searchFilters.priceMax;
      const matchLocation = searchFilters.localidad === 'All' || yacht.location === searchFilters.localidad;

      // Meter range filter
      let matchMeters = true;
      if (searchFilters.metros !== 'All') {
        if (searchFilters.metros === '30+') {
          matchMeters = yacht.metros >= 30;
        } else if (searchFilters.metros === '0-10') {
          matchMeters = yacht.metros < 10;
        } else {
          const [min, max] = searchFilters.metros.split('-').map(Number);
          matchMeters = yacht.metros >= min && yacht.metros < max;
        }
      }

      return matchPax && matchAmarre && matchPrice && matchLocation && matchMeters;
    });
  }, [searchFilters, yachtsData]);

  return (
    <div className="pt-40 pb-12" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-6">
            Maritime Excellence
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none mb-6">
            Luxury Yachts
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto">
            Experience the Mediterranean in unparalleled style aboard our exclusive selection of luxury yachts
          </p>
        </div>

        {/* Search Filter Panel */}
        <div className="mb-16 md:mb-20">
          <div className="luxury-card p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-white/5 bg-luxury-blue/40">

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Fecha */}
                <div className="relative">
                  <input
                    type="date"
                    value={searchFilters.fecha}
                    onChange={(e) => setSearchFilters({...searchFilters, fecha: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1">Fecha</span>
                </div>
                {/* Pax Max */}
                <div className="relative">
                  <select
                    value={searchFilters.paxMax}
                    onChange={(e) => setSearchFilters({...searchFilters, paxMax: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    <option value={0} className="bg-luxury-blue">Any</option>
                    {[2, 4, 6, 8, 10, 12, 15, 20, 30].map(n => (
                      <option key={n} value={n} className="bg-luxury-blue">{n}+ pax</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1">Pax Max</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Amarre */}
                <div className="relative">
                  <select
                    value={searchFilters.amarre}
                    onChange={(e) => setSearchFilters({...searchFilters, amarre: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {uniqueAmarres.map(a => (
                      <option key={a} value={a} className="bg-luxury-blue">{a === 'All' ? 'All Moorings' : a}</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1">Amarre</span>
                </div>
                {/* Price Max */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Max €"
                    value={searchFilters.priceMax || ''}
                    onChange={(e) => setSearchFilters({...searchFilters, priceMax: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1">Price Max</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Metros */}
                <div className="relative">
                  <select
                    value={searchFilters.metros}
                    onChange={(e) => setSearchFilters({...searchFilters, metros: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {meterRanges.map(r => (
                      <option key={r.value} value={r.value} className="bg-luxury-blue">{r.label}</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1">Metros</span>
                </div>
                {/* Localidad */}
                <div className="relative">
                  <select
                    value={searchFilters.localidad}
                    onChange={(e) => setSearchFilters({...searchFilters, localidad: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {uniqueLocations.map(l => (
                      <option key={l} value={l} className="bg-luxury-blue">{l === 'All' ? 'All Locations' : l}</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1">Localidad</span>
                </div>
              </div>
              {/* Search Button */}
              <button
                className="w-full py-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all bg-luxury-gold text-luxury-blue border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold"
              >
                Search Yachts
              </button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                {/* Fecha */}
                <div className="relative">
                  <input
                    type="date"
                    value={searchFilters.fecha}
                    onChange={(e) => setSearchFilters({...searchFilters, fecha: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1.5">Fecha</span>
                </div>
                {/* Pax Max */}
                <div className="relative">
                  <select
                    value={searchFilters.paxMax}
                    onChange={(e) => setSearchFilters({...searchFilters, paxMax: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    <option value={0} className="bg-luxury-blue">Any</option>
                    {[2, 4, 6, 8, 10, 12, 15, 20, 30].map(n => (
                      <option key={n} value={n} className="bg-luxury-blue">{n}+ passengers</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1.5">Pax Max</span>
                </div>
                {/* Amarre */}
                <div className="relative">
                  <select
                    value={searchFilters.amarre}
                    onChange={(e) => setSearchFilters({...searchFilters, amarre: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {uniqueAmarres.map(a => (
                      <option key={a} value={a} className="bg-luxury-blue">{a === 'All' ? 'All Moorings' : a}</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1.5">Amarre</span>
                </div>
                {/* Price Max */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Max €/day"
                    value={searchFilters.priceMax || ''}
                    onChange={(e) => setSearchFilters({...searchFilters, priceMax: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1.5">Price Max</span>
                </div>
                {/* Metros */}
                <div className="relative">
                  <select
                    value={searchFilters.metros}
                    onChange={(e) => setSearchFilters({...searchFilters, metros: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {meterRanges.map(r => (
                      <option key={r.value} value={r.value} className="bg-luxury-blue">{r.label}</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1.5">Metros</span>
                </div>
                {/* Localidad */}
                <div className="relative">
                  <select
                    value={searchFilters.localidad}
                    onChange={(e) => setSearchFilters({...searchFilters, localidad: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {uniqueLocations.map(l => (
                      <option key={l} value={l} className="bg-luxury-blue">{l === 'All' ? 'All Locations' : l}</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#0B1C26] px-1.5">Localidad</span>
                </div>
              </div>
              {/* Bottom row with buttons */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">
                  <span className="text-luxury-gold font-medium">{filteredYachts.length}</span>
                  <span className="mx-1">/</span>
                  <span>{yachtsData.length}</span>
                  <span className="ml-1">yachts available</span>
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSearchFilters({ fecha: '', paxMax: 0, amarre: 'All', priceMax: 0, metros: 'All', localidad: 'All' })}
                    className="px-6 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-medium transition-all border border-white/10 text-white/40 hover:text-white hover:border-white/30"
                  >
                    Clear
                  </button>
                  <button
                    className="px-8 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-medium transition-all bg-luxury-gold text-luxury-blue border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold"
                  >
                    Search Yachts
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 mb-20">
            <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/40 text-sm">Loading yachts...</p>
          </div>
        ) : filteredYachts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredYachts.map(yacht => (
              <div
                key={yacht.id}
                className="group luxury-card rounded-[24px] overflow-hidden border border-white/5 hover:border-luxury-gold/20 transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={yacht.image || 'https://res.cloudinary.com/drxf80sho/image/upload/v1770384558/yacht-placeholder.jpg'}
                    alt={yacht.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-serif text-white mb-1">{yacht.name}</h3>
                    <p className="text-luxury-gold text-sm">{yacht.metros}m | {yacht.paxMax} pax</p>
                  </div>
                </div>
                <div className="p-5 bg-luxury-slate/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/50 text-xs">{yacht.amarre || yacht.location}</span>
                    <span className="text-luxury-gold font-medium">€{yacht.price.toLocaleString()}/day</span>
                  </div>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full py-3 rounded-full bg-luxury-gold text-luxury-blue border border-luxury-gold text-[9px] uppercase tracking-[0.2em] font-medium hover:bg-luxury-blue hover:text-luxury-gold transition-all"
                  >
                    Inquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 mb-20">
            <div className="w-24 h-px bg-luxury-gold/30 mx-auto mb-8"></div>
            <p className="text-white/40 text-lg font-serif italic mb-4">Coming Soon</p>
            <p className="text-white/30 text-sm max-w-md mx-auto">
              Our exclusive yacht collection is being curated. Contact us directly for charter inquiries.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="mt-8 px-8 py-3 rounded-full bg-luxury-gold text-luxury-blue border border-luxury-gold text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-luxury-blue hover:text-luxury-gold transition-all duration-500"
            >
              Contact Us
            </button>
          </div>
        )}

        <FooterSEO
          onNavigate={onNavigate}
          lang={lang}
          title="Luxury Yacht Charters in Ibiza & Formentera"
          description="The Key Ibiza offers an exceptional fleet of luxury yachts for private charter. Whether you're planning a sunset cruise, a day trip to Formentera's pristine beaches, or an extended voyage through the Balearic Islands, our maritime concierge service ensures every detail is perfected."
          links={[
            { label: "Catamarans", view: 'boats-catamarans' },
            { label: "Luxury Villas", view: 'villas-holiday' },
            { label: "VIP Services", view: 'services' },
            { label: "Contact Us", view: 'contact' },
            { label: "Back to Home", view: 'home' }
          ]}
        />
      </div>
    </div>
  );
};

export default YachtsPage;
