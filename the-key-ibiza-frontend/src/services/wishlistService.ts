// Wishlist Service - API calls for shareable villa wishlists

const BACKEND_URL = 'https://the-key-ibiza-backend.vercel.app';

export interface CreateWishlistParams {
  villaSlugs: string[];
  checkIn: string;
  checkOut: string;
  showPrices?: boolean;
  commissionPercent?: number;
  whiteLabel?: boolean;
  createdByName?: string;
  notes?: string;
}

export interface CreateWishlistResponse {
  success: boolean;
  shareCode: string;
  shareUrl: string;
  wishlistId: string;
}

export interface WishlistVilla {
  id: string;
  slug: string;
  villa_name: string;
  location: string;
  short_description?: string;
  bedrooms: number;
  bathrooms: number;
  max_persons: number;
  header_images?: string[];
  thumbnail_images?: string[];
  amenities?: string[];
  calculatedPrice?: number;
  price_min_week?: number;
  price_max_week?: number;
}

export interface WishlistResponse {
  shareCode: string;
  checkIn: string;
  checkOut: string;
  showPrices: boolean;
  whiteLabel?: boolean;
  createdByName?: string;
  notes?: string;
  viewsCount: number;
  createdAt: string;
  villas: WishlistVilla[];
  totalPrice?: number;
}

// Create a new wishlist and get the share link
export async function createWishlist(params: CreateWishlistParams): Promise<CreateWishlistResponse> {
  const response = await fetch(`${BACKEND_URL}/wishlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create wishlist');
  }

  return response.json();
}

// Fetch a wishlist by share code
export async function fetchWishlist(shareCode: string): Promise<WishlistResponse> {
  const response = await fetch(`${BACKEND_URL}/wishlists/${shareCode}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Wishlist not found');
    }
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch wishlist');
  }

  return response.json();
}
