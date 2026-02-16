import { LegacyVilla, SeasonalPrice } from '../types';

const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app/villas';

// ---------- UTILIDADES ----------
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ''));
    return obj;
  });
  return rows;
}

function parsePipeSeparated(value?: string): string[] {
  if (!value) return [];
  return value.split('|').map(s => s.trim()).filter(Boolean);
}

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[€\s]/g, '')) || 0;
}

function parseWeeklyRates(ratesStr?: string): SeasonalPrice[] {
  if (!ratesStr) return [];
  return parsePipeSeparated(ratesStr).map(r => {
    const match = r.match(/(\d{2}-\d{2})\s*to\s*(\d{2}-\d{2}):\s*€([\d\s]+)/);
    if (match) {
      return { month: `${match[1]} - ${match[2]}`, price: match[3].replace(/\s/g, '') };
    }
    return { month: r, price: '' };
  }).filter(r => r.price);
}

// ---------- MAPEO ----------
function csvRowToVilla(row: any): LegacyVilla {
  const minPrice = parsePrice(row.price_min_week);
  const maxPrice = parsePrice(row.price_max_week) || minPrice;
  const headerImagesArray = parsePipeSeparated(row.header_images);

  return {
    id: row.slug || '',
    name: row.villa_name || '',
    location: row.location || '',
    shortDescription: row.short_description || '',
    price: minPrice > 0 ? `From €${minPrice.toLocaleString()}` : 'On Request',
    priceRange: minPrice && maxPrice ? `€${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}` : undefined,
    numericPrice: minPrice,
    bedrooms: parseInt(row.bedrooms) || 0,
    bathrooms: parseInt(row.bathrooms) || 0,
    maxGuests: parseInt(row.max_persons) || 0,
    imageUrl: headerImagesArray[0] || '',
    headerImages: headerImagesArray,
    category: 'Modern',
    listingType: 'holiday',
    fullDescription: row.description ? row.description.split('\n\n').filter(Boolean) : [],
    features: parsePipeSeparated(row.amenities),
    seasonalPrices: parseWeeklyRates(row.weekly_rates),
    locationMapUrl: row.location_lat && row.location_lng
      ? `https://www.google.com/maps?q=${row.location_lat},${row.location_lng}&z=15`
      : undefined,
    gallery: parsePipeSeparated(row.gallery_images),
    amenities: parsePipeSeparated(row.amenities),
    availability: undefined,
    isPrivate: row.visibility?.toLowerCase() === 'private',
  };
}

// ---------- FETCH VILLAS ----------
let cachedVillas: LegacyVilla[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000;

export async function fetchVillas(): Promise<LegacyVilla[]> {
  const now = Date.now();
  if (cachedVillas && (now - lastFetchTime) < CACHE_DURATION) return cachedVillas;

  try {
    const res = await fetch(BACKEND_URL);
    if (!res.ok) throw new Error(`Failed to fetch villas: ${res.status}`);
    const json = await res.json();
    const villas: LegacyVilla[] = json.data || [];
    cachedVillas = villas;
    lastFetchTime = now;
    return villas;
  } catch (e) {
    console.error('Error fetching villas:', e);
    return cachedVillas || [];
  }
}

// ---------- FILTROS ----------
export function getPublicVillas(villas: LegacyVilla[]): LegacyVilla[] {
  return villas.filter(v => !v.isPrivate);
}

export function getAllVillas(villas: LegacyVilla[]): LegacyVilla[] {
  return villas;
}

export function getVillaBySlug(villas: LegacyVilla[], slug: string): LegacyVilla | undefined {
  return villas.find(v => v.id === slug);
}

// ---------- UBICACIONES ÚNICAS ----------
export function getUniqueLocations(villas: LegacyVilla[]): string[] {
  return [...new Set(villas.map(v => v.location).filter(Boolean))];
}

// ---------- CALCULAR PRECIO ----------
export function calculateStayPrice(
  checkIn: Date,
  checkOut: Date,
  weeklyRatesRaw: string,
  defaultWeeklyPrice: number
) {
  const totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (totalNights <= 0) return { totalNights: 0, breakdown: [], total: 0 };

  const breakdown: { period: string; nights: number; rate: number; subtotal: number }[] = [];
  let total = 0;

  const nightsByPeriod: { [key: string]: { nights: number; rate: number } } = {};

  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    const month = d.toLocaleString('en', { month: 'short' });
    const rate = parseInt(weeklyRatesRaw.replace(/[^\d]/g, '')) || defaultWeeklyPrice;
    const key = `${month}:${rate}`;
    if (!nightsByPeriod[key]) nightsByPeriod[key] = { nights: 0, rate };
    nightsByPeriod[key].nights++;
  }

  Object.entries(nightsByPeriod).forEach(([key, data]) => {
    const [month] = key.split(':');
    const subtotal = Math.round((data.nights / 7) * data.rate);
    total += subtotal;
    breakdown.push({ period: month, nights: data.nights, rate: data.rate, subtotal });
  });

  return { totalNights, breakdown, total };
}
