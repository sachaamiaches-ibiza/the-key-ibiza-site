
import React, { useEffect, useState, useRef } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { LogoTheKey } from './Navbar';
import { useIsMobile } from './useIsMobile';
import WatermarkedImage from './WatermarkedImage';
import FooterSEO from './FooterSEO';

// Extended Yacht interface for detail page
interface Yacht {
  id: string;
  nombre: string;
  pax_max: number;
  amarre: string;
  price_high_season: number;
  metros: number;
  localidad: string;
  photo: string | null;
  description: string;
  // Extended fields for detail page
  price_min_day?: number;
  price_max_day?: number;
  daily_rates?: Record<string, number>;
  header_images?: string;
  gallery_images?: string;
  full_description?: string;
  features?: string;
  crew_members?: number;
  cabins?: number;
  builder?: string;
  year_built?: number;
  fuel_included?: boolean;
  min_charter_hours?: number;
}

interface YachtDetailPageProps {
  yacht: Yacht;
  onNavigate: (view: string) => void;
  lang: Language;
}

// Helper function to format date range "01-01_03-31" -> "1 Jan - 31 Mar"
const formatDateRange = (dateStr: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const match = dateStr.match(/(\d{2})-(\d{2})_(\d{2})-(\d{2})/);
  if (match) {
    const [, startMonth, startDay, endMonth, endDay] = match;
    const startMonthName = months[parseInt(startMonth) - 1] || startMonth;
    const endMonthName = months[parseInt(endMonth) - 1] || endMonth;
    return `${parseInt(startDay)} ${startMonthName} - ${parseInt(endDay)} ${endMonthName}`;
  }
  return dateStr;
};

// Helper function to render formatted text
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

