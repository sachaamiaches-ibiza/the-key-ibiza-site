
import React, { useEffect, useState, useMemo, useRef } from 'react';
import VillaCard from './VillaCard';
import FooterSEO from './FooterSEO';
import { Language, Villa } from '../types';

interface VillaListingPageProps {
  category: string;
  onNavigate: (view: any) => void;
  lang: Language;
  villas?: Villa[];
}

// Calculate price for a specific period based on seasonal prices
const calculatePriceForPeriod = (villa: Villa, checkIn: string, checkOut: string): number | null => {
  if (!checkIn || !checkOut) return null;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  if (totalNights <= 0) return null;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthlyPrices: { [monthIndex: number]: number } = {};

  // Build monthly prices map from seasonal prices
  villa.seasonalPrices?.forEach(sp => {
    const monthKey = monthNames.find(m => sp.month.includes(m));
    if (monthKey) {
      const monthIdx = monthNames.indexOf(monthKey);
      const price = parseInt(sp.price.replace(/[^\d]/g, '')) || villa.numericPrice || 15000;
      monthlyPrices[monthIdx] = price;
    }
  });

  const defaultWeeklyPrice = villa.numericPrice || 15000;
  let total = 0;

  // Calculate price per night based on month
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const monthIdx = d.getMonth();
    const weeklyRate = monthlyPrices[monthIdx] || defaultWeeklyPrice;
    total += weeklyRate / 7; // Daily rate
  }

  return Math.round(total);
};

