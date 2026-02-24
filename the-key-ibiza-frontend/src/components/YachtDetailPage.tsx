
import React, { useEffect, useState, useRef } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { LogoTheKey } from './Navbar';
import { useIsMobile } from './useIsMobile';
import WatermarkedImage from './WatermarkedImage';
import FooterSEO from './FooterSEO';

// Backend URL for Cloudinary API
const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';

// Video file extensions
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];

// Check if URL is a video
function isVideoUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return VIDEO_EXTENSIONS.some(ext => lowerUrl.includes(ext)) || lowerUrl.includes('/video/');
}

// Cache for Cloudinary folder media
const cloudinaryCache: { [folder: string]: { images: string[]; videos: string[] } } = {};

// Fetch media (images + videos) from Cloudinary folder
async function fetchCloudinaryMedia(folderPath: string): Promise<{ images: string[]; videos: string[] }> {
  if (cloudinaryCache[folderPath]) {
    return cloudinaryCache[folderPath];
  }

  try {
    const res = await fetch(`${BACKEND_URL}/cloudinary/images?folder=${encodeURIComponent(folderPath)}`);
    if (!res.ok) {
      console.warn(`⚠️ Cloudinary folder not found: ${folderPath}`);
      return { images: [], videos: [] };
    }
    const data = await res.json();
    const allMedia = data.images || [];

    // Separate videos from images
    const videos = allMedia.filter((url: string) => isVideoUrl(url));
    const images = allMedia.filter((url: string) => !isVideoUrl(url));

    const result = { images, videos };
    cloudinaryCache[folderPath] = result;
    console.log(`📁 Cloudinary folder ${folderPath}: ${images.length} images, ${videos.length} videos`);
    return result;
  } catch (e) {
    console.error(`❌ Error fetching Cloudinary folder ${folderPath}:`, e);
    return { images: [], videos: [] };
  }
}

// Yacht interface for detail page (images fetched from Cloudinary)
interface Yacht {
  id: string;
  nombre: string;
  pax_max: number;
  amarre: string;
  metros: number;
  localidad: string;
  description: string;
  // Price fields
  price_min_day?: number;
  price_max_day?: number;
  daily_rates?: Record<string, number>;
  crew_members?: number;
  cabins?: number;
  year_built?: number;
  fuel_included?: boolean;
  min_charter_hours?: number;
}

