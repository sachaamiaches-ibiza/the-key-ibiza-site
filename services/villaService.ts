
import { Villa, SeasonalPrice } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6iifLyOIwL1CyEgHcB1nkgRSDWG1gBpnULZUXPcXXp0kvU8oBD8ilEMR_DMPmOT7RxQYon1JFw6UK/pub?gid=0&single=true&output=csv';

interface CSVRow {
  slug: string;
  villa_name: string;
  visibility: string;
  short_description: string;
  location: string;
  price_min_week: string;
  price_max_week: string;
  description: string;
  header_images: string;
  gallery_images: string;
  amenities: string;
  max_persons: string;
  bedrooms: string;
  bathrooms: string;
  min_stay: string;
  check_in: string;
  check_out: string;
  arrival_policy: string;
  reservation_deposit: string;
  security_deposit: string;
  ecotax: string;
  services_included: string;
  'final cleaning': string;
  weekly_rates: string;
  availability: string;
  ical_url: string;
  location_lat: string;
  location_lng: string;
  map_radius_km: string;
  concierge_note: string;
  seo_keywords: string;
}

function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || !values[0]) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] || '';
    });
    rows.push(row as CSVRow);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

// Parse pipe-separated values (used for images, amenities, weekly_rates)
function parsePipeSeparated(value: string): string[] {
  if (!value) return [];
  return value.split('|').map(s => s.trim()).filter(s => s.length > 0);
}

// Parse price string like "€4 800" or "€15 000" to number
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[€\s,]/g, '').replace(/\s/g, '');
  return parseInt(cleaned) || 0;
}

// Parse weekly_rates format: "01-01 to 03-31: €4800 | 04-01 to 04-30: €5400"
function parseWeeklyRates(ratesStr: string): SeasonalPrice[] {
  if (!ratesStr) return [];

  const rates = parsePipeSeparated(ratesStr);
  return rates.map(rate => {
    const match = rate.match(/(\d{2}-\d{2})\s*to\s*(\d{2}-\d{2}):\s*(€[\d\s]+)/i);
    if (match) {
      const startDate = match[1]; // e.g., "01-01"
      const endDate = match[2];   // e.g., "03-31"
      const price = match[3];     // e.g., "€4800"

      // Convert to readable format
      const formatDate = (d: string) => {
        const [month, day] = d.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(month) - 1]} ${parseInt(day)}`;
      };

      return {
        month: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        price: price.replace(/\s/g, '')
      };
    }
    return { month: rate, price: '' };
  }).filter(r => r.price);
}

// Check if dates match arrival policy
export function checkArrivalPolicy(checkIn: Date, checkOut: Date, policy: string): boolean {
  if (!policy || policy.toLowerCase().includes('flexible')) return true;

  const month = checkIn.getMonth(); // 0-11
  const dayOfWeek = checkIn.getDay(); // 0=Sunday, 6=Saturday
  const checkOutDay = checkOut.getDay();

  // Parse policy like "July–August: Saturday to Saturday | Rest of the year: Flexible"
  const rules = parsePipeSeparated(policy);

  for (const rule of rules) {
    const lowerRule = rule.toLowerCase();

    // Check if this rule applies to current month
    const isJulyAugust = month === 6 || month === 7; // July or August

    if (lowerRule.includes('july') || lowerRule.includes('august')) {
      if (isJulyAugust) {
        // Check if Saturday to Saturday is required
        if (lowerRule.includes('saturday')) {
          if (dayOfWeek !== 6 || checkOutDay !== 6) {
            return false; // Must be Saturday to Saturday
          }
        }
      }
    }
  }

  return true;
}

// Get price for a specific date based on weekly_rates
export function getPriceForDate(date: Date, weeklyRates: string): number {
  if (!weeklyRates) return 0;

  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  const rates = parsePipeSeparated(weeklyRates);

  for (const rate of rates) {
    const match = rate.match(/(\d{2})-(\d{2})\s*to\s*(\d{2})-(\d{2}):\s*€([\d\s]+)/i);
    if (match) {
      const startMonth = parseInt(match[1]);
      const startDay = parseInt(match[2]);
      const endMonth = parseInt(match[3]);
      const endDay = parseInt(match[4]);
      const price = parseInt(match[5].replace(/\s/g, ''));

      // Check if date falls within this range
      const dateValue = month * 100 + day;
      const startValue = startMonth * 100 + startDay;
      const endValue = endMonth * 100 + endDay;

      if (dateValue >= startValue && dateValue <= endValue) {
        return price;
      }
    }
  }

  return 0;
}

function csvRowToVilla(row: CSVRow): Villa {
  const minPrice = parsePrice(row.price_min_week);
  const maxPrice = parsePrice(row.price_max_week) || minPrice;

  // Parse images using pipe separator
  const headerImages = parsePipeSeparated(row.header_images);
  const galleryImages = parsePipeSeparated(row.gallery_images);

  // Parse amenities using pipe separator
  const amenities = parsePipeSeparated(row.amenities);

  // Parse weekly rates
  const seasonalPrices = parseWeeklyRates(row.weekly_rates);

  // Parse availability dates (if provided as dates)
  const occupiedDates = parsePipeSeparated(row.availability);

  // Build location map URL from lat/lng with satellite view
  let locationMapUrl: string | undefined;
  if (row.location_lat && row.location_lng) {
    const lat = parseFloat(row.location_lat);
    const lng = parseFloat(row.location_lng);
    const radius = parseFloat(row.map_radius_km) || 2;
    // Calculate zoom level based on radius (approximate)
    const zoom = Math.max(12, Math.min(16, Math.round(15 - Math.log2(radius))));
    if (!isNaN(lat) && !isNaN(lng)) {
      locationMapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${radius * 2000}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2ses!4v1234567890`;
    }
  }

  return {
    id: row.slug || '',
    name: row.villa_name || '',
    location: row.location || '',
    shortDescription: row.short_description || '',
    price: minPrice > 0 ? `From €${minPrice.toLocaleString()} / week` : 'On Request',
    priceRange: minPrice > 0 && maxPrice > 0
      ? `€${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}`
      : 'Available upon request',
    numericPrice: minPrice,
    bedrooms: parseInt(row.bedrooms) || 0,
    bathrooms: parseInt(row.bathrooms) || 0,
    maxGuests: parseInt(row.max_persons) || 0,
    imageUrl: headerImages[0] || '',
    category: 'Modern' as const,
    listingType: 'holiday' as const,
    fullDescription: row.description ? row.description.split('\n\n').filter(p => p.trim()) : [],
    features: amenities,
    gallery: galleryImages,
    visibility: (row.visibility?.toLowerCase() === 'private' ? 'private' : 'public') as 'public' | 'private',
    minStay: row.min_stay || '7 nights',
    checkIn: row.check_in || '16:00',
    checkOut: row.check_out || '10:00',
    arrivalPolicy: row.arrival_policy || 'Flexible',
    reservationDeposit: row.reservation_deposit || '50%',
    securityDeposit: row.security_deposit || '€5,000',
    ecotax: row.ecotax || 'Included',
    servicesIncluded: row.services_included || '',
    finalCleaning: row['final cleaning'] || 'Included',
    occupiedDates: occupiedDates,
    icalUrl: row.ical_url || undefined,
    latitude: row.location_lat ? parseFloat(row.location_lat) : undefined,
    longitude: row.location_lng ? parseFloat(row.location_lng) : undefined,
    mapRadiusKm: row.map_radius_km ? parseFloat(row.map_radius_km) : undefined,
    conciergeNote: row.concierge_note || undefined,
    locationMapUrl: locationMapUrl,
    seasonalPrices: seasonalPrices.length > 0 ? seasonalPrices : undefined,
    weeklyRatesRaw: row.weekly_rates || '',
    seoKeywords: row.seo_keywords || '',
    headerImages: headerImages,
  };
}

