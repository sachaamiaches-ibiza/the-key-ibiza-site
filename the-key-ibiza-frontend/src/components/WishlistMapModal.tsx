import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Villa } from '../types';

interface WishlistMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  villas: Villa[];
  onNavigate: (view: string) => void;
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

// Custom gold marker icon
const goldIcon = L.divIcon({
  html: `
    <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 28 16 28s16-16 16-28c0-8.837-7.163-16-16-16z" fill="#C4A461" stroke="#0B1C26" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="6" fill="#0B1C26"/>
    </svg>
  `,
  className: '',
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -44],
});

const WishlistMapModal: React.FC<WishlistMapModalProps> = ({
  isOpen,
  onClose,
  villas,
  onNavigate,
}) => {
  // Prevent body scroll when modal is open
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

  if (!isOpen) return null;

  // Filter villas with coordinates
  const villasWithCoords = villas.filter(v => v.latitude && v.longitude);

  // Ibiza center
  const ibizaCenter: [number, number] = [38.98, 1.41];

  return (
    <div className="fixed inset-0 z-[100006] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-gradient-to-br from-[#0B1C26] to-[#0a1419] rounded-3xl border border-luxury-gold/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-luxury-blue/95 to-transparent p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white font-medium">
              {villasWithCoords.length} villa{villasWithCoords.length !== 1 ? 's' : ''} on map
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map */}
        {villasWithCoords.length > 0 ? (
          <MapContainer
            center={ibizaCenter}
            zoom={11}
            minZoom={10}
            maxZoom={14}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            {villasWithCoords.map(villa => (
              <Marker
                key={villa.id}
                position={[villa.latitude!, villa.longitude!]}
                icon={goldIcon}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <img
                      src={villa.thumbnailImages?.[0] || villa.headerImages?.[0] || villa.imageUrl}
                      alt={villa.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <h3 className="font-semibold text-gray-900">{villa.name}</h3>
                    <p className="text-gray-600 text-sm">{villa.location}</p>
                    <p className="text-gray-500 text-xs mt-1">{villa.bedrooms} beds · {villa.maxGuests} guests</p>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate(`villa-${nameToUrlSlug(villa.name)}`);
                      }}
                      className="mt-2 w-full py-1.5 bg-[#C4A461] text-[#0B1C26] text-xs font-semibold rounded-lg hover:bg-[#b39451] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <p className="text-white/50">No villa locations available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistMapModal;