const VillaListingPage: React.FC<VillaListingPageProps> = ({ category, onNavigate, lang, villas = [] }) => {
  const VILLAS = villas;
  const checkOutRef = useRef<HTMLInputElement>(null);
  const checkOutMobileRef = useRef<HTMLInputElement>(null);

  const [searchFilters, setSearchFilters] = useState({
    checkIn: '',
    checkOut: '',
    minBedrooms: 0,
    minPrice: 0,
    maxPrice: 200000,
    location: 'All',
    searchText: '',
    selectedAmenities: [] as string[]
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

  // Get all unique amenities from villas automatically
  const allAmenities = useMemo(() => {
    const amenitiesSet = new Set<string>();
    villasOfType.forEach(villa => {
      villa.features?.forEach((feature: string) => amenitiesSet.add(feature));
    });
    return Array.from(amenitiesSet).sort();
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
    const filtered = villasOfType.filter(v => {
      const matchBeds = v.bedrooms >= searchFilters.minBedrooms;
      const matchLoc = searchFilters.location === 'All' || v.location === searchFilters.location;
      const matchPrice = (v.numericPrice || 0) >= searchFilters.minPrice &&
        (searchFilters.maxPrice === 0 || (v.numericPrice || 0) <= searchFilters.maxPrice);

      // Text/name search
      const searchLower = searchFilters.searchText.toLowerCase();
      const matchSearch = !searchFilters.searchText ||
        v.name.toLowerCase().includes(searchLower) ||
        v.location.toLowerCase().includes(searchLower) ||
        v.shortDescription?.toLowerCase().includes(searchLower);

      // Amenities filter
      const matchAmenities = searchFilters.selectedAmenities.length === 0 ||
        searchFilters.selectedAmenities.every(amenity =>
          v.features?.some((f: string) => f.toLowerCase() === amenity.toLowerCase())
        );

      // Availability check will be implemented with calendar integration
      const matchAvailability = true; // TODO: Connect to calendar availability

      return matchBeds && matchLoc && matchPrice && matchSearch && matchAmenities && matchAvailability;
    });

    // Sort by calculated price when dates are selected
    if (searchFilters.checkIn && searchFilters.checkOut) {
      filtered.sort((a, b) => {
        const priceA = calculatePriceForPeriod(a, searchFilters.checkIn, searchFilters.checkOut) || 0;
        const priceB = calculatePriceForPeriod(b, searchFilters.checkIn, searchFilters.checkOut) || 0;
        return priceA - priceB;
      });
    }

    return filtered;
  }, [searchFilters, villasOfType]);

  const toggleAmenity = (amenity: string) => {
    setSearchFilters(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter(a => a !== amenity)
        : [...prev.selectedAmenities, amenity]
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      checkIn: '',
      checkOut: '',
      minBedrooms: 0,
      minPrice: 0,
      maxPrice: 200000,
      location: 'All',
      searchText: '',
      selectedAmenities: []
    });
    setIsFiltersOpen(false);
  };

  return (
    <div className="pt-40 pb-4" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-6">Privilege Portfolio</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none">{getTitle()}</h1>
        </div>

        {/* Search Filter Panel */}
        <div className="mb-10 md:mb-14 relative z-[1000]">
          <div className="luxury-card p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-white/5 bg-luxury-blue/40">

            {/* === MOBILE LAYOUT (< md) === */}
            <div className="md:hidden space-y-3">
              {/* Row 1: Date From | Date To */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="date"
                    value={searchFilters.checkIn}
                    onChange={(e) => {
                      setSearchFilters({...searchFilters, checkIn: e.target.value});
                      // Auto-open checkout calendar after selecting check-in
                      setTimeout(() => checkOutMobileRef.current?.showPicker?.(), 100);
                    }}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1">Date From</span>
                </div>
                <div className="relative">
                  <input
                    ref={checkOutMobileRef}
                    type="date"
                    value={searchFilters.checkOut}
                    min={searchFilters.checkIn}
                    onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1">Date To</span>
                </div>
              </div>

              {/* Row 2: Bedrooms | Price From */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={searchFilters.minBedrooms}
                    onChange={(e) => setSearchFilters({...searchFilters, minBedrooms: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    <option value={0} className="bg-luxury-blue">Any</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n} className="bg-luxury-blue">{n}+</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1">Bedrooms</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="€ / Week"
                    value={searchFilters.minPrice || ''}
                    onChange={(e) => setSearchFilters({...searchFilters, minPrice: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1">Price From</span>
                </div>
              </div>

              {/* Row 3: Price To | Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="€ / Week"
                    value={searchFilters.maxPrice === 200000 ? '' : searchFilters.maxPrice}
                    onChange={(e) => setSearchFilters({...searchFilters, maxPrice: parseInt(e.target.value) || 200000})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1">Price To</span>
                </div>
                <div className="relative">
                  <select
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {uniqueLocations.map((l: string) => <option key={l} value={l} className="bg-luxury-blue">{l === 'All' ? 'All Locations' : l}</option>)}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1">Location</span>
                </div>
              </div>

              {/* Row 4: Full Text Search (full width) */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search villa name..."
                  value={searchFilters.searchText}
                  onChange={(e) => setSearchFilters({...searchFilters, searchText: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1">Search</span>
              </div>

              {/* Row 5: Filters + Numbering */}
              <div className="flex items-center justify-between gap-2">
                {/* Filters dropdown button */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest font-medium transition-all border ${isFiltersOpen || searchFilters.selectedAmenities.length > 0 ? 'border-luxury-gold/50 text-luxury-gold' : 'border-white/10 text-white/40'}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    <span>Filters</span>
                    {searchFilters.selectedAmenities.length > 0 && (
                      <>
                        <span className="bg-luxury-gold text-luxury-blue text-[8px] px-1.5 py-0.5 rounded-full font-bold">{searchFilters.selectedAmenities.length}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSearchFilters({...searchFilters, selectedAmenities: []}); }}
                          className="ml-1 text-luxury-gold hover:text-white"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </>
                    )}
                  </button>
                  {/* Mobile Filters Dropdown */}
                  {isFiltersOpen && (
                    <div className="absolute bottom-full left-0 mb-2 z-[999] w-[220px] bg-[#0A0E14] border border-white/10 rounded-2xl p-3 shadow-2xl">
                      <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-2">Amenities</p>
                      <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
                        {allAmenities.map((amenity: string) => (
                          <button
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={`flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-[9px] transition-all border ${searchFilters.selectedAmenities.includes(amenity) ? 'bg-luxury-gold text-luxury-blue border-luxury-gold font-medium' : 'border-white/10 text-white/50'}`}
                          >
                            <span className="truncate">{amenity}</span>
                            {searchFilters.selectedAmenities.includes(amenity) && (
                              <svg className="w-2.5 h-2.5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Villa count - left aligned */}
                <span className="text-[10px] text-white/40">
                  <span className="text-luxury-gold font-medium">{filteredVillas.length}</span>
                  <span className="mx-1">/</span>
                  <span>{villasOfType.length}</span>
                  <span className="ml-1">villas</span>
                </span>
              </div>

              {/* Row 6: Search button (full width) */}
              <button
                className="w-full py-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all bg-luxury-gold text-luxury-blue hover:bg-white"
              >
                Search
              </button>
            </div>

            {/* === TABLET & DESKTOP LAYOUT (>= md) === */}
            <div className="hidden md:block">
              <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
                <div className="relative">
                  <input
                    type="date"
                    value={searchFilters.checkIn}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchFilters({...searchFilters, checkIn: e.target.value});
                      // Auto-open checkout calendar after selecting check-in
                      setTimeout(() => checkOutRef.current?.showPicker?.(), 100);
                    }}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1.5">Check-in</span>
                </div>
                <div className="relative">
                  <input
                    ref={checkOutRef}
                    type="date"
                    value={searchFilters.checkOut}
                    min={searchFilters.checkIn}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1.5">Check-out</span>
                </div>
                <div className="relative">
                  <select
                    value={searchFilters.minBedrooms}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchFilters({...searchFilters, minBedrooms: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    <option value={0} className="bg-luxury-blue">Any</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n} className="bg-luxury-blue">{n}+</option>
                    ))}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1.5">Bedrooms</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Min"
                    value={searchFilters.minPrice || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilters({...searchFilters, minPrice: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1.5">Price From</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Max"
                    value={searchFilters.maxPrice === 200000 ? '' : searchFilters.maxPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilters({...searchFilters, maxPrice: parseInt(e.target.value) || 200000})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1.5">Price Till</span>
                </div>
                <div className="relative">
                  <select
                    value={searchFilters.location}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchFilters({...searchFilters, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors appearance-none cursor-pointer"
                  >
                    {uniqueLocations.map((l: string) => <option key={l} value={l} className="bg-luxury-blue">{l === 'All' ? 'All Locations' : l}</option>)}
                  </select>
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1.5">Location</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Villa name..."
                    value={searchFilters.searchText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilters({...searchFilters, searchText: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                  />
                  <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40 bg-[#141B24] px-1.5">Search</span>
                </div>
              </div>
              {/* Buttons row for tablet/desktop */}
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  {/* Filters dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-medium transition-all border ${isFiltersOpen || searchFilters.selectedAmenities.length > 0 ? 'border-luxury-gold/50 text-luxury-gold' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                      <span>Filters</span>
                      {searchFilters.selectedAmenities.length > 0 && (
                        <>
                          <span className="bg-luxury-gold text-luxury-blue text-[8px] px-1.5 py-0.5 rounded-full font-bold">{searchFilters.selectedAmenities.length}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSearchFilters({...searchFilters, selectedAmenities: []}); }}
                            className="ml-1 text-luxury-gold hover:text-white"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </>
                      )}
                      <svg className={`w-3 h-3 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {isFiltersOpen && (
                      <div className="absolute top-full left-0 mt-2 z-[999] min-w-[280px] bg-[#0A0E14] border border-white/10 rounded-2xl p-4 shadow-2xl">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-3">Amenities</p>
                        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                          {allAmenities.map((amenity: string) => (
                            <button
                              key={amenity}
                              onClick={() => toggleAmenity(amenity)}
                              className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-[10px] transition-all border ${searchFilters.selectedAmenities.includes(amenity) ? 'bg-luxury-gold text-luxury-blue border-luxury-gold font-medium' : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'}`}
                            >
                              <span>{amenity}</span>
                              {searchFilters.selectedAmenities.includes(amenity) && (
                                <svg className="w-3 h-3 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                              )}
                            </button>
                          ))}
                        </div>
                        {allAmenities.length === 0 && (
                          <p className="text-white/30 text-xs italic">No amenities available</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Villa count */}
                  <span className="text-xs text-white/40">
                    <span className="text-luxury-gold font-medium">{filteredVillas.length}</span>
                    <span className="mx-1">/</span>
                    <span>{villasOfType.length}</span>
                    <span className="ml-1">villas</span>
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-medium transition-all border border-white/10 text-white/40 hover:text-white hover:border-white/30"
                  >
                    Clear
                  </button>
                  <button
                    className="px-8 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-medium transition-all bg-luxury-gold text-luxury-blue hover:bg-white"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 animate-fade-in">
          {filteredVillas.map(villa => (
            <VillaCard
              key={villa.id}
              villa={villa}
              onNavigate={onNavigate}
              lang={lang}
              calculatedPrice={calculatePriceForPeriod(villa, searchFilters.checkIn, searchFilters.checkOut)}
              hasDateRange={!!(searchFilters.checkIn && searchFilters.checkOut)}
            />
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
