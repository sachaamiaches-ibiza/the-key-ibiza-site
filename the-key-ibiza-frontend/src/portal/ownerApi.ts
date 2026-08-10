// =====================================================================
// Owner Portal · API client + session
// Talks to the Express backend's /owner/* routes. Session token lives in
// localStorage under a portal-specific key (kept separate from vip_token).
// =====================================================================
import type { PortalLang } from './i18n';

export const BACKEND_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://the-key-ibiza-backend.vercel.app';

const TOKEN_KEY = 'owner_token';
const USER_KEY = 'owner_user';

export interface OwnerUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin';
  preferredLang?: PortalLang;
  timezone?: string;
  currency?: string;
}

export interface OwnerVilla {
  slug: string;
  name: string;
  location: string | null;
  photo: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  guests: number | null;
  visibility: string | null;
  hasIcal: boolean;
  blockedNext30: number;
  availableNext30: number;
}

export type BookingType = 'reservation' | 'block' | 'maintenance' | 'personal' | 'tentative';

export interface Booking {
  id: string;
  villa_slug: string;
  type: BookingType;
  status: 'confirmed' | 'tentative' | 'cancelled';
  guest_name: string | null;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD (departure, exclusive)
  guests: number | null;
  source: string | null;
  notes: string | null;
  internal_notes: string | null;
  created_by?: string | null;
  feed_id?: string | null;
  created_at?: string;
}

export interface CalendarFeed {
  id: string;
  villa_slug: string;
  provider: string;
  url: string;
  active: boolean;
  last_sync: string | null;
  last_status: 'pending' | 'ok' | 'error';
  last_error: string | null;
  events_count: number;
}

export interface FeedsResponse {
  feeds: CalendarFeed[];
  providers: string[];
  exportUrl: string;
  syncIntervalMinutes: number;
}

export interface SyncResult { ok: boolean; count?: number; error?: string }

// ---- Admin ----
export interface AdminOwner {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'owner' | 'admin';
  active: boolean;
  preferred_lang: string;
  created_at: string;
  villaCount: number;
  pendingRequests: number;
}
export interface CatalogVilla {
  slug: string;
  name: string;
  location: string | null;
  photo: string | null;
  vipOnly: boolean;
  bedrooms: number | null;
  guests: number | null;
  owners: { id: string; name: string }[];
}
export interface AdminStats { owners: number; villas: number; assignedVillas: number; pendingRequests: number }
export interface AdminChangeRequest extends ChangeRequest {
  villa_name?: string;
  owner_name?: string | null;
  owner_email?: string | null;
}

export interface VillaDetail {
  slug: string;
  villa_name: string | null;
  short_description: string | null;
  description: string | null;
  amenities: string | null;
  location: string | null;
  price_min_week: number | null;
  price_max_week: number | null;
  weekly_rates: string | null;
  header_images: string | null;
  gallery_images: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_persons: number | null;
}

export interface ChangeRequest {
  id: string;
  villa_slug: string;
  entity: string;
  patch: Record<string, any>;
  before?: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  review_note?: string | null;
  created_at: string;
  reviewed_at?: string | null;
}

export interface DashboardData {
  villas: number;
  upcoming: { id: string; villa: string; guest: string | null; start: string; end: string; guests: number | null }[];
  arrivals: { id: string; villa: string; guest: string | null; start: string }[];
  blockedNext30: number;
  revenueMonth: number;
  unreadMessages: number;
  activity: { id: string; type: BookingType; villa: string; guest: string | null; start: string; end: string; at?: string }[];
}

