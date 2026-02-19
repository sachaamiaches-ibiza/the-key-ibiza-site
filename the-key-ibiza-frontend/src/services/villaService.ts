import { Villa, SeasonalPrice } from '../types';

// Backend URL - production only (Vercel)
const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';

// ---------- UTILIDADES ----------
function parsePipeSeparated(value?: string | null): string[] {
  if (!value) return [];
  return value.split('|').map(s => s.trim()).filter(Boolean);
}

function parsePrice(priceStr?: string | number | null): number {
  if (!priceStr) return 0;
  if (typeof priceStr === 'number') return priceStr;
  return parseInt(priceStr.replace(/[€\s,]/g, '')) || 0;
}

function parseWeeklyRates(ratesStr?: string | null): SeasonalPrice[] {
  if (!ratesStr) return [];
  return parsePipeSeparated(ratesStr)
    .map(r => {
      // Match patterns like "01-01 to 03-31: €15000" or "01-01 - 03-31: 15000"
      const match = r.match(/(\d{2}-\d{2})\s*(?:to|-)\s*(\d{2}-\d{2}):\s*€?([\d\s,]+)/);
      if (match) {
        return { month: `${match[1]} - ${match[2]}`, price: match[3].replace(/[\s,]/g, '') };
      }
      return { month: r, price: '' };
    })
    .filter(r => r.price);
}

// ---------- HELPER: Parse array from JSON or pipe-separated string ----------
function parseArrayField(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return parsePipeSeparated(value);
  return [];
}

// ---------- HELPER: Format date like "01-01" to "01 Jan" ----------
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateRange(period: string): string {
  // Handle format "MM-DD_MM-DD" like "01-01_03-31"
  const parts = period.split('_');
  if (parts.length === 2) {
    const [start, end] = parts;
    const [startMonth, startDay] = start.split('-').map(Number);
    const [endMonth, endDay] = end.split('-').map(Number);

    if (startMonth >= 1 && startMonth <= 12 && endMonth >= 1 && endMonth <= 12) {
      const startFormatted = `${String(startDay).padStart(2, '0')} ${MONTH_NAMES[startMonth - 1]}`;
      const endFormatted = `${String(endDay).padStart(2, '0')} ${MONTH_NAMES[endMonth - 1]}`;
      return `${startFormatted} - ${endFormatted}`;
    }
  }
  // Fallback to original format
  return period.replace(/_/g, ' - ');
}

// ---------- HELPER: Parse weekly rates from JSON object or string ----------
function parseWeeklyRatesField(value: any): SeasonalPrice[] {
  if (!value) return [];
  // If it's a JSON object like {"01-01_03-31": 4800, ...}
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).map(([period, price]) => ({
      month: formatDateRange(period),
      price: String(price)
    }));
  }
  // If it's a string, use the old parser
  if (typeof value === 'string') return parseWeeklyRates(value);
  return [];
}

// ---------- MAPEO API RESPONSE -> VILLA ----------
function apiRowToVilla(row: any): Villa {
  const minPrice = parsePrice(row.price_min_week);
  const maxPrice = parsePrice(row.price_max_week) || minPrice;
  const headerImagesArray = parseArrayField(row.header_images);
  const galleryImagesArray = parseArrayField(row.gallery_images);
  const amenitiesArray = parseArrayField(row.amenities);

  // Parse description - split by double newlines for paragraphs
  const descriptionParagraphs = row.description
    ? row.description.split(/\n\n+/).filter(Boolean)
    : [];

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
    fullDescription: descriptionParagraphs,
    features: amenitiesArray,
    seasonalPrices: parseWeeklyRatesField(row.weekly_rates),
    locationMapUrl:
      row.location_lat && row.location_lng
        ? `https://www.google.com/maps?q=${row.location_lat},${row.location_lng}&z=15`
        : undefined,
    latitude: row.location_lat ? parseFloat(row.location_lat) : undefined,
    longitude: row.location_lng ? parseFloat(row.location_lng) : undefined,
    gallery: galleryImagesArray,
    amenities: amenitiesArray,
    availability: row.availability || undefined,
    isPrivate: row.visibility === false,
    visibility: row.visibility === false ? 'private' : 'public',
    // Additional fields
    minStay: row.min_stay || '7 nights',
    checkIn: row.check_in || '16:00',
    checkOut: row.check_out || '10:00',
    arrivalPolicy: row.arrival_policy || 'Flexible',
    reservationDeposit: row.reservation_deposit || '50%',
    securityDeposit: row.security_deposit || '€5,000',
    ecotax: row.ecotax || 'Included',
    servicesIncluded: row.services_included || 'Cleaning, Concierge',
    finalCleaning: row.final_cleaning || 'Included',
    conciergeNote: row.concierge_note || undefined,
    icalUrl: row.ical_url || undefined,
  };
}