let cachedVillas: Villa[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export async function fetchVillas(): Promise<Villa[]> {
  const now = Date.now();

  // Return cached data if still fresh
  if (cachedVillas && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedVillas;
  }

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    const villas = rows.map(csvRowToVilla).filter(v => v.id && v.name);

    cachedVillas = villas;
    lastFetchTime = now;

    return villas;
  } catch (error) {
    console.error('Error fetching villas from CSV:', error);
    if (cachedVillas) {
      return cachedVillas;
    }
    return [];
  }
}

// Get only public villas (for non-VIP users)
export function getPublicVillas(villas: Villa[]): Villa[] {
  return villas.filter(v => v.visibility === 'public');
}

// Get all villas (for VIP users)
export function getAllVillas(villas: Villa[]): Villa[] {
  return villas;
}

// Get villa by slug
export function getVillaBySlug(villas: Villa[], slug: string): Villa | undefined {
  return villas.find(v => v.id === slug);
}

// Get unique locations for filter
export function getUniqueLocations(villas: Villa[]): string[] {
  const locations = new Set<string>();
  villas.forEach(v => {
    if (v.location) {
      locations.add(v.location);
    }
  });
  return Array.from(locations).sort();
}

// Calculate total price for a date range
export function calculateStayPrice(
  checkIn: Date,
  checkOut: Date,
  weeklyRatesRaw: string,
  defaultWeeklyPrice: number
): { totalNights: number; breakdown: { period: string; nights: number; rate: number; subtotal: number }[]; total: number } {
  const totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  if (totalNights <= 0) {
    return { totalNights: 0, breakdown: [], total: 0 };
  }

  const breakdown: { period: string; nights: number; rate: number; subtotal: number }[] = [];
  let total = 0;

  // Group nights by rate period
  const nightsByPeriod: { [key: string]: { nights: number; rate: number } } = {};

  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    const rate = getPriceForDate(d, weeklyRatesRaw) || defaultWeeklyPrice;
    const month = d.toLocaleString('en', { month: 'short' });
    const key = `${month}:${rate}`;

    if (!nightsByPeriod[key]) {
      nightsByPeriod[key] = { nights: 0, rate };
    }
    nightsByPeriod[key].nights++;
  }

  // Calculate breakdown
  Object.entries(nightsByPeriod).forEach(([key, data]) => {
    const [month] = key.split(':');
    const subtotal = Math.round((data.nights / 7) * data.rate);
    total += subtotal;
    breakdown.push({
      period: month,
      nights: data.nights,
      rate: data.rate,
      subtotal
    });
  });

  return { totalNights, breakdown, total };
}