// ---- session ----------------------------------------------------------
export const ownerSession = {
  token: (): string | null => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)),
  user: (): OwnerUser | null => {
    if (typeof window === 'undefined') return null;
    try { const s = localStorage.getItem(USER_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  },
  isAuthed: (): boolean => !!ownerSession.token(),
  set: (token: string, user: OwnerUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
};

// ---- fetch wrapper ----------------------------------------------------
class ApiError extends Error { status: number; constructor(status: number, msg: string) { super(msg); this.status = status; } }

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = ownerSession.token();
  const res = await fetch(`${BACKEND_URL}/owner${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (res.status === 401 || res.status === 403) {
    // token expired / invalid → force re-login
    ownerSession.clear();
    throw new ApiError(res.status, 'Unauthorized');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body?.error || 'Request failed');
  return body as T;
}

// ---- API --------------------------------------------------------------
export const ownerApi = {
  login: (email: string, password: string) =>
    req<{ token: string; user: OwnerUser }>('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => req<{ user: OwnerUser }>('/me'),

  updateMe: (patch: Partial<OwnerUser> & { preferred_lang?: string }) =>
    req<{ user: OwnerUser }>('/me', { method: 'PATCH', body: JSON.stringify(patch) }),

  dashboard: () => req<DashboardData>('/dashboard'),

  villas: () => req<{ villas: OwnerVilla[] }>('/villas'),

  bookings: (slug: string, from?: string, to?: string) => {
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    return req<{ bookings: Booking[] }>(`/villas/${encodeURIComponent(slug)}/bookings?${q}`);
  },

  createBooking: (slug: string, b: Partial<Booking>) =>
    req<{ booking: Booking }>(`/villas/${encodeURIComponent(slug)}/bookings`, { method: 'POST', body: JSON.stringify(b) }),

  updateBooking: (id: string, b: Partial<Booking>) =>
    req<{ booking: Booking }>(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(b) }),

  deleteBooking: (id: string) => req<{ ok: boolean }>(`/bookings/${id}`, { method: 'DELETE' }),

  // Change requests (owner-side)
  villaDetail: (slug: string) =>
    req<{ villa: VillaDetail; pending: { id: string; patch: Record<string, any>; created_at: string }[] }>(`/villas/${encodeURIComponent(slug)}/detail`),

  submitChangeRequest: (slug: string, patch: Record<string, any>) =>
    req<{ request: ChangeRequest }>(`/villas/${encodeURIComponent(slug)}/change-request`, { method: 'POST', body: JSON.stringify({ patch }) }),

  myChangeRequests: () => req<{ requests: ChangeRequest[] }>('/change-requests'),

  // iCal feeds
  feeds: (slug: string) => req<FeedsResponse>(`/villas/${encodeURIComponent(slug)}/feeds`),

  addFeed: (slug: string, provider: string, url: string) =>
    req<{ feed: CalendarFeed; sync: SyncResult }>(`/villas/${encodeURIComponent(slug)}/feeds`, { method: 'POST', body: JSON.stringify({ provider, url }) }),

  removeFeed: (id: string) => req<{ ok: boolean }>(`/feeds/${id}`, { method: 'DELETE' }),

  syncFeed: (id: string) => req<{ feed: CalendarFeed; sync: SyncResult }>(`/feeds/${id}/sync`, { method: 'POST' }),

  syncVilla: (slug: string) => req<{ feeds: CalendarFeed[]; results: any[] }>(`/villas/${encodeURIComponent(slug)}/sync`, { method: 'POST' }),

  // ---- Admin ----
  adminStats: () => req<AdminStats>('/admin/stats'),
  adminOwners: () => req<{ owners: AdminOwner[] }>('/admin/owners'),
  adminCreateOwner: (o: { email: string; name: string; password: string; preferred_lang?: string; phone?: string }) =>
    req<{ owner: AdminOwner; welcome: { message: string; loginUrl: string; email: string; password: string; emailSent: boolean } }>('/admin/owners', { method: 'POST', body: JSON.stringify(o) }),
  adminUpdateOwner: (id: string, patch: Record<string, any>) =>
    req<{ owner: AdminOwner }>(`/admin/owners/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  adminDeleteOwner: (id: string) => req<{ ok: boolean }>(`/admin/owners/${id}`, { method: 'DELETE' }),
  adminOwnerVillas: (id: string) => req<{ villas: { slug: string; name: string; location: string | null; photo: string | null }[] }>(`/admin/owners/${id}/villas`),
  adminAssignVilla: (id: string, villa_slug: string) => req<{ ok: boolean }>(`/admin/owners/${id}/villas`, { method: 'POST', body: JSON.stringify({ villa_slug }) }),
  adminUnassignVilla: (id: string, slug: string) => req<{ ok: boolean }>(`/admin/owners/${id}/villas/${encodeURIComponent(slug)}`, { method: 'DELETE' }),
  adminCatalog: (q?: string) => req<{ villas: CatalogVilla[] }>(`/admin/catalog${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  adminRequests: () => req<{ requests: AdminChangeRequest[] }>('/admin/change-requests?status=pending'),
  adminApproveRequest: (id: string) => req<{ request: ChangeRequest }>(`/admin/change-requests/${id}/approve`, { method: 'POST' }),
  adminRejectRequest: (id: string, note?: string) => req<{ request: ChangeRequest }>(`/admin/change-requests/${id}/reject`, { method: 'POST', body: JSON.stringify({ note: note || '' }) }),
};

export { ApiError };