const YachtDetailPage: React.FC<YachtDetailPageProps> = ({ yacht, onNavigate, lang }) => {
  const t = translations[lang];
  const isMobile = useIsMobile();

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const isDraggingThumbnails = useRef(false);
  const thumbnailStartX = useRef(0);
  const thumbnailScrollLeft = useRef(0);

  // Date selection state
  const [charterDate, setCharterDate] = useState('');
  const [duration, setDuration] = useState('full'); // '4h', '6h', '8h', 'full'

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});

  // Touch swipe
  const touchStartX = useRef(0);

  // Parse header images (pipe-separated or single photo)
  const slideshowImages = yacht.header_images
    ? yacht.header_images.split('|').filter(img => img.trim())
    : yacht.photo
      ? [yacht.photo]
      : [];

  // Parse gallery images
  const allGalleryImages = yacht.gallery_images
    ? yacht.gallery_images.split('|').filter(img => img.trim())
    : slideshowImages;

  // Parse features/amenities
  const features = yacht.features
    ? yacht.features.split('|').map(f => f.trim()).filter(Boolean)
    : [];

  // Parse daily rates
  const dailyRates = yacht.daily_rates || {};

  // Calculate price
  const minPrice = yacht.price_min_day || yacht.price_high_season || 0;
  const maxPrice = yacht.price_max_day || yacht.price_high_season || minPrice;

  // Get today's date string for min date
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calculate charter price based on duration
  const calculatePrice = () => {
    const basePrice = yacht.price_high_season || minPrice;
    switch (duration) {
      case '4h': return Math.round(basePrice * 0.5);
      case '6h': return Math.round(basePrice * 0.7);
      case '8h': return Math.round(basePrice * 0.85);
      default: return basePrice;
    }
  };

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Auto-rotate slideshow
  useEffect(() => {
    if (slideshowImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // Gallery keyboard navigation and scroll prevention
  useEffect(() => {
    if (galleryOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('gallery-open');

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
        document.body.classList.remove('gallery-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [galleryOpen, allGalleryImages.length]);

  // Gallery touch handlers
  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setGalleryIndex((prev) => (prev + 1) % allGalleryImages.length);
      } else {
        setGalleryIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);
      }
    }
  };

  // Thumbnail drag handlers
  const handleThumbnailMouseDown = (e: React.MouseEvent) => {
    isDraggingThumbnails.current = true;
    thumbnailStartX.current = e.pageX;
    thumbnailScrollLeft.current = thumbnailStripRef.current?.scrollLeft || 0;
  };

  const handleThumbnailMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingThumbnails.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - thumbnailStartX.current) * 1.5;
    if (thumbnailStripRef.current) {
      thumbnailStripRef.current.scrollLeft = thumbnailScrollLeft.current - walk;
    }
  };

  const handleThumbnailMouseUp = () => {
    isDraggingThumbnails.current = false;
  };

  // Form validation
  const validateBookingForm = () => {
    const errors: Record<string, string> = {};
    if (!bookingForm.name) errors.name = 'Required';
    if (!bookingForm.email) errors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) errors.email = 'Invalid email';
    if (!bookingForm.phone) errors.phone = 'Required';
    return errors;
  };

  // Submit booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateBookingForm();
    if (Object.keys(errors).length > 0) {
      setBookingErrors(errors);
      return;
    }

    setBookingStatus('submitting');

    const durationText = duration === '4h' ? '4 Hours' : duration === '6h' ? '6 Hours' : duration === '8h' ? '8 Hours' : 'Full Day';
    const priceText = `€${calculatePrice().toLocaleString()}`;

    const formData = new FormData();
    formData.append('name', bookingForm.name);
    formData.append('email', bookingForm.email);
    formData.append('phone', bookingForm.phone);
    formData.append('yacht', yacht.nombre);
    formData.append('date', charterDate || 'Not specified');
    formData.append('duration', durationText);
    formData.append('price', priceText);
    formData.append('message', bookingForm.message || 'No message');
    formData.append('_subject', `Yacht Charter Request: ${yacht.nombre} – The Key Ibiza`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@thekey-ibiza.com', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setBookingStatus('success');
        setBookingForm({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Failed');
      }
    } catch {
      // Fallback to mailto
      const subject = encodeURIComponent(`Yacht Charter Request: ${yacht.nombre}`);
      const body = encodeURIComponent(`Name: ${bookingForm.name}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nYacht: ${yacht.nombre}\nDate: ${charterDate || 'Not specified'}\nDuration: ${durationText}\nPrice: ${priceText}\nMessage: ${bookingForm.message || 'None'}`);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
      setBookingStatus('success');
    }
  };

  // Charter Request Section
  const CharterSection = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`${compact ? 'p-5 max-w-sm mx-auto' : 'p-6 lg:p-8'} rounded-[24px] md:rounded-[32px] border border-white/6`}
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
    >
      <h3 className="text-base md:text-lg font-serif text-white mb-4 md:mb-6 tracking-wide text-center">
        Select Your Charter
      </h3>

      {/* Date Selection */}
      <div className="mb-4">
        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">Charter Date</label>
        <input
          type="date"
          value={charterDate}
          min={getTodayString()}
          onChange={(e) => setCharterDate(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* Duration Selection */}
      <div className="mb-6">
        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">Duration</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: '4h', label: '4h' },
            { value: '6h', label: '6h' },
            { value: '8h', label: '8h' },
            { value: 'full', label: 'Full Day' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDuration(opt.value)}
              className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                duration === opt.value
                  ? 'bg-luxury-gold text-luxury-blue'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-white/8 pt-5 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">Estimated Price</span>
          <span className="text-lg font-serif text-luxury-gold">€{calculatePrice().toLocaleString()}</span>
        </div>
      </div>

      {/* Request Button */}
      <button
        onClick={() => setBookingModalOpen(true)}
        className="w-full py-3.5 md:py-4 rounded-full bg-luxury-gold text-luxury-blue text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all duration-500"
      >
        Request Charter
      </button>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0B1C26' }}>
      {/* ===== HEADER SLIDESHOW ===== */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
        {slideshowImages.length > 0 ? (
          slideshowImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{ opacity: currentSlide === index ? 1 : 0 }}
            >
              <WatermarkedImage src={img} alt={`${yacht.nombre} - ${index + 1}`} className="w-full h-full object-cover" fullBleed />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C26]/60 via-transparent to-[#0B1C26]"></div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-luxury-slate flex items-center justify-center">
            <span className="text-white/30 text-lg">No images available</span>
          </div>
        )}

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
      </div>

      <div className="container mx-auto px-6 lg:px-16 xl:px-24 pb-8 md:pb-16">

        {/* ===== NAME + PRICE ===== */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between py-8 md:py-10 border-b border-white/5">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-serif text-white">{yacht.nombre}</h1>
            <p className="text-white/40 text-sm md:text-base mt-2 font-light">
              {yacht.amarre || yacht.localidad || 'Ibiza'}
            </p>
          </div>
          <div className="text-left md:text-right">
            {minPrice > 0 ? (
              <>
                <span className="text-lg md:text-2xl font-serif text-luxury-gold whitespace-nowrap">
                  {minPrice === maxPrice ? `€${minPrice.toLocaleString()}` : `€${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}`}
                </span>
                <p className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.25em] mt-1 font-light">per day</p>
              </>
            ) : (
              <span className="text-lg md:text-2xl font-serif text-luxury-gold">Price on Request</span>
            )}
          </div>
        </div>

        {/* ===== MOBILE: CHARTER SECTION ===== */}
        <div className="md:hidden py-8">
          <CharterSection compact />
        </div>

        {/* ===== DESCRIPTION + CHARTER (Desktop) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 py-8 md:py-16">
          {/* Description */}
          <div className="lg:col-span-3 text-white/65 text-base md:text-lg font-light leading-relaxed">
            {yacht.full_description ? (
              renderFormattedText(yacht.full_description)
            ) : yacht.description ? (
              renderFormattedText(yacht.description)
            ) : (
              <p className="text-white/40 italic">Contact us for more details about this yacht.</p>
            )}
          </div>

          {/* Charter Section (Desktop) */}
          <div className="hidden lg:block lg:col-span-2">
            <CharterSection />
          </div>
        </div>

        {/* ===== GALLERY ===== */}
        {allGalleryImages.length > 0 && (
          <div className="py-10 md:py-12">
            <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide text-center">Gallery</h3>
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
        )}

        {/* ===== AMENITIES/FEATURES ===== */}
        {features.length > 0 && (
          <div className="py-10 md:py-12">
            <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide text-center">Amenities</h3>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {features.map((f, i) => (
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
        )}

        {/* ===== RATES + SPECS ===== */}
        <div className={`grid gap-6 md:gap-8 py-10 md:py-12 ${Object.keys(dailyRates).length > 0 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
          {/* Daily Rates */}
          {Object.keys(dailyRates).length > 0 && (
            <div
              className="p-6 md:p-8 lg:p-10 rounded-[24px] md:rounded-[32px] border border-white/6"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
            >
              <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide">Daily Rates</h3>
              <div>
                {Object.entries(dailyRates).map(([period, price], i, arr) => (
                  <div key={period} className={`flex justify-between items-center py-2.5 md:py-3 ${i < arr.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <span className="text-white/40 text-xs md:text-sm">{formatDateRange(period)}</span>
                    <span className="text-white/80 text-xs md:text-sm text-right">€{Number(price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          <div
            className="p-6 md:p-8 lg:p-10 rounded-[24px] md:rounded-[32px] border border-white/6"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
          >
            <h3 className="text-lg md:text-xl font-serif text-white mb-6 md:mb-8 tracking-wide">Specifications</h3>
            <div>
              {[
                ['Maximum guests', yacht.pax_max],
                ['Length', yacht.metros ? `${yacht.metros}m` : null],
                ['Cabins', yacht.cabins],
                ['Crew members', yacht.crew_members],
                ['Builder', yacht.builder],
                ['Year built', yacht.year_built],
                ['Mooring', yacht.amarre],
                ['Location', yacht.localidad],
                ['Minimum charter', yacht.min_charter_hours ? `${yacht.min_charter_hours} hours` : null],
                ['Fuel', yacht.fuel_included ? 'Included' : 'Not included'],
              ].filter(([_, value]) => value !== undefined && value !== null && value !== '').map(([label, value], i, arr) => (
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
              Our dedicated maritime team ensures every charter aboard {yacht.nombre} exceeds expectations.
            </p>
            <p className="text-luxury-gold/70 text-xs md:text-sm mt-3 font-light">
              Private chef, catering, and bespoke experiences available upon request.
            </p>
          </div>
        </div>

        {/* ===== GALLERY MODAL ===== */}
        {galleryOpen && (
          <div
            ref={galleryRef}
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'rgba(11,28,38,0.98)', touchAction: 'none', zIndex: 999999 }}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-luxury-gold hover:text-luxury-blue transition-all"
              style={{ zIndex: 9999999 }}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Counter */}
            <div className="absolute top-5 md:top-8 left-1/2 -translate-x-1/2 text-luxury-gold text-sm md:text-base tracking-widest font-medium z-20">
              {galleryIndex + 1} / {allGalleryImages.length}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => setGalleryIndex((galleryIndex - 1 + allGalleryImages.length) % allGalleryImages.length)}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold hover:bg-white/20 transition-all"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            {/* Main image */}
            <div className="absolute top-16 bottom-24 left-4 right-4 md:top-20 md:bottom-28 md:left-20 md:right-20 flex items-center justify-center">
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

            {/* Thumbnail strip */}
            <div
              ref={thumbnailStripRef}
              className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-16 md:right-16 overflow-x-auto scrollbar-hide cursor-grab"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={handleThumbnailMouseDown}
              onMouseMove={handleThumbnailMouseMove}
              onMouseUp={handleThumbnailMouseUp}
              onMouseLeave={handleThumbnailMouseUp}
            >
              <div className="flex gap-2 md:gap-3 justify-start md:justify-center min-w-max md:min-w-0 px-2">
                {allGalleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`flex-shrink-0 w-14 h-10 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                      galleryIndex === i ? 'ring-2 ring-luxury-gold opacity-100' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== BOOKING MODAL ===== */}
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(11,28,38,0.95)' }}>
            <div
              className="relative w-full max-w-lg p-6 md:p-8 rounded-[24px] border border-white/10"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}
            >
              <button
                onClick={() => { setBookingModalOpen(false); setBookingStatus('idle'); setBookingErrors({}); }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              {bookingStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-luxury-gold/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-serif text-white mb-2">Request Sent</h3>
                  <p className="text-white/60 text-sm">We'll contact you shortly to confirm your charter.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-serif text-white mb-2">Request Charter</h3>
                  <p className="text-white/50 text-sm mb-6">{yacht.nombre}</p>

                  {/* Summary */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Date</span>
                      <span className="text-white">{charterDate || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Duration</span>
                      <span className="text-white">{duration === '4h' ? '4 Hours' : duration === '6h' ? '6 Hours' : duration === '8h' ? '8 Hours' : 'Full Day'}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                      <span className="text-white/50">Total</span>
                      <span className="text-luxury-gold font-medium">€{calculatePrice().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={bookingForm.name}
                        onChange={(e) => { setBookingForm({ ...bookingForm, name: e.target.value }); setBookingErrors({ ...bookingErrors, name: '' }); }}
                        className={`w-full bg-white/5 border ${bookingErrors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-luxury-gold transition-colors`}
                      />
                      {bookingErrors.name && <span className="text-red-400 text-xs mt-1">{bookingErrors.name}</span>}
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email *"
                        value={bookingForm.email}
                        onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); setBookingErrors({ ...bookingErrors, email: '' }); }}
                        className={`w-full bg-white/5 border ${bookingErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-luxury-gold transition-colors`}
                      />
                      {bookingErrors.email && <span className="text-red-400 text-xs mt-1">{bookingErrors.email}</span>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone *"
                        value={bookingForm.phone}
                        onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); setBookingErrors({ ...bookingErrors, phone: '' }); }}
                        className={`w-full bg-white/5 border ${bookingErrors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-luxury-gold transition-colors`}
                      />
                      {bookingErrors.phone && <span className="text-red-400 text-xs mt-1">{bookingErrors.phone}</span>}
                    </div>
                    <div>
                      <textarea
                        placeholder="Additional requests (optional)"
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={bookingStatus === 'submitting'}
                      className="w-full py-3.5 rounded-full bg-luxury-gold text-luxury-blue text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all duration-500 disabled:opacity-50"
                    >
                      {bookingStatus === 'submitting' ? 'Sending...' : 'Send Request'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <FooterSEO
          onNavigate={onNavigate}
          lang={lang}
          title={`${yacht.nombre} | Luxury Yacht Charter`}
          description={yacht.description || `Charter the ${yacht.nombre} for an unforgettable experience in Ibiza waters.`}
          links={[
            { label: "All Yachts", view: 'boats-yachts' },
            { label: "Catamarans", view: 'boats-catamarans' },
            { label: "Luxury Villas", view: 'villas-holiday' },
            { label: "Contact Us", view: 'contact' },
          ]}
        />
      </div>
    </div>
  );
};

export default YachtDetailPage;
