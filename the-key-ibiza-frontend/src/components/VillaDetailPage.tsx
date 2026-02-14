
import React, { useEffect, useState, useRef } from 'react';
import { Villa, Language } from '../types';
import { translations } from '../translations';
import { LogoTheKey } from './Navbar';
import VillaMap from './VillaMap';
import { useIsMobile } from './useIsMobile';
import MobileDatePickerModal from './MobileDatePickerModal';
import WatermarkedImage from './WatermarkedImage';

interface VillaDetailPageProps {
  villa: Villa;
  onNavigate: (view: any) => void;
  lang: Language;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onDatesChange?: (checkIn: string, checkOut: string) => void;
}

/**
 * TEXT REFINEMENT WORKFLOW:
 * To refine descriptive texts (improve wording without changing meaning):
 * 1. Export current texts to a Google Doc or similar collaborative tool
 * 2. Review and refine wording for elegance while preserving intent
 * 3. Update the villa data in the data source (e.g., Google Sheets, CMS, or constants.tsx)
 * 4. Texts will automatically render through renderFormattedText() below
 *
 * This approach keeps content management separate from code changes.
 */

// Helper function to render text with formatting from Google Docs
const renderFormattedText = (text: string) => {
  const paragraphs = text.split('\n').filter(p => p.trim());

  return paragraphs.map((paragraph, pIdx) => {
    const isBullet = paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-');
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

const VillaDetailPage: React.FC<VillaDetailPageProps> = ({ villa, onNavigate, lang, initialCheckIn = '', initialCheckOut = '', onDatesChange }) => {
  const t = translations[lang].villa;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut);
  const [reviewIndex, setReviewIndex] = useState(0);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});

  // Mobile date picker
  const isMobile = useIsMobile();
  const [mobileDatePickerOpen, setMobileDatePickerOpen] = useState(false);

  // Touch/swipe refs
  const calendarRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const checkOutInputRef = useRef<HTMLInputElement>(null);

  // Sync dates to parent when they change
  useEffect(() => {
    if (onDatesChange) {
      onDatesChange(checkIn, checkOut);
    }
  }, [checkIn, checkOut, onDatesChange]);
  const touchStartX = useRef(0);

  // Use headerImages for the slideshow, fallback to main imageUrl
  const slideshowImages = (villa.headerImages && villa.headerImages.length > 0
    ? villa.headerImages
    : [villa.imageUrl]).filter(img => img && img.trim().length > 0);

  const allGalleryImages = villa.gallery || [];
  const occupiedDates = villa.occupiedDates || [];

  const reviews = [
    { name: 'James H.', rating: 5, text: 'Absolutely stunning villa with breathtaking views. The Key team delivered exceptional service throughout our stay.', date: 'August 2024', isGoogleVerified: true },
    { name: 'Sophie M.', rating: 5, text: 'An impeccable location paired with flawless attention to detail. We will certainly return.', date: 'July 2024', isGoogleVerified: true },
    { name: 'Marco R.', rating: 5, text: 'A truly unforgettable experience. Every aspect was thoughtfully curated to perfection.', date: 'June 2024', isGoogleVerified: false },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const imageCount = slideshowImages.length;
    if (imageCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // Auto-rotate reviews on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Prevent body scroll when gallery is open + keyboard navigation
  useEffect(() => {
    if (galleryOpen) {
      document.body.style.overflow = 'hidden';

      // Keyboard navigation handler
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          setGalleryIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);
        } else if (e.key === 'ArrowRight') {
          setGalleryIndex((prev) => (prev + 1) % allGalleryImages.length);
        } else if (e.key === 'Escape') {
          setGalleryOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [galleryOpen, allGalleryImages.length]);

  const monthNameToIndex: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11,
  };

  const calculatePriceBreakdown = () => {
    if (!checkIn || !checkOut) return null;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (totalNights <= 0) return null;

    const nightsByMonth: { [key: string]: number } = {};
    const priceByMonth: { [key: string]: number } = {};
    const monthlyPrices: { [monthIndex: number]: number } = {};

    villa.seasonalPrices?.forEach(sp => {
      const monthKey = Object.keys(monthNameToIndex).find(m => sp.month.includes(m));
      if (monthKey) {
        const monthIdx = monthNameToIndex[monthKey];
        const price = parseInt(sp.price.replace(/[^\d]/g, '')) || villa.numericPrice || 15000;
        monthlyPrices[monthIdx] = price;
      }
    });

    const defaultWeeklyPrice = villa.numericPrice || 15000;

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const monthIdx = d.getMonth();
      const monthName = monthNames[monthIdx];
      nightsByMonth[monthName] = (nightsByMonth[monthName] || 0) + 1;
      priceByMonth[monthName] = monthlyPrices[monthIdx] || defaultWeeklyPrice;
    }

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

  const isRangeAvailable = () => {
    if (!checkIn || !checkOut) return true;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (occupiedDates.includes(dateStr)) return false;
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

  // Check if date is in the past (cannot be selected)
  const isDateInPast = (day: number, month: number, year: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
  };

  // Get today's date string for input min attribute
  const getTodayString = (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const priceNumbers = villa.seasonalPrices?.map(sp => parseInt(sp.price.replace(/[^\d]/g, ''))) || [villa.numericPrice || 15000];
  const minPrice = Math.min(...priceNumbers);
  const maxPrice = Math.max(...priceNumbers);

  // Swipe handlers for mobile calendar
  const handleCalendarTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleCalendarTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next month
        if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
        else { setCalendarMonth(calendarMonth + 1); }
      } else {
        // Swipe right - previous month
        if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
        else { setCalendarMonth(calendarMonth - 1); }
      }
    }
  };

  // Swipe handlers for gallery
  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setGalleryIndex((galleryIndex + 1) % allGalleryImages.length);
      } else {
        setGalleryIndex((galleryIndex - 1 + allGalleryImages.length) % allGalleryImages.length);
      }
    }
  };

  // Booking form validation
  const validateBookingForm = () => {
    const errors: Record<string, string> = {};
    if (!bookingForm.name.trim()) errors.name = 'Name is required';
    if (!bookingForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) errors.email = 'Invalid email';
    if (!bookingForm.phone.trim()) errors.phone = 'Phone is required';
    return errors;
  };

  // Handle booking form submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateBookingForm();
    if (Object.keys(errors).length > 0) {
      setBookingErrors(errors);
      return;
    }

    setBookingStatus('submitting');
    const calculatedTotal = calculatePriceBreakdown()?.total || 0;

    // Prepare form data for email
    const formDataToSend = new FormData();
    formDataToSend.append('name', bookingForm.name);
    formDataToSend.append('email', bookingForm.email);
    formDataToSend.append('phone', bookingForm.phone);
    formDataToSend.append('message', bookingForm.message || 'No additional message');
    formDataToSend.append('villa', villa.name);
    formDataToSend.append('check_in', checkIn);
    formDataToSend.append('check_out', checkOut);
    formDataToSend.append('total_price', `€${calculatedTotal.toLocaleString()}`);
    formDataToSend.append('_subject', `Booking Request: ${villa.name} – The Key Ibiza`);
    formDataToSend.append('_captcha', 'false');
    formDataToSend.append('_template', 'table');

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@thekey-ibiza.com', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();
      if (result.success) {
        setBookingStatus('success');
        setBookingForm({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Email failed');
      }
    } catch (error) {
      // Fallback: open mailto
      const subject = encodeURIComponent(`Booking Request: ${villa.name}`);
      const body = encodeURIComponent(`Booking Request\n\nVilla: ${villa.name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nTotal: €${calculatedTotal.toLocaleString()}\n\nName: ${bookingForm.name}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nMessage: ${bookingForm.message || 'No additional message'}`);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
      setBookingStatus('success');
    }
  };

  // Date Picker Component (reusable for mobile/desktop positioning)
  // NOTE: Text content can be refined via Google Docs workflow - export texts, refine wording externally, then update translations.ts
  const DatePickerSection = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`${compact ? 'p-5 max-w-sm mx-auto' : 'p-6 lg:p-8'} rounded-[20px] md:rounded-[24px] border border-white/8 shadow-xl w-full`}
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
    >
      <h3 className={`${compact ? 'text-base' : 'text-lg'} font-serif text-white mb-4 tracking-wide text-center`}>Select Your Dates</h3>
      <div className="flex flex-col gap-3 min-[360px]:grid min-[360px]:grid-cols-2 mb-4">
        <div>
          <label className="text-[8px] uppercase tracking-[0.15em] text-white/50 mb-1.5 block font-medium text-center">Check-in</label>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setMobileDatePickerOpen(true)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold/50 transition-colors cursor-pointer text-left"
            >
              {checkIn || 'Select date'}
            </button>
          ) : (
            <input
              type="date"
              value={checkIn}
              min={getTodayString()}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setTimeout(() => checkOutInputRef.current?.showPicker?.(), 100);
              }}
              onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold/50 transition-colors cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
          )}
        </div>
        <div>
          <label className="text-[8px] uppercase tracking-[0.15em] text-white/50 mb-1.5 block font-medium text-center">Check-out</label>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setMobileDatePickerOpen(true)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold/50 transition-colors cursor-pointer text-left"
            >
              {checkOut || 'Select date'}
            </button>
          ) : (
            <input
              ref={checkOutInputRef}
              type="date"
              value={checkOut}
              min={checkIn || getTodayString()}
              onChange={(e) => setCheckOut(e.target.value)}
              onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-luxury-gold/50 transition-colors cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
          )}
        </div>
      </div>

      {checkIn && checkOut && !isRangeAvailable() && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
          Selected dates are not available.
        </div>
      )}

      {!checkIn || !checkOut ? (
        <p className="text-white/40 text-xs text-center italic">
          Select dates to calculate your stay.
        </p>
      ) : calculatePriceBreakdown() && isRangeAvailable() ? (
        <div className="border-t border-white/8 pt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-xs">Nights</span>
            <span className="text-white text-xs font-medium">{calculatePriceBreakdown()?.totalNights}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-sm font-medium">Total</span>
            <span className="text-lg font-serif text-luxury-gold">€{calculatePriceBreakdown()?.total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setBookingModalOpen(true)}
            className="w-full py-3 rounded-xl font-semibold uppercase tracking-[0.15em] text-[10px] transition-all duration-300 bg-luxury-gold text-luxury-blue border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold"
          >
            Request Booking
          </button>
        </div>
      ) : null}

      {/* Mobile Date Picker Modal */}
      {isMobile && (
        <MobileDatePickerModal
          isOpen={mobileDatePickerOpen}
          onClose={() => setMobileDatePickerOpen(false)}
          checkIn={checkIn}
          checkOut={checkOut}
          onDatesChange={(newCheckIn, newCheckOut) => {
            setCheckIn(newCheckIn);
            setCheckOut(newCheckOut);
          }}
        />
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0B1C26' }}>
      {/* ===== HEADER SLIDESHOW ===== */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
        {slideshowImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <WatermarkedImage src={img} alt={`${villa.name} - ${index + 1}`} className="w-full h-full object-cover" fullBleed />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C26]/60 via-transparent to-[#0B1C26]"></div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {slideshowImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((currentSlide - 1 + slideshowImages.length) % slideshowImages.length)}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-luxury-gold hover:bg-black/50 transition-all md:opacity-0 md:group-hover:opacity-100"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button
              onClick={() => setCurrentSlide((currentSlide + 1) % slideshowImages.length)}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-luxury-gold hover:bg-black/50 transition-all md:opacity-0 md:group-hover:opacity-100"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </>
        )}

        {/* Dot Indicators */}
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

        {/* Image Counter */}
        {slideshowImages.length > 1 && (
          <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
            <span className="text-white/80 text-xs md:text-sm tracking-wider font-medium">
              {currentSlide + 1} / {slideshowImages.length}
            </span>
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 lg:px-16 xl:px-24 pb-8 md:pb-16">

        {/* ===== NAME + PRICE ===== */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between py-8 md:py-10 border-b border-white/5">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-serif text-white">{villa.name}</h1>
            {villa.location && (
              <p className="text-white/40 text-sm md:text-base mt-2 font-light">{villa.location}</p>
            )}
          </div>
          <div className="text-left md:text-right">
            <span className="text-lg md:text-2xl font-serif text-luxury-gold whitespace-nowrap">
              {minPrice.toLocaleString()}€ - {maxPrice.toLocaleString()}€
            </span>
            <p className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.25em] mt-1 font-light">per week</p>
          </div>
        </div>

        {/* ===== MOBILE: DATE PICKER (between header and description) ===== */}
        <div className="md:hidden py-8">
          <DatePickerSection compact />
        </div>

        {/* ===== DESCRIPTION + DATE PICKER (Desktop) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 py-8 md:py-16">
          {/* Description - 3 columns */}
          <div className="lg:col-span-3 text-white/65 text-base md:text-lg font-light leading-relaxed">
            {villa.fullDescription?.map((p, i) => (
              <div key={i} className="mb-6 last:mb-0">
                {renderFormattedText(p)}
              </div>
            ))}
          </div>

          {/* Date Picker - 2 columns (Desktop only) */}
          <div className="hidden lg:block lg:col-span-2">
            <DatePickerSection />
          </div>
        </div>

        {/* ===== AMENITIES ===== */}
        <div className="py-10 md:py-12">
          <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide text-center">Amenities</h3>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {villa.features?.map((f, i) => (
              <span
                key={i}
                className="px-4 md:px-6 py-2.5 md:py-3.5 rounded-full text-white/60 text-xs md:text-sm font-light transition-colors hover:text-white/80"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ===== RATES + INFO ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 py-10 md:py-12">
          <div
            className="p-6 md:p-8 lg:p-10 rounded-[24px] md:rounded-[32px] border border-white/6"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
          >
            <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide">Weekly Rates</h3>
            {villa.seasonalPrices && (
              <div className="space-y-0">
                {villa.seasonalPrices.map((sp, i) => (
                  <div key={i} className="flex justify-between items-center py-3 md:py-4 border-b border-white/5 last:border-0">
                    <span className="text-white/55 font-light text-sm md:text-base">{sp.month}</span>
                    <span className="text-luxury-gold font-medium tracking-wide text-sm md:text-base">{sp.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="p-6 md:p-8 lg:p-10 rounded-[24px] md:rounded-[32px] border border-white/6"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
          >
            <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide">Important Information</h3>
            <div>
              {[
                ['Maximum guests', villa.maxGuests],
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
                <div key={i} className={`flex justify-between items-center py-2.5 md:py-3 ${i < arr.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <span className="text-white/40 text-xs md:text-sm">{label}</span>
                  <span className="text-white/80 text-xs md:text-sm text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== CONCIERGE NOTE ===== */}
        <div
          className="my-10 md:my-12 p-6 md:p-8 lg:p-10 rounded-[24px] md:rounded-[32px] flex flex-col items-center text-center gap-4 md:gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(196,164,97,0.15) 0%, rgba(196,164,97,0.08) 100%)', border: '1px solid rgba(196,164,97,0.15)' }}
        >
          <LogoTheKey className="w-8 h-12 md:w-10 md:h-14 lg:w-12 lg:h-16 opacity-70" color="#C4A461" />
          <div>
            <p className="text-white/70 text-sm md:text-base lg:text-lg font-light leading-relaxed">
              {villa.conciergeNote || `Our dedicated concierge team ensures every moment at ${villa.name} exceeds expectations.`}
            </p>
            <p className="text-luxury-gold/70 text-xs md:text-sm mt-3 font-light">
              Private chef, yacht charter, and bespoke experiences available upon request.
            </p>
          </div>
        </div>

        {/* ===== GALLERY ===== */}
        <div className="py-10 md:py-12">
          <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide text-center">Gallery</h3>
          {/* Main preview grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
            {allGalleryImages.slice(0, 4).map((img, i) => (
              <div
                key={i}
                onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                className="aspect-[4/3] rounded-[16px] md:rounded-[24px] overflow-hidden cursor-pointer relative group"
              >
                <WatermarkedImage src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" watermarkSize="small" fullBleed />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {i === 3 && allGalleryImages.length > 4 && (
                  <div className="absolute inset-0 bg-[#0B1C26]/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-luxury-gold text-xl md:text-2xl font-light tracking-wide">+{allGalleryImages.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Modal - Full screen with scroll prevention */}
        {galleryOpen && (
          <div
            ref={galleryRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'rgba(11,28,38,0.98)', touchAction: 'none' }}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            {/* Close button - prominent X */}
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-luxury-gold hover:text-luxury-blue transition-all"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Counter - top center */}
            <div className="absolute top-5 md:top-8 left-1/2 -translate-x-1/2 text-luxury-gold text-sm md:text-base tracking-widest font-medium z-20">
              {galleryIndex + 1} / {allGalleryImages.length}
            </div>

            {/* Navigation arrows - always visible */}
            <button
              onClick={() => setGalleryIndex((galleryIndex - 1 + allGalleryImages.length) % allGalleryImages.length)}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold hover:bg-white/20 transition-all"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            {/* Main image container - bounded area above thumbnails */}
            <div className="absolute top-16 bottom-[6.5rem] left-4 right-4 md:top-20 md:bottom-[7.5rem] md:left-20 md:right-20 flex items-center justify-center">
              <WatermarkedImage
                src={allGalleryImages[galleryIndex]}
                className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl md:rounded-2xl shadow-2xl"
                alt=""
                watermarkSize="gallery"
              />
            </div>

            <button
              onClick={() => setGalleryIndex((galleryIndex + 1) % allGalleryImages.length)}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold hover:bg-white/20 transition-all"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Thumbnail strip - better separation from main image */}
            <div className="absolute bottom-4 md:bottom-8 flex gap-2 md:gap-3 overflow-x-auto max-w-[90vw] pb-2 px-4" style={{ touchAction: 'pan-x' }}>
              {allGalleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`flex-shrink-0 w-14 h-10 md:w-20 md:h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${galleryIndex === i ? 'border-luxury-gold scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== AVAILABILITY CALENDAR ===== */}
        <div className="py-10 md:py-12">
          <h3 className="text-lg md:text-xl font-serif text-white tracking-wide text-center mb-6 md:mb-8">Availability</h3>

          {/* Mobile: swipe hint */}
          <p className="md:hidden text-white/30 text-xs text-center mb-4">Swipe to change month</p>

          {/* Calendar with arrows on sides (Desktop) */}
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {/* Left arrow (Desktop only) */}
            <button
              onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else { setCalendarMonth(calendarMonth - 1); }}}
              className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-white/30 hover:text-luxury-gold hover:bg-white/5 transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            {/* Calendar grid */}
            <div
              ref={calendarRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1 max-w-4xl"
              onTouchStart={handleCalendarTouchStart}
              onTouchEnd={handleCalendarTouchEnd}
            >
            {[0, 1, 2].map((offset) => {
              const m = (calendarMonth + offset) % 12;
              const y = calendarYear + Math.floor((calendarMonth + offset) / 12);
              const days = generateCalendarDays(m, y);
              return (
                <div
                  key={offset}
                  className={`p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-white/6 ${offset > 0 ? 'hidden md:block' : ''}`}
                  style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                  <h4 className="text-center text-white/80 text-sm font-medium mb-4 md:mb-5 tracking-wide">{monthNames[m]} {y}</h4>
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-white/30 mb-2 md:mb-3 font-medium">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                      const isOccupied = day ? checkDateOccupied(day, m, y) : false;
                      const isPast = day ? isDateInPast(day, m, y) : false;
                      const isDisabled = isOccupied || isPast;
                      const dateStr = day ? `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                      const isCheckIn = dateStr === checkIn;
                      const isCheckOut = dateStr === checkOut;
                      const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (day && !isDisabled) {
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
                          className={`aspect-square flex items-center justify-center text-[10px] md:text-xs rounded-md md:rounded-lg transition-all font-medium ${
                            day
                              ? isDisabled
                                ? 'bg-[#0B1C26] text-white/25 cursor-not-allowed border border-white/5'
                                : isCheckIn || isCheckOut
                                  ? 'bg-luxury-gold text-[#0B1C26] ring-2 ring-white/30 scale-105 cursor-pointer'
                                  : isInRange
                                    ? 'bg-luxury-gold/80 text-[#0B1C26] cursor-pointer'
                                    : 'bg-white/10 text-white/70 hover:bg-luxury-gold/30 hover:scale-105 cursor-pointer'
                              : ''
                          }`}
                          aria-disabled={isDisabled}
                          tabIndex={isDisabled ? -1 : 0}
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

            {/* Right arrow (Desktop only) */}
            <button
              onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else { setCalendarMonth(calendarMonth + 1); }}}
              className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-white/30 hover:text-luxury-gold hover:bg-white/5 transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 md:gap-8 mt-4 md:mt-6 text-[10px] md:text-xs text-white/60">
            <div className="flex items-center gap-2"><div className="w-3 h-3 md:w-4 md:h-4 rounded bg-[#0B1C26] border border-white/10"></div><span>Occupied</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 md:w-4 md:h-4 rounded bg-white/10"></div><span>Available</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 md:w-4 md:h-4 rounded bg-luxury-gold"></div><span>Selected</span></div>
          </div>
        </div>

        {/* ===== LOCATION MAP ===== */}
        {(typeof villa.latitude === 'number' && !isNaN(villa.latitude) &&
          typeof villa.longitude === 'number' && !isNaN(villa.longitude)) && (
          <div className="py-10 md:py-12">
            <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide text-center">Location</h3>
            <div className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/6 shadow-xl">
              <VillaMap latitude={villa.latitude} longitude={villa.longitude} />
            </div>
            <p className="text-white/25 text-[10px] md:text-xs mt-3 md:mt-4 text-center tracking-wide">Approximate location. Exact address provided upon booking confirmation.</p>
          </div>
        )}

        {/* ===== GUEST REVIEWS ===== */}
        <div className="pt-10 pb-4 md:pt-12 md:pb-8">
          <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide text-center">Guest Reviews</h3>

          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="p-6 lg:p-7 rounded-[20px] md:rounded-[24px] border border-white/6"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
              >
                <div className="flex items-center gap-1 mb-3 md:mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 md:w-4 md:h-4 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  ))}
                </div>
                <p className="text-white/60 text-sm mb-4 md:mb-5 italic leading-relaxed">"{review.text}"</p>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">{review.name}</span>
                    {review.isGoogleVerified && (
                      <span className="text-[8px] md:text-[9px] text-luxury-gold uppercase tracking-widest font-medium">Verified</span>
                    )}
                  </div>
                  <span className="text-white/30">{review.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: slideshow */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ${reviewIndex === i ? 'block' : 'hidden'}`}
                >
                  <div
                    className="p-5 rounded-[20px] border border-white/6 mx-auto max-w-sm"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
                  >
                    <div className="flex items-center gap-1 mb-3 justify-center">
                      {[...Array(review.rating)].map((_, j) => (
                        <svg key={j} className="w-3.5 h-3.5 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      ))}
                    </div>
                    <p className="text-white/60 text-sm mb-4 italic leading-relaxed text-center">"{review.text}"</p>
                    <div className="flex justify-center items-center gap-3 text-xs">
                      <span className="text-white/70">{review.name}</span>
                      {review.isGoogleVerified && (
                        <span className="text-[8px] text-luxury-gold uppercase tracking-widest font-medium">Verified</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewIndex(i)}
                  className={`transition-all duration-300 rounded-full h-[3px] ${reviewIndex === i ? 'w-5 bg-luxury-gold' : 'w-2 bg-luxury-gold/30'}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              className="px-8 md:px-10 py-3 md:py-4 rounded-full text-luxury-gold text-xs md:text-sm tracking-wide transition-all duration-300 hover:bg-luxury-gold/10"
              style={{ border: '1px solid rgba(196,164,97,0.3)' }}
            >
              Leave your feedback
            </button>
          </div>
        </div>

      </div>

      {/* ===== BOOKING MODAL ===== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              if (bookingStatus !== 'submitting') {
                setBookingModalOpen(false);
                setBookingStatus('idle');
                setBookingErrors({});
              }
            }}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-[#0B1C26] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-serif text-white mb-1">Request Booking</h3>
                  <p className="text-white/50 text-sm">{villa.name}</p>
                </div>
                <button
                  onClick={() => {
                    if (bookingStatus !== 'submitting') {
                      setBookingModalOpen(false);
                      setBookingStatus('idle');
                      setBookingErrors({});
                    }
                  }}
                  className="text-white/50 hover:text-white transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {bookingStatus === 'success' ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-serif text-white mb-2">Request Sent</h4>
                <p className="text-white/60 text-sm mb-6">
                  Thank you for your interest. Our team will contact you within 24 hours to confirm your booking.
                </p>
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingStatus('idle');
                    setBookingForm({ name: '', email: '', phone: '', message: '' });
                  }}
                  className="px-8 py-3 rounded-xl font-semibold uppercase tracking-[0.15em] text-[10px] transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#C4A461', color: '#0B1C26' }}
                >
                  Close
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleBookingSubmit}>
                {/* Booking Summary */}
                <div className="p-6 bg-white/5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Check-in</span>
                      <span className="text-white">{checkIn || 'Not selected'}</span>
                    </div>
                    <div>
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Check-out</span>
                      <span className="text-white">{checkOut || 'Not selected'}</span>
                    </div>
                  </div>
                  {calculatePriceBreakdown() && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-white/60 text-sm">Estimated Total</span>
                      <span className="text-luxury-gold font-serif text-lg">€{calculatePriceBreakdown()?.total.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="p-6 space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border ${bookingErrors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold/50 transition-colors text-base`}
                    />
                    {bookingErrors.name && <p className="text-red-400 text-xs mt-1">{bookingErrors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border ${bookingErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold/50 transition-colors text-base`}
                    />
                    {bookingErrors.email && <p className="text-red-400 text-xs mt-1">{bookingErrors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border ${bookingErrors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold/50 transition-colors text-base`}
                    />
                    {bookingErrors.phone && <p className="text-red-400 text-xs mt-1">{bookingErrors.phone}</p>}
                  </div>
                  <div>
                    <textarea
                      placeholder="Additional Message (optional)"
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold/50 transition-colors resize-none text-base"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="p-6 pt-0">
                  <button
                    type="submit"
                    disabled={bookingStatus === 'submitting'}
                    className="w-full py-4 rounded-xl font-semibold uppercase tracking-[0.15em] text-[10px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-luxury-gold text-luxury-blue border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold"
                  >
                    {bookingStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Booking Request'
                    )}
                  </button>
                  {bookingStatus === 'error' && (
                    <p className="text-red-400 text-xs text-center mt-3">
                      Failed to send request. Please try again or contact us directly.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VillaDetailPage;
