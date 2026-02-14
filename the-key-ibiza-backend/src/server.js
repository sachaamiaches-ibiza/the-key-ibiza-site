// =========================================
// The Key Ibiza Backend (ES Module)
// =========================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ---------- Google Sheets CSV URL ----------
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6iifLyOIwL1CyEgHcB1nkgRSDWG1gBpnULZUXPcXXp0kvU8oBD8ilEMR_DMPmOT7RxQYon1JFw6UK/pub?gid=0&single=true&output=csv';

// ---------- Cache ----------
let cachedVillas = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute

// ---------- CSV Parsing Utilities ----------
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((h, idx) => (obj[h] = values[idx] || ''));
    rows.push(obj);
  }
  return rows;
}

function parsePipeSeparated(value) {
  if (!value) return [];
  return value.split('|').map(s => s.trim()).filter(Boolean);
}

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[€\s]/g, '')) || 0;
}

function parseWeeklyRates(ratesStr) {
  if (!ratesStr) return [];
  return parsePipeSeparated(ratesStr).map(r => {
    const match = r.match(/(\d{2}-\d{2})\s*to\s*(\d{2}-\d{2}):\s*€([\d\s]+)/);
    if (match) {
      return { month: `${match[1]} - ${match[2]}`, price: match[3].replace(/\s/g, '') };
    }
    return { month: r, price: '' };
  }).filter(r => r.price);
}

// ---------- CSV to LegacyVilla Mapping ----------
function csvRowToVilla(row) {
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
    weeklyRatesRaw: row.weekly_rates || '',
    locationMapUrl: row.location_lat && row.location_lng
      ? `https://www.google.com/maps?q=${row.location_lat},${row.location_lng}&z=15`
      : undefined,
    gallery: parsePipeSeparated(row.gallery_images),
    amenities: parsePipeSeparated(row.amenities),
    isPrivate: row.visibility?.toLowerCase() === 'private',
  };
}

// ---------- Fetch Villas from Google Sheets ----------
async function fetchVillasFromSheets() {
  const now = Date.now();
  if (cachedVillas && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedVillas;
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL);
    if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.status}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    const villas = rows.map(csvRowToVilla).filter(v => v.id);
    cachedVillas = villas;
    lastFetchTime = now;
    console.log(`✅ Fetched ${villas.length} villas from Google Sheets`);
    return villas;
  } catch (error) {
    console.error('❌ Error fetching villas from Google Sheets:', error);
    return cachedVillas || [];
  }
}

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "The Key Ibiza Backend is running 🔥"
  });
});

app.get("/villas", async (req, res) => {
  try {
    const villas = await fetchVillasFromSheets();
    res.status(200).json({
      status: "success",
      results: villas.length,
      data: villas
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch villas",
      error: error.message
    });
  }
});

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
