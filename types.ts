
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
  shortDescription: string; // Added for the card's descriptive phrase
  price: string; // Etiqueta general (ej: "Desde 12.000€")
  priceRange?: string; // Rango (ej: "12.000€ - 25.000€")
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
