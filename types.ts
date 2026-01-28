
export type Language = 'en' | 'es' | 'fr';

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