// ---------- FETCH ALL VILLAS FROM BACKEND ----------
export async function fetchVillas(): Promise<Villa[]> {
  try {
    // Include VIP token if available to see private villas
    const token = localStorage.getItem('vip_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/villas`, { headers });

    if (!res.ok) {
      console.error('❌ Backend error:', res.status);
      return [];
    }

    const json = await res.json();

    // Parse response - handle both array and { data: [] } formats
    const rawVillas = Array.isArray(json) ? json : (json.data || []);
    const villas = rawVillas.map(apiRowToVilla);

    console.log('✅ VILLAS FETCHED FROM BACKEND:', villas.length);
    return villas;
  } catch (e) {
    console.error('❌ Error fetching villas:', e);
    return [];
  }
}

// ---------- FETCH SINGLE VILLA BY SLUG ----------
export async function fetchVillaBySlug(slug: string): Promise<Villa | null> {
  try {
    const token = localStorage.getItem('vip_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/villas/${slug}`, { headers });

    if (!res.ok) {
      console.error('❌ Backend error fetching villa:', res.status);
      return null;
    }

    const data = await res.json();

    if (!data) return null;

    const villa = apiRowToVilla(data);
    console.log('✅ VILLA FETCHED FROM BACKEND:', villa.name);
    return villa;
  } catch (e) {
    console.error('❌ Error fetching villa:', e);
    return null;
  }
}

// ---------- FILTROS ----------
export function getPublicVillas(villas: Villa[]): Villa[] {
  return villas.filter(v => !v.isPrivate);
}

export function getAllVillas(villas: Villa[]): Villa[] {
  return villas;
}

export function getVillaBySlug(villas: Villa[], slug: string): Villa | undefined {
  return villas.find(v => v.id === slug);
}

// ---------- UBICACIONES ÚNICAS ----------
export function getUniqueLocations(villas: Villa[]): string[] {
  return [...new Set(villas.map(v => v.location).filter(Boolean))];
}

// ---------- CALCULAR PRECIO ----------
export function calculateStayPrice(
  checkIn: Date,
  checkOut: Date,
  weeklyRatesRaw: string,
  defaultWeeklyPrice: number
) {
  const totalNights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (totalNights <= 0) return { totalNights: 0, breakdown: [], total: 0 };

  const breakdown: { period: string; nights: number; rate: number; subtotal: number }[] = [];
  let total = 0;

  const nightsByPeriod: { [key: string]: { nights: number; rate: number } } = {};

  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    const month = d.toLocaleString('en', { month: 'short' });
    const rate =
      parseInt(weeklyRatesRaw.replace(/[^\d]/g, '')) || defaultWeeklyPrice;
    const key = `${month}:${rate}`;
    if (!nightsByPeriod[key]) nightsByPeriod[key] = { nights: 0, rate };
    nightsByPeriod[key].nights++;
  }

  Object.entries(nightsByPeriod).forEach(([key, data]) => {
    const [month] = key.split(':');
    const subtotal = Math.round((data.nights / 7) * data.rate);
    total += subtotal;
    breakdown.push({
      period: month,
      nights: data.nights,
      rate: data.rate,
      subtotal,
    });
  });

  return { totalNights, breakdown, total };
}
