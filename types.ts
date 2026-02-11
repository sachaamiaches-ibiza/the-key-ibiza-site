
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ar' | 'hi' | 'ru';

export const languages: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
];

export interface SeasonalPrice {
  month: string;
  price: string;
}

export interface Villa {
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
  category: 'Modern' | 'Traditional' | 'Cliffs' | 'Beachfront';
  listingType: 'holiday' | 'longterm' | 'sale';
  fullDescription: string[];
  features: string[];
  seasonalPrices?: SeasonalPrice[];
  locationMapUrl?: string;
  distances?: { label: string; time: string }[];
  gallery?: string[];
  // Fields from CSV
  visibility: 'public' | 'private';
  minStay?: string;
  checkIn?: string;
  checkOut?: string;
  arrivalPolicy?: string;
  reservationDeposit?: string;
  securityDeposit?: string;
  ecotax?: string;
  servicesIncluded?: string;
  finalCleaning?: string;
  occupiedDates?: string[];
  icalUrl?: string;
  latitude?: number;
  longitude?: number;
  mapRadiusKm?: number;
  conciergeNote?: string;
  weeklyRatesRaw?: string;
  seoKeywords?: string;
  headerImages?: string[];
}

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