interface YachtDetailPageProps {
  yacht: Yacht;
  onNavigate: (view: string) => void;
  lang: Language;
  initialDate?: string;
  onDateChange?: (date: string) => void;
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

const YachtDetailPage: React.FC<YachtDetailPageProps> = ({ yacht, onNavigate, lang, initialDate = '', onDateChange }) => {
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

  // Date selection state (synced with parent)
  const [charterDate, setCharterDate] = useState(initialDate);

  // Sync date changes to parent
  useEffect(() => {
    if (onDateChange) {
      onDateChange(charterDate);
    }
  }, [charterDate, onDateChange]);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});

  // Inline calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Touch swipe
  const touchStartX = useRef(0);

  // Media from Cloudinary (fetched on mount)
  const [slideshowImages, setSlideshowImages] = useState<string[]>([]);
  const [headerVideo, setHeaderVideo] = useState<string | null>(null);
  const [allGalleryImages, setAllGalleryImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  // Fetch media from Cloudinary folders on mount
  useEffect(() => {
    async function loadMedia() {
      if (!yacht.nombre) {
        setImagesLoading(false);
        return;
      }

      setImagesLoading(true);
      try {
        // Folder structure: Yates/{yacht name}/Header and Yates/{yacht name}/Gallery
        const [headerMedia, galleryMedia] = await Promise.all([
          fetchCloudinaryMedia(`Yates/${yacht.nombre}/Header`),
          fetchCloudinaryMedia(`Yates/${yacht.nombre}/Gallery`)
        ]);

        // If there's a video in Header folder, use it as header
        if (headerMedia.videos.length > 0) {
          setHeaderVideo(headerMedia.videos[0]);
        } else {
          setHeaderVideo(null);
        }

        setSlideshowImages(headerMedia.images);
        // Use gallery images, or fall back to header images if no gallery
        const galleryImgs = galleryMedia.images.length > 0 ? galleryMedia.images : headerMedia.images;
        setAllGalleryImages(galleryImgs);
      } catch (e) {
        console.error('Error loading yacht media:', e);
      } finally {
        setImagesLoading(false);
      }
    }

    loadMedia();
  }, [yacht.nombre]);

  // Parse daily rates
  const dailyRates = yacht.daily_rates || {};

  // Calculate price
  const minPrice = yacht.price_min_day || 0;
  const maxPrice = yacht.price_max_day || minPrice;

  // Get today's date string for min date
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calculate price for selected date based on daily_rates
  const getPriceForDate = (dateStr: string): number | null => {
    if (!dateStr || Object.keys(dailyRates).length === 0) return null;

    const selectedDate = new Date(dateStr);
    const selectedMonth = selectedDate.getMonth() + 1; // 1-12
    const selectedDay = selectedDate.getDate();

    // Find matching rate period (format: "MM-DD_MM-DD")
    for (const [period, price] of Object.entries(dailyRates)) {
      const match = period.match(/(\d{2})-(\d{2})_(\d{2})-(\d{2})/);
      if (match) {
        const [, startMonth, startDay, endMonth, endDay] = match.map(Number);

        // Create comparison values (month * 100 + day for easy comparison)
        const selectedValue = selectedMonth * 100 + selectedDay;
        const startValue = startMonth * 100 + startDay;
        const endValue = endMonth * 100 + endDay;

        // Handle year wrap-around (e.g., 10-01 to 01-01)
        if (startValue <= endValue) {
          // Normal range (e.g., 01-01 to 03-31)
          if (selectedValue >= startValue && selectedValue <= endValue) {
            return Number(price);
          }
        } else {
          // Wrap-around range (e.g., 10-01 to 01-01)
          if (selectedValue >= startValue || selectedValue <= endValue) {
            return Number(price);
          }
        }
      }
    }

    // Fallback to min price if no matching period
    return minPrice || null;
  };

  // Calculated price for selected date
  const selectedDatePrice = getPriceForDate(charterDate);

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

    const formData = new FormData();
    formData.append('name', bookingForm.name);
    formData.append('email', bookingForm.email);
    formData.append('phone', bookingForm.phone);
    formData.append('yacht', yacht.nombre);
    formData.append('date', charterDate || 'Not specified');
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
      const body = encodeURIComponent(`Name: ${bookingForm.name}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nYacht: ${yacht.nombre}\nDate: ${charterDate || 'Not specified'}\nMessage: ${bookingForm.message || 'None'}`);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
      setBookingStatus('success');
    }
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Generate calendar days for a month
  const generateCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  // Check if date is in the past
  const isDateInPast = (day: number, month: number, year: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
  };

  // Month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Render charter section content
  const renderCharterContent = (compact: boolean) => (
    <>
      <h3 className="text-base md:text-lg font-serif text-white mb-4 md:mb-6 tracking-wide text-center">
        Select Your Date
      </h3>

      {/* Inline Calendar */}
      <div className="mb-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
              else { setCalendarMonth(calendarMonth - 1); }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-luxury-gold hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <span className="text-white text-sm font-medium">{monthNames[calendarMonth]} {calendarYear}</span>
          <button
            onClick={() => {
              if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
              else { setCalendarMonth(calendarMonth + 1); }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-luxury-gold hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
            <div key={day} className="text-center text-[10px] text-white/30 font-medium">{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays(calendarMonth, calendarYear).map((day, i) => {
            if (!day) return <div key={i} className="aspect-square"></div>;

            const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = dateStr === charterDate;
            const isPast = isDateInPast(day, calendarMonth, calendarYear);

            return (
              <button
                key={i}
                disabled={isPast}
                onClick={() => !isPast && setCharterDate(dateStr)}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all
                  ${isPast ? 'text-white/20 cursor-not-allowed' : 'hover:bg-luxury-gold/20 cursor-pointer'}
                  ${isSelected ? 'bg-luxury-gold text-luxury-blue font-bold' : 'text-white/70'}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Selected date display */}
        {charterDate && (
          <div className="mt-4 text-center">
            <span className="text-luxury-gold text-sm">{formatDisplayDate(charterDate)}</span>
          </div>
        )}
      </div>

      {/* Price Display */}
      {!charterDate ? (
        <p className="text-white/40 text-xs text-center italic mb-6">
          Select a date to see the price
        </p>
      ) : selectedDatePrice ? (
        <div className="border-t border-white/10 pt-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/50 text-xs">8-hour charter</span>
            <span className="text-white/80 text-sm">€{selectedDatePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <span className="text-white text-sm font-medium">Total</span>
            <span className="text-luxury-gold text-lg font-serif">€{selectedDatePrice.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p className="text-white/40 text-xs text-center italic mb-6">
          Price on request
        </p>
      )}

      {/* Request Button */}
      <button
        onClick={() => setBookingModalOpen(true)}
        className="w-full py-3.5 md:py-4 rounded-full bg-luxury-gold text-luxury-blue text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all duration-500"
      >
        Request Charter
      </button>
    </>
  );

  return (
    <div style={{ backgroundColor: '#0B1C26' }}>
      {/* ===== HEADER VIDEO/SLIDESHOW ===== */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
        {imagesLoading ? (
          <div className="absolute inset-0 bg-luxury-slate flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
              <span className="text-white/40 text-sm">Loading media...</span>
            </div>
          </div>
        ) : headerVideo ? (
          /* Video Header */
          <div className="absolute inset-0 w-full h-full">
            <video
              src={headerVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C26]/60 via-transparent to-[#0B1C26]"></div>
          </div>
        ) : slideshowImages.length > 0 ? (
          /* Image Slideshow */
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
            <span className="text-white/30 text-lg">No media available</span>
          </div>
        )}

        {/* Navigation Arrows (only for images, not video) */}
        {!headerVideo && slideshowImages.length > 1 && (
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

        {/* Dot Indicators (only for images, not video) */}
        {!headerVideo && slideshowImages.length > 1 && (
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
          <div
            className="p-5 max-w-sm mx-auto rounded-[24px] md:rounded-[32px] border border-white/6"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
          >
            {renderCharterContent(true)}
          </div>
        </div>

        {/* ===== DESCRIPTION + CHARTER (Desktop) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 py-8 md:py-16">
          {/* Description */}
          <div className="lg:col-span-3 text-white/65 text-base md:text-lg font-light leading-relaxed">
            {yacht.description ? (
              renderFormattedText(yacht.description)
            ) : (
              <p className="text-white/40 italic">Contact us for more details about this yacht.</p>
            )}
          </div>

          {/* Charter Section (Desktop) */}
          <div className="hidden lg:block lg:col-span-2">
            <div
              className="p-6 lg:p-8 rounded-[24px] md:rounded-[32px] border border-white/6"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
            >
              {renderCharterContent(false)}
            </div>
          </div>
        </div>

        {/* ===== GALLERY ===== */}
        {allGalleryImages.length > 0 && (
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
        )}

        {/* ===== RATES + SPECS ===== */}
        <div className={`grid gap-6 md:gap-8 py-10 md:py-12 ${Object.keys(dailyRates).length > 0 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
          {/* Daily Rates */}
          {Object.keys(dailyRates).length > 0 && (
            <div
              className="p-6 md:p-8 lg:p-10 rounded-[24px] md:rounded-[32px] border border-white/6"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}
            >
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-serif text-white tracking-wide">Daily Rates</h3>
                <p className="text-[10px] md:text-xs text-white/40 font-light tracking-wider mt-1.5 uppercase">8-hour charter prices</p>
              </div>
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
          <button
            onClick={() => onNavigate('services')}
            className="mt-2 px-6 py-3 md:px-8 md:py-3.5 rounded-full bg-transparent border border-luxury-gold/50 text-luxury-gold text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium hover:bg-luxury-gold hover:text-luxury-blue transition-all duration-500"
          >
            Explore Our Services
          </button>
        </div>

        {/* ===== GALLERY MODAL - Full screen with scroll prevention ===== */}
        {galleryOpen && (
          <div
            ref={galleryRef}
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'rgba(11,28,38,0.98)', touchAction: 'none', zIndex: 999999 }}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            {/* Close button - prominent X */}
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-luxury-gold hover:text-luxury-blue transition-all"
              style={{ zIndex: 9999999 }}
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
            <div
              className="absolute top-16 bottom-24 left-4 right-4 md:top-20 md:bottom-28 md:left-20 md:right-20 flex items-center justify-center"
              style={{ maxHeight: 'calc(100vh - 160px)' }}
            >
              <div style={{ maxHeight: 'calc(100vh - 200px)', maxWidth: 'calc(100vw - 160px)' }}>
                <WatermarkedImage
                  src={allGalleryImages[galleryIndex]}
                  className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl md:rounded-2xl shadow-2xl"
                  alt=""
                  watermarkSize="gallery"
                />
              </div>
            </div>

            <button
              onClick={() => setGalleryIndex((galleryIndex + 1) % allGalleryImages.length)}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-luxury-gold hover:bg-white/20 transition-all"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Thumbnail strip - scrollable with drag */}
            <div
              ref={thumbnailStripRef}
              className="absolute bottom-3 md:bottom-6 left-4 right-4 flex gap-2 md:gap-3 overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              onMouseDown={(e) => {
                isDraggingThumbnails.current = true;
                thumbnailStartX.current = e.pageX - (thumbnailStripRef.current?.offsetLeft || 0);
                thumbnailScrollLeft.current = thumbnailStripRef.current?.scrollLeft || 0;
                if (thumbnailStripRef.current) thumbnailStripRef.current.style.cursor = 'grabbing';
              }}
              onMouseMove={(e) => {
                if (!isDraggingThumbnails.current || !thumbnailStripRef.current) return;
                e.preventDefault();
                const x = e.pageX - (thumbnailStripRef.current.offsetLeft || 0);
                const walk = (x - thumbnailStartX.current) * 1.5;
                thumbnailStripRef.current.scrollLeft = thumbnailScrollLeft.current - walk;
              }}
              onMouseUp={() => {
                isDraggingThumbnails.current = false;
                if (thumbnailStripRef.current) thumbnailStripRef.current.style.cursor = 'grab';
              }}
              onMouseLeave={() => {
                isDraggingThumbnails.current = false;
                if (thumbnailStripRef.current) thumbnailStripRef.current.style.cursor = 'grab';
              }}
            >
              {allGalleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => !isDraggingThumbnails.current && setGalleryIndex(i)}
                  className={`flex-shrink-0 w-14 h-10 md:w-20 md:h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${galleryIndex === i ? 'border-luxury-gold scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover pointer-events-none select-none" alt="" draggable={false} />
                </div>
              ))}
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
                  {charterDate && (
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Selected Date</span>
                        <span className="text-luxury-gold">{charterDate}</span>
                      </div>
                    </div>
                  )}

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
