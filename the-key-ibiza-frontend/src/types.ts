// ============================================
// LANGUAGES
// ============================================

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ru' | 'zh' | 'ja';

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
  { code: 'nl', native: 'Nederlands' },
  { code: 'ru', native: 'Русский' },
  { code: 'zh', native: '中文' },
  { code: 'ja', native: '日本語' }
];

// ============================================
// VILLA TYPE - MASTER STRUCTURE
// ============================================

export interface VillaSpecs {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  priceRangePerWeek: string;
}

export interface WeeklyRate {
  month: string;
  pricePerWeek: string;
}

export interface VillaAvailability {
  calendarMonthsVisible: number;
  scrollable: boolean;
  icsSyncAvailable: boolean;
}

export interface ImportantInformation {
  maxPersonsPriceInfo: string;
  arrivalPolicy: string;
  minimumStay: string;
  finalCleaning: string;
  reservationDeposit: string;
  securityDeposit: string;
  ecotax: string;
  checkIn: string;
  checkOut: string;
  servicesIncluded: string;
}

export interface VillaMap {
  island: string;
  latitude: number;
  longitude: number;
  googleMapsLink: string;
}

export interface ContactSection {
  teamImage: string;
  contactEmail: string;
  contactPhone: string;
}

export interface VillaReview {
  name: string;
  rating: number;
  message: string;
  image?: string;
}

export interface ReviewForm {
  fields: string[];
}

export interface VillaFooter {
  companyName: string;
  logo: string;
  socials: {
    instagram: string;
    whatsapp: string;
    email: string;
  };
}

export interface Villa {
  id: string;
  name: string;
  location: string;
  tagline?: string;
  isPrivate?: boolean;
  heroPhotos: string[];
  specs: VillaSpecs;
  description: string;
  gallery: string[];
  amenities: string[];
  weeklyRates: WeeklyRate[];
  availability: VillaAvailability;
  importantInformation: ImportantInformation;
  conciergeNote: string;
  map: VillaMap;
  contactSection: ContactSection;
  reviews: VillaReview[];
  reviewForm: ReviewForm;
  seoDescription: string;
  footer: VillaFooter;
  listingType: 'holiday' | 'longterm' | 'sale';
  category: 'Modern' | 'Traditional' | 'Cliffs' | 'Beachfront' | 'Luxury' | 'Countryside';
}

// ============================================
// TIPOS PARA VILLA LISTING PAGE
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
// LEGACY VILLA TYPE (para home page y componentes antiguos)
// ============================================

export interface SeasonalPrice {
  month: string;
  price: string;
}

export interface LegacyVilla {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  price: string;
  priceRange?: string;
  numericPrice?: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  imageUrl: string;
  headerImages?: string[];
  category: 'Modern' | 'Traditional' | 'Cliffs' | 'Beachfront';
  listingType: 'holiday' | 'longterm' | 'sale';
  fullDescription: string[];
  features: string[];
  seasonalPrices?: SeasonalPrice[];
  locationMapUrl?: string;
  distances?: { label: string; time: string }[];
  gallery?: string[];
  amenities?: string[];
  availability?: { from: string; to: string }[];
  isPrivate?: boolean;
  weeklyRatesRaw?: string;
}

// ============================================
// OTROS TIPOS
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
