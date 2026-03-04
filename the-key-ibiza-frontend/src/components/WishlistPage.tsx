import React, { useState, useEffect } from 'react';
import { fetchWishlist, WishlistResponse, WishlistVilla } from '../services/wishlistService';
import { Language } from '../types';

interface WishlistPageProps {
  shareCode: string;
  onNavigate: (view: string) => void;
  lang: Language;
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

const WishlistPage: React.FC<WishlistPageProps> = ({ shareCode, onNavigate, lang }) => {
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWishlist(shareCode);
        setWishlist(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shareCode]);

  // Calculate total nights
  const totalNights = wishlist?.checkIn && wishlist?.checkOut
    ? Math.ceil((new Date(wishlist.checkOut).getTime() - new Date(wishlist.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B1C26' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading selection...</p>
        </div>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B1C26' }}>
        <div className="text-center max-w-md mx-auto px-6">
          <svg className="w-20 h-20 mx-auto text-white/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-serif text-white mb-4">Selection Not Found</h1>
          <p className="text-white/50 mb-8">
            This wishlist link may have expired or doesn't exist.
          </p>
          <button
            onClick={() => onNavigate('villas-holiday')}
            className="px-8 py-3 bg-luxury-gold text-luxury-blue rounded-full text-sm uppercase tracking-wider font-semibold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all"
          >
            Browse Villas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-4">
            Curated Selection
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
            {wishlist.createdByName ? `${wishlist.createdByName}'s` : 'Your'} Villa Selection
          </h1>

          {/* Dates bar */}
          <div className="inline-flex items-center gap-4 md:gap-8 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 mt-6">
            <div className="text-center">
              <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Check-in</span>
              <span className="text-white font-medium">
                {new Date(wishlist.checkIn).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="w-12 h-px bg-white/20" />
            <div className="text-center">
              <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Check-out</span>
              <span className="text-white font-medium">
                {new Date(wishlist.checkOut).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <span className="text-luxury-gold font-semibold text-lg">{totalNights}</span>
              <span className="text-white/40 text-xs uppercase tracking-wider block">nights</span>
            </div>
          </div>

          {/* Notes */}
          {wishlist.notes && (
            <p className="text-white/60 italic mt-6 max-w-xl mx-auto">
              "{wishlist.notes}"
            </p>
          )}
        </div>

        {/* Villa grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {wishlist.villas.map((villa: WishlistVilla) => (
            <div
              key={villa.id}
              className="group relative rounded-[24px] overflow-hidden bg-luxury-slate/30 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => onNavigate(`villa-${nameToUrlSlug(villa.villa_name)}`)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={villa.thumbnail_images?.[0] || villa.header_images?.[0]}
                  alt={villa.villa_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/80 via-transparent to-transparent" />

                {/* Location badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-luxury-blue/60 backdrop-blur-md border border-white/10 rounded-full">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-luxury-gold">
                    {villa.location}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-luxury-gold transition-colors mb-2">
                  {villa.villa_name}
                </h3>
                {villa.short_description && (
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">
                    {villa.short_description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-white/50 mb-4">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {villa.bedrooms} beds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {villa.max_persons} guests
                  </span>
                </div>

                {/* Price (if shown) */}
                {wishlist.showPrices && villa.calculatedPrice && (
                  <div className="pt-4 border-t border-white/10">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Total for period</span>
                    <p className="text-luxury-gold text-xl font-serif mt-1">
                      {villa.calculatedPrice.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* View details button */}
                <button className="w-full mt-4 py-3 rounded-full bg-transparent border border-white/20 text-white/70 text-xs uppercase tracking-wider hover:border-luxury-gold hover:text-luxury-gold transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total and CTA */}
        <div className="max-w-xl mx-auto text-center">
          {/* Total price */}
          {wishlist.showPrices && wishlist.totalPrice && (
            <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white/40 text-sm uppercase tracking-wider block mb-2">Estimated Total</span>
              <span className="text-4xl md:text-5xl font-serif text-luxury-gold">
                {wishlist.totalPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* Contact CTA */}
          <button
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-blue font-semibold uppercase tracking-wider text-sm hover:from-amber-500 hover:to-luxury-gold transition-all shadow-lg shadow-luxury-gold/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact About These Villas
          </button>

          {/* Browse more */}
          <button
            onClick={() => onNavigate('villas-holiday')}
            className="block mx-auto mt-6 text-white/50 hover:text-luxury-gold text-sm uppercase tracking-wider transition-colors"
          >
            Browse More Villas
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
