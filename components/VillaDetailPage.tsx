
import React, { useEffect, useState } from 'react';
import { Villa, Language } from '../types';
import { translations } from '../translations';
import { LogoTheKey } from './Navbar';
import VillaMap from './VillaMap';

interface VillaDetailPageProps {
  villa: Villa;
  onNavigate: (view: any) => void;
  lang: Language;
}

// Helper function to render text with formatting from Google Docs
const renderFormattedText = (text: string) => {
  // Split by \n for paragraphs, then parse ** for bold
  const paragraphs = text.split('\n').filter(p => p.trim());

  return paragraphs.map((paragraph, pIdx) => {
    // Check if paragraph starts with bullet point indicators
    const isBullet = paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-');

    // Parse **text** for bold/gold highlighting
    const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={idx} className="text-luxury-gold font-medium">{boldText}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return <p key={pIdx} className="mb-2 pl-4">{rendered}</p>;
    }

    return <p key={pIdx} className="mb-5 last:mb-0">{rendered}</p>;
  });
};

const VillaDetailPage: React.FC<VillaDetailPageProps> = ({ villa, onNavigate, lang }) => {
  const t = translations[lang].villa;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');

  // Use headerImages for slideshow (from CSV), fallback to imageUrl
  // Filter out any empty or invalid URLs to prevent rendering issues
  const slideshowImages = (villa.headerImages && villa.headerImages.length > 0
    ? villa.headerImages
    : [villa.imageUrl]).filter(img => img && img.trim().length > 0);

  // Use gallery images for the gallery section
  const allGalleryImages = villa.gallery || [];

  // Use occupied dates from villa data (from CSV) or default to empty
  const occupiedDates = villa.occupiedDates || [];

  // Reviews with Google Verified flag
  const reviews = [
    { name: 'James H.', rating: 5, text: 'Absolutely stunning villa with breathtaking views. The Key team was exceptional.', date: 'August 2024', isGoogleVerified: true },
    { name: 'Sophie M.', rating: 5, text: 'Perfect location and impeccable service. We will definitely return.', date: 'July 2024', isGoogleVerified: true },
    { name: 'Marco R.', rating: 5, text: 'An unforgettable experience. Every detail was taken care of.', date: 'June 2024', isGoogleVerified: false },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const imageCount = slideshowImages.length;
    if (imageCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageCount);
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideshowImages.length]);

  const monthNameToIndex: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11,
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };

  const calculatePriceBreakdown = () => {
    if (!checkIn || !checkOut) return null;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (totalNights <= 0) return null;

    // Group nights by month and calculate prices
    const nightsByMonth: { [key: string]: number } = {};
    const priceByMonth: { [key: string]: number } = {};

    // Build a map of monthly prices from seasonalPrices
    const monthlyPrices: { [monthIndex: number]: number } = {};
    villa.seasonalPrices?.forEach(sp => {
      // Parse month name to get index
      const monthKey = Object.keys(monthNameToIndex).find(m => sp.month.includes(m));
      if (monthKey) {
        const monthIdx = monthNameToIndex[monthKey];
        const price = parseInt(sp.price.replace(/[^\d]/g, '')) || villa.numericPrice || 15000;
        monthlyPrices[monthIdx] = price;
      }
    });

    // Default price if no seasonal prices
    const defaultWeeklyPrice = villa.numericPrice || 15000;

    // Count nights per month
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const monthIdx = d.getMonth();
      const monthName = monthNames[monthIdx];
      nightsByMonth[monthName] = (nightsByMonth[monthName] || 0) + 1;
      priceByMonth[monthName] = monthlyPrices[monthIdx] || defaultWeeklyPrice;
    }

    // Calculate breakdown
    const breakdown: { month: string; nights: number; weeklyRate: number; subtotal: number }[] = [];
    let total = 0;

    Object.keys(nightsByMonth).forEach(month => {
      const nights = nightsByMonth[month];
      const weeklyRate = priceByMonth[month];
      const subtotal = Math.round((nights / 7) * weeklyRate);
      total += subtotal;
      breakdown.push({ month, nights, weeklyRate, subtotal });
    });

    return { totalNights, breakdown, total };
  };

  const calculatePrice = () => {
    const result = calculatePriceBreakdown();
    return result ? result.total : null;
  };

  const isDateOccupied = (dateStr: string) => occupiedDates.includes(dateStr);

  const isRangeAvailable = () => {
    if (!checkIn || !checkOut) return true;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (isDateOccupied(dateStr)) return false;
    }
    return true;
  };

  const generateCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const checkDateOccupied = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return occupiedDates.includes(dateStr);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Extract min/max prices
  const priceNumbers = villa.seasonalPrices?.map(sp => parseInt(sp.price.replace(/[^\d]/g, ''))) || [villa.numericPrice || 15000];
  const minPrice = Math.min(...priceNumbers);
  const maxPrice = Math.max(...priceNumbers);

  return (
    <div style={{ backgroundColor: '#0B1C26' }}>
      {/* ===== 1️⃣ HEADER (DO NOT MODIFY) ===== */}
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        {slideshowImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <img src={img} alt={`${villa.name} - ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C26]/60 via-transparent to-[#0B1C26]"></div>
          </div>
        ))}
        {slideshowImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slideshowImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 rounded-full h-[3px] ${currentSlide === index ? 'w-6 bg-luxury-gold' : 'w-2 bg-luxury-gold/30'}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* ===== END HEADER ===== */}

      <div className="container mx-auto px-6 lg:px-16 xl:px-24 pb-24">

        {/* ===== 2️⃣ FIRST HORIZONTAL LINE: Name + Price Range ===== */}
        <div className="flex items-end justify-between py-10 border-b border-white/5">
          <div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white">{villa.name}</h1>
            {villa.location && (
              <p className="text-white/40 text-sm md:text-base mt-2 font-light">{villa.location}</p>
            )}
          </div>
          <div className="text-right">
            <span className="text-lg md:text-2xl font-serif text-luxury-gold whitespace-nowrap">
              {minPrice.toLocaleString()}€ - {maxPrice.toLocaleString()}€
            </span>
            <p className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.25em] mt-1 font-light">week</p>
          </div>
        </div>

        {/* ===== 3️⃣ SECOND HORIZONTAL LINE: Description + Date Picker ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-16">
          {/* Left: Description */}
          <div className="text-white/65 text-base md:text-lg font-light leading-relaxed">
            {villa.fullDescription?.map((p, i) => (
              <div key={i} className="mb-6 last:mb-0">
                {renderFormattedText(p)}
              </div>
            ))}
          </div>

          {/* Right: Date Picker */}
          <div
            className="p-6 md:p-8 lg:p-10 rounded-[24px] md:rounded-[32px] border border-white/8 shadow-xl mx-auto w-full max-w-md lg:max-w-none"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
          >
            <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide text-center">Select Your Dates</h3>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-6 md:mb-8 justify-center items-center">
              <div className="w-full sm:w-auto sm:flex-1 max-w-[200px]">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/35 mb-2 md:mb-3 block font-medium text-center">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  className="w-full bg-white/4 border border-white/8 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-white text-sm focus:outline-none focus:border-luxury-gold/50 transition-colors cursor-pointer text-center"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div className="w-full sm:w-auto sm:flex-1 max-w-[200px]">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/35 mb-2 md:mb-3 block font-medium text-center">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  className="w-full bg-white/4 border border-white/8 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-white text-sm focus:outline-none focus:border-luxury-gold/50 transition-colors cursor-pointer text-center"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {checkIn && checkOut && !isRangeAvailable() && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm text-center">
                Selected dates are not available. Please choose different dates.
              </div>
            )}

            {!checkIn || !checkOut ? (
              <p className="text-white/40 text-xs md:text-sm text-center italic px-2">
                Select your dates and we will calculate the total for the indicated period.
              </p>
            ) : calculatePriceBreakdown() && isRangeAvailable() ? (
              <div className="border-t border-white/8 pt-6 md:pt-8">
                {/* Total nights */}
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <span className="text-white/60 text-xs md:text-sm">Total nights selected</span>
                  <span className="text-white text-xs md:text-sm font-medium">{calculatePriceBreakdown()?.totalNights} nights</span>
                </div>

                {/* Breakdown by seasonal price */}
                {calculatePriceBreakdown()?.breakdown.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 text-xs md:text-sm">
                    <span className="text-white/50 text-center sm:text-left">
                      {item.nights} nights in {item.month}
                      <span className="text-white/30 ml-1 md:ml-2">(€{item.weeklyRate.toLocaleString()}/week)</span>
                    </span>
                    <span className="text-white/70 text-center sm:text-right mt-1 sm:mt-0">€{item.subtotal.toLocaleString()}</span>
                  </div>
                ))}

                {/* Divider */}
                <div className="border-t border-white/10 my-4 md:my-5"></div>

                {/* Total */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-5 md:mb-6 gap-2">
                  <span className="text-white text-sm md:text-base font-medium">Total for your stay</span>
                  <span className="text-xl md:text-2xl font-serif text-luxury-gold">€{calculatePriceBreakdown()?.total.toLocaleString()}</span>
                </div>

                <button
                  className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-semibold uppercase tracking-[0.15em] text-[10px] md:text-[11px] transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#C4A461', color: '#0B1C26' }}
                >
                  Request Booking
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* ===== 4️⃣ AMENITIES ===== */}
        <div className="py-12">
          <h3 className="text-xl font-serif text-white mb-8 tracking-wide text-center">Amenities</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {villa.features?.map((f, i) => (
              <span
                key={i}
                className="px-6 py-3.5 rounded-full text-white/60 text-sm font-light transition-colors hover:text-white/80"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ===== 5️⃣ DOUBLE INFO BLOCK ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
          {/* Left: Seasonal Prices */}
          <div
            className="p-8 lg:p-10 rounded-[32px] border border-white/6"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
          >
            <h3 className="text-xl font-serif text-white mb-8 tracking-wide">Weekly Rates</h3>
            {villa.seasonalPrices && (
              <div className="space-y-0">
                {villa.seasonalPrices.map((sp, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                    <span className="text-white/55 font-light">{sp.month}</span>
                    <span className="text-luxury-gold font-medium tracking-wide">{sp.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Important Information */}
          <div
            className="p-8 lg:p-10 rounded-[32px] border border-white/6"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
          >
            <h3 className="text-xl font-serif text-white mb-8 tracking-wide">Important Information</h3>
            <div>
              {[
                ['Maximum persons', villa.maxGuests],
                ['Bedrooms', villa.bedrooms],
                ['Bathrooms', villa.bathrooms],
                ['Minimum stay', villa.minStay || '7 nights'],
                ['Check-in', villa.checkIn || '16:00'],
                ['Check-out', villa.checkOut || '10:00'],
                ['Arrival policy', villa.arrivalPolicy || 'Flexible'],
                ['Reservation deposit', villa.reservationDeposit || '50%'],
                ['Security deposit', villa.securityDeposit || '€5,000'],
                ['Ecotax', villa.ecotax || 'Included'],
                ['Final cleaning', villa.finalCleaning || 'Included'],
                ['Services included', villa.servicesIncluded || 'Cleaning, Concierge'],
              ].map(([label, value], i, arr) => (
                <div key={i} className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <span className="text-white/40 text-sm">{label}</span>
                  <span className="text-white/80 text-sm text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 6️⃣ CONCIERGE NOTE ===== */}
        <div
          className="my-12 p-8 lg:p-10 rounded-[32px] flex flex-col items-center text-center gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(196,164,97,0.15) 0%, rgba(196,164,97,0.08) 100%)', border: '1px solid rgba(196,164,97,0.15)' }}
        >
          <LogoTheKey className="w-10 h-14 lg:w-12 lg:h-16 opacity-70" color="#C4A461" />
          <div>
            <p className="text-white/70 text-base lg:text-lg font-light leading-relaxed">
              {villa.conciergeNote || `Our concierge team is here to ensure your stay at ${villa.name} is truly unforgettable.`}
            </p>
            <p className="text-luxury-gold/70 text-sm mt-3 font-light">
              We can arrange private chef, boat charter and personalised experiences tailored to your wishes.
            </p>
          </div>
        </div>

        {/* ===== 7️⃣ GALLERY ===== */}
        <div className="py-12">
          <h3 className="text-xl font-serif text-white mb-8 tracking-wide text-center">Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allGalleryImages.slice(0, 4).map((img, i) => (
              <div
                key={i}
                onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                className="aspect-[4/3] rounded-[24px] overflow-hidden cursor-pointer relative group"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {i === 3 && allGalleryImages.length > 4 && (
                  <div className="absolute inset-0 bg-[#0B1C26]/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-luxury-gold text-2xl font-light tracking-wide">+{allGalleryImages.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Modal */}
        {galleryOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backgroundColor: 'rgba(11,28,38,0.97)' }}>
            <button onClick={() => setGalleryOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <button onClick={() => setGalleryIndex((galleryIndex - 1 + allGalleryImages.length) % allGalleryImages.length)} className="absolute left-6 md:left-12 text-white/40 hover:text-luxury-gold transition-colors">
              <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <img src={allGalleryImages[galleryIndex]} className="max-h-[80vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl" alt="" />
            <button onClick={() => setGalleryIndex((galleryIndex + 1) % allGalleryImages.length)} className="absolute right-6 md:right-12 text-white/40 hover:text-luxury-gold transition-colors">
              <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7"></path></svg>
            </button>
            <div className="absolute bottom-8 text-white/30 text-sm tracking-widest">{galleryIndex + 1} / {allGalleryImages.length}</div>
          </div>
        )}

        {/* ===== 8️⃣ AVAILABILITY ===== */}
        <div className="py-12">
          <h3 className="text-xl font-serif text-white tracking-wide text-center mb-8">Availability</h3>
          <div className="flex items-center justify-center mb-8">
            <div className="flex gap-3">
              <button
                onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else { setCalendarMonth(calendarMonth - 1); }}}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-luxury-gold hover:bg-white/5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button
                onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else { setCalendarMonth(calendarMonth + 1); }}}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-luxury-gold hover:bg-white/5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const m = (calendarMonth + offset) % 12;
              const y = calendarYear + Math.floor((calendarMonth + offset) / 12);
              const days = generateCalendarDays(m, y);
              return (
                <div
                  key={offset}
                  className="p-6 rounded-[24px] border border-white/6"
                  style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                  <h4 className="text-center text-white/80 text-sm font-medium mb-5 tracking-wide">{monthNames[m]} {y}</h4>
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-white/30 mb-3 font-medium">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                      const isOccupied = day ? checkDateOccupied(day, m, y) : false;
                      const dateStr = day ? `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                      const isCheckIn = dateStr === checkIn;
                      const isCheckOut = dateStr === checkOut;
                      const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (day && !isOccupied) {
                              if (!checkIn || (checkIn && checkOut)) {
                                setCheckIn(dateStr);
                                setCheckOut('');
                              } else if (checkIn && !checkOut) {
                                if (new Date(dateStr) > new Date(checkIn)) {
                                  setCheckOut(dateStr);
                                } else {
                                  setCheckIn(dateStr);
                                }
                              }
                            }
                          }}
                          className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-all font-medium ${
                            day
                              ? isOccupied
                                ? 'bg-[#0B1C26] text-white/50 cursor-not-allowed border border-white/10'
                                : isCheckIn || isCheckOut
                                  ? 'bg-luxury-gold text-[#0B1C26] ring-2 ring-white/30 scale-110 cursor-pointer'
                                  : isInRange
                                    ? 'bg-[#C9B27C]/60 text-[#0B1C26] cursor-pointer'
                                    : 'bg-[#C9B27C] text-[#0B1C26] hover:scale-110 cursor-pointer'
                              : ''
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-8 mt-6 text-xs text-white/60">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#0B1C26] border border-white/10"></div><span>Occupied</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#C9B27C]"></div><span>Available</span></div>
          </div>
        </div>

        {/* ===== 9️⃣ LOCATION MAP ===== */}
        {(typeof villa.latitude === 'number' && !isNaN(villa.latitude) &&
          typeof villa.longitude === 'number' && !isNaN(villa.longitude)) && (
          <div className="py-12">
            <h3 className="text-xl font-serif text-white mb-8 tracking-wide text-center">Location</h3>
            <div className="w-full rounded-[32px] overflow-hidden border border-white/6 shadow-xl">
              <VillaMap latitude={villa.latitude} longitude={villa.longitude} />
            </div>
            <p className="text-white/25 text-xs mt-4 text-center tracking-wide">Approximate location shown. Exact address provided upon booking confirmation.</p>
          </div>
        )}

        {/* ===== 🔟 GUEST REVIEWS ===== */}
        <div className="py-12">
          <h3 className="text-xl font-serif text-white mb-8 tracking-wide text-center">Guest Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="p-7 rounded-[24px] border border-white/6"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  ))}
                </div>
                <p className="text-white/60 text-sm mb-5 italic leading-relaxed">"{review.text}"</p>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">{review.name}</span>
                    {review.isGoogleVerified && (
                      <span className="text-[9px] text-luxury-gold uppercase tracking-widest font-medium">Google Verified</span>
                    )}
                  </div>
                  <span className="text-white/30">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              className="px-10 py-4 rounded-full text-luxury-gold text-sm tracking-wide transition-all duration-300 hover:bg-luxury-gold/10"
              style={{ border: '1px solid rgba(196,164,97,0.3)' }}
            >
              Leave your feedback
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VillaDetailPage;
