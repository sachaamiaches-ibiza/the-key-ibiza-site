import React, { useEffect } from 'react';
import { Villa } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  villaSlugs: string[];
  villas: Villa[];
  checkIn: string;
  checkOut: string;
  onRemoveVilla: (villaSlug: string) => void;
  onClearAll: () => void;
  onShare: () => void;
  onViewMap: () => void;
  onNavigate: (view: string) => void;
  calculatePrice: (villa: Villa, checkIn: string, checkOut: string) => number | null;
}

// Helper to convert villa name to URL-friendly slug
function nameToUrlSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  villaSlugs,
  villas,
  checkIn,
  checkOut,
  onRemoveVilla,
  onClearAll,
  onShare,
  onViewMap,
  onNavigate,
  calculatePrice,
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Get selected villas from the list
  const selectedVillas = villas.filter(v => {
    const villaSlug = nameToUrlSlug(v.name);
    return villaSlugs.includes(villaSlug) || villaSlugs.includes(v.id);
  });

  // Calculate total price
  let totalPrice = 0;
  const villasWithPrices = selectedVillas.map(villa => {
    const price = calculatePrice(villa, checkIn, checkOut);
    if (price) totalPrice += price;
    return { ...villa, calculatedPrice: price };
  });

  // Calculate total nights
  const totalNights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100002]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-gradient-to-b from-[#0B1C26] to-[#0a1419] z-[100003] shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-serif text-white">My Selection</h2>
            <p className="text-white/50 text-sm mt-1">
              {villaSlugs.length} villa{villaSlugs.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dates info */}
        {checkIn && checkOut && (
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Check-in</span>
                <span className="text-white font-medium">{new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="w-8 h-px bg-white/20" />
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Check-out</span>
                <span className="text-white font-medium">{new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="ml-auto text-right">
                <span className="text-luxury-gold font-medium">{totalNights} nights</span>
              </div>
            </div>
          </div>
        )}

        {/* Villa list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {villasWithPrices.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-white/40">No villas selected yet</p>
              <p className="text-white/30 text-sm mt-2">Click the heart icon on villas to add them here</p>
            </div>
          ) : (
            villasWithPrices.map(villa => (
              <div
                key={villa.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* Villa thumbnail */}
                <div
                  className="w-20 h-16 rounded-lg bg-cover bg-center flex-shrink-0 cursor-pointer"
                  style={{ backgroundImage: `url(${villa.thumbnailImages?.[0] || villa.headerImages?.[0] || villa.imageUrl})` }}
                  onClick={() => {
                    onClose();
                    onNavigate(`villa-${nameToUrlSlug(villa.name)}`);
                  }}
                />

                {/* Villa info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-white font-medium truncate cursor-pointer hover:text-luxury-gold transition-colors"
                    onClick={() => {
                      onClose();
                      onNavigate(`villa-${nameToUrlSlug(villa.name)}`);
                    }}
                  >
                    {villa.name}
                  </h4>
                  <p className="text-white/40 text-xs mt-0.5">{villa.location}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/50">
                    <span>{villa.bedrooms} beds</span>
                    <span>{villa.maxGuests} guests</span>
                  </div>
                  {villa.calculatedPrice && (
                    <p className="text-luxury-gold text-sm font-medium mt-2">
                      {villa.calculatedPrice.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveVilla(nameToUrlSlug(villa.name))}
                  className="text-white/30 hover:text-red-400 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with share button */}
        {villasWithPrices.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            {/* Action buttons row */}
            <div className="flex gap-3">
              {/* Share button */}
              <button
                onClick={onShare}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-blue font-semibold uppercase tracking-wider text-xs hover:from-amber-500 hover:to-luxury-gold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>

              {/* View on Map button */}
              <button
                onClick={onViewMap}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold uppercase tracking-wider text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Map
              </button>
            </div>

            {/* Clear selection button */}
            <button
              onClick={onClearAll}
              className="w-full py-3 text-white/50 hover:text-red-400 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistDrawer;
