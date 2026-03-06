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

// Villa Detail Modal Component - Full featured modal for white label
interface VillaDetailModalProps {
  villa: WishlistVilla;
  showPrices: boolean;
  onClose: () => void;
}

const VillaDetailModal: React.FC<VillaDetailModalProps> = ({ villa, showPrices, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Combine all images
  const allImages = [
    ...(villa.header_images || []),
    ...(villa.gallery_images || []),
    ...(villa.thumbnail_images || [])
  ].filter((img, index, self) => self.indexOf(img) === index); // Remove duplicates

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Feature badges
  const features = [
    villa.pool && { icon: '🏊', label: 'Pool' },
    villa.sea_view && { icon: '🌊', label: 'Sea View' },
    villa.garden && { icon: '🌳', label: 'Garden' },
    villa.parking && { icon: '🚗', label: 'Parking' }
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <div className="fixed inset-0 z-[100005] flex items-center justify-center py-6 px-4 md:py-8 md:px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-gradient-to-br from-[#0B1C26] to-[#0a1419] rounded-2xl md:rounded-3xl border border-luxury-gold/20 shadow-2xl">
        {/* Drag handle bar at top */}
        <div className="sticky top-0 z-30 flex items-center justify-center py-3 bg-[#0B1C26] border-b border-white/5">
          <div className="w-12 h-1 rounded-full bg-white/30" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white/60 hover:text-luxury-gold transition-colors z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Gallery */}
        <div className="relative aspect-[16/10] md:aspect-video bg-black">
          <img
            src={allImages[currentImageIndex] || villa.header_images?.[0]}
            alt={`${villa.villa_name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26] via-transparent to-transparent opacity-60" />

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-white/80 text-xs">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1 max-w-[200px] overflow-hidden">
              {allImages.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                    currentImageIndex === i ? 'border-luxury-gold' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {allImages.length > 5 && (
                <div className="w-12 h-8 rounded bg-black/60 flex items-center justify-center text-white/60 text-xs">
                  +{allImages.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8 pb-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2">{villa.villa_name}</h2>
            <p className="text-luxury-gold text-sm uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {villa.location}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-serif text-white">{villa.bedrooms}</span>
              <span className="text-xs uppercase tracking-wider block mt-1 text-white/50">Bedrooms</span>
            </div>
            <div className="text-center border-x border-white/10">
              <span className="text-2xl md:text-3xl font-serif text-white">{villa.bathrooms}</span>
              <span className="text-xs uppercase tracking-wider block mt-1 text-white/50">Bathrooms</span>
            </div>
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-serif text-white">{villa.max_persons}</span>
              <span className="text-xs uppercase tracking-wider block mt-1 text-white/50">Guests</span>
            </div>
          </div>

          {/* Feature Badges */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {features.map((f, i) => (
                <span key={i} className="px-3 py-1.5 bg-luxury-gold/15 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm flex items-center gap-1.5">
                  <span>{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {(villa.description || villa.short_description) && (
            <div className="mb-6">
              <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">About this property</h3>
              <p className="text-white/70 leading-relaxed whitespace-pre-line">
                {villa.description || villa.short_description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {villa.amenities && villa.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {(showAllAmenities ? villa.amenities : villa.amenities.slice(0, 12)).map((amenity, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
              {villa.amenities.length > 12 && !showAllAmenities && (
                <button
                  onClick={() => setShowAllAmenities(true)}
                  className="mt-3 text-luxury-gold text-sm hover:underline"
                >
                  Show all {villa.amenities.length} amenities
                </button>
              )}
            </div>
          )}

          {/* Price */}
          {showPrices && villa.calculatedPrice && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-luxury-gold/10 to-transparent border border-luxury-gold/20 mb-6">
              <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Total for selected period</span>
              <span className="text-3xl font-serif text-luxury-gold">
                €{villa.calculatedPrice.toLocaleString()}
              </span>
            </div>
          )}

          {/* Map - Shows all of Ibiza with villa marker */}
          {villa.location_lat && villa.location_lng && (
            <div className="mt-6 mb-2">
              <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">Location in Ibiza</h3>
              <div className="rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${villa.location_lat},${villa.location_lng}&zoom=10&maptype=satellite&center=38.9067,1.4206`}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Bottom safe area */}
          <div className="h-2" />
        </div>

        {/* Bottom border bar */}
        <div className="sticky bottom-0 z-30 flex items-center justify-center py-2 bg-[#0B1C26] border-t border-white/5">
          <div className="w-8 h-1 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
};

const WishlistPage: React.FC<WishlistPageProps> = ({ shareCode, onNavigate, lang }) => {
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVilla, setSelectedVilla] = useState<WishlistVilla | null>(null);

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

  // Check if white label mode - by domain OR by wishlist flag
  const isWhiteLabelDomain = typeof window !== 'undefined' && (
    window.location.hostname === 'elegantcollection.store' ||
    window.location.hostname === 'www.elegantcollection.store' ||
    window.location.hostname.includes('elegantcollection')
  );
  const isWhiteLabel = isWhiteLabelDomain || wishlist?.whiteLabel === true;

  // Hide navbar and footer in white label mode
  useEffect(() => {
    if (isWhiteLabel) {
      document.body.classList.add('white-label-mode');
    } else {
      document.body.classList.remove('white-label-mode');
    }
    return () => {
      document.body.classList.remove('white-label-mode');
    };
  }, [isWhiteLabel]);

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
            This link may have expired or doesn't exist.
          </p>
          {!isWhiteLabel && (
            <button
              onClick={() => onNavigate('villas-holiday')}
              className="px-8 py-3 bg-luxury-gold text-luxury-blue rounded-full text-sm uppercase tracking-wider font-semibold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all"
            >
              Browse Villas
            </button>
          )}
        </div>
      </div>
    );
  }

  // Handle villa card click - in white label mode, show modal instead of navigating
  const handleVillaClick = (villa: WishlistVilla) => {
    if (isWhiteLabel) {
      setSelectedVilla(villa);
    } else {
      onNavigate(`villa-${nameToUrlSlug(villa.villa_name)}`);
    }
  };

  return (
    <div className={`pb-20 min-h-screen ${isWhiteLabel ? 'pt-8' : 'pt-32'}`} style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          {/* Only show "Curated Selection" badge if NOT white label */}
          {!isWhiteLabel && (
            <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-4">
              Curated Selection
            </span>
          )}
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
              onClick={() => handleVillaClick(villa)}
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

        {/* CTA */}
        <div className="max-w-xl mx-auto text-center">
          {/* Contact CTA - different for white label */}
          {isWhiteLabel ? (
            <p className="text-white/50 text-sm">
              Contact your agent for more information about these properties.
            </p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Villa Detail Modal - Only for white label mode */}
      {selectedVilla && isWhiteLabel && (
        <VillaDetailModal
          villa={selectedVilla}
          showPrices={wishlist?.showPrices || false}
          onClose={() => setSelectedVilla(null)}
        />
      )}
    </div>
  );
};

export default WishlistPage;
