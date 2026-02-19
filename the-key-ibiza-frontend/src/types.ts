// ============================================
// LANGUAGES
// ============================================

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ar' | 'hi';

export interface LanguageOption {
  code: Language;
  native: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', native: 'English' },
  { code: 'es', native: 'Español' },
  { code: 'fr', native: 'Français' },
  { code: 'de', native: 'Deutsch' },
  { code: 'it', native: 'Italiano' },
  { code: 'pt', native: 'Português' },
  { code: 'ru', native: 'Русский' },
  { code: 'zh', native: '中文' },
  { code: 'ar', native: 'العربية' },
  { code: 'hi', native: 'हिन्दी' }
];

// ============================================
// VILLA FILTER STATE
// ============================================

export interface VillaFilterState {
  checkIn: string;
  checkOut: string;
  bedrooms: number | null;
  priceMin: number | null;
  priceMax: number | null;
  location: string;
  searchText: string;
  amenities: string[];
}

export interface AmenityOption {
  id: string;
  label: string;
}

export interface LocationOption {
  id: string;
  label: string;
}

// ============================================
// VILLA TYPE (flat structure matching backend)
// ============================================

export interface SeasonalPrice {
  month: string;
  price: string;
}

export interface Villa {
  id: string;
  name: string;
  location: string;
  shortDescription?: string;
  price: string;
  priceRange?: string;
  numericPrice?: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  imageUrl: string;
  headerImages?: string[];
  thumbnailImages?: string[]; // Thumbnails for fast loading on listing page
  category?: 'Modern' | 'Traditional' | 'Cliffs' | 'Beachfront' | 'Luxury' | 'Countryside';
  district?: string;
  listingType?: 'holiday' | 'longterm' | 'sale';
  fullDescription?: string[];
  features?: string[];
  seasonalPrices?: SeasonalPrice[];
  locationMapUrl?: string;
  distances?: { label: string; time: string }[];
  gallery?: string[];
  amenities?: string[];
  availability?: { from: string; to: string }[];
  occupiedDates?: string[];
  isPrivate?: boolean;
  weeklyRatesRaw?: string;
  latitude?: number;
  longitude?: number;
  conciergeNote?: string;
  minStay?: string;
  checkIn?: string;
  checkOut?: string;
  arrivalPolicy?: string;
  reservationDeposit?: string;
  securityDeposit?: string;
  ecotax?: string;
  finalCleaning?: string;
  servicesIncluded?: string;
  visibility?: 'public' | 'private';
  icalUrl?: string;
}

// ============================================
// OTHER TYPES
// ============================================

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
