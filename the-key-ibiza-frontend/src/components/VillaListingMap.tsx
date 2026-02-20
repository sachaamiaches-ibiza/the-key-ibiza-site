import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Villa, Language } from '../types';
import { vipAuth } from '../services/vipAuth';
import { getThumbnailUrl } from '../utils/cloudinaryUrl';

// Custom gold marker icon
const goldIcon = L.divIcon({
  html: `
    <svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z" fill="#C4A461" stroke="#0B1C26" stroke-width="1"/>
      <circle cx="14" cy="14" r="5" fill="#0B1C26"/>
    </svg>
  `,
  className: '',
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -40],
});

interface VillaListingMapProps {
  villas: Villa[];
  onNavigate: (view: string) => void;
  lang: Language;
}

const VillaListingMap: React.FC<VillaListingMapProps> = ({ villas, onNavigate, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if user is admin for zoom permissions
  const isAdmin = vipAuth.isAdmin();

  // Zoom limits: Admin can zoom fully, others limited to area view only
  const maxZoom = isAdmin ? 18 : 12;
  const minZoom = 10;

  // Ibiza center coordinates
  const ibizaCenter: [number, number] = [38.9067, 1.4206];

  // Filter villas that have coordinates
  const villasWithCoords = villas.filter(v => v.latitude && v.longitude);

  const mapHeight = isExpanded ? 'h-[500px] md:h-[600px]' : 'h-[280px] md:h-[320px]';

  if (villasWithCoords.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 mb-8">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-luxury-blue/95 via-luxury-blue/70 to-transparent p-3 md:p-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-white text-xs md:text-sm font-medium">
            {villasWithCoords.length} {lang === 'es' ? 'propiedades' : lang === 'fr' ? 'propriétés' : 'properties'}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] md:text-xs transition-all pointer-events-auto cursor-pointer"
        >
          {isExpanded ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
              <span className="hidden sm:inline">{lang === 'es' ? 'Reducir' : lang === 'fr' ? 'Réduire' : 'Collapse'}</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="hidden sm:inline">{lang === 'es' ? 'Expandir' : lang === 'fr' ? 'Agrandir' : 'Expand'}</span>
            </>
          )}
        </button>
      </div>

      {/* Map */}
      <div className={`${mapHeight} transition-all duration-500`}>
        <MapContainer
          center={ibizaCenter}
          zoom={10}
          minZoom={minZoom}
          maxZoom={maxZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {villasWithCoords.map(villa => (
            <Marker
              key={villa.id}
              position={[villa.latitude!, villa.longitude!]}
              icon={goldIcon}
            >
              <Popup>
                <div style={{ width: '200px', padding: '0', margin: '-14px -20px -14px -20px', background: '#0B1C26', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* Villa Image */}
                  {villa.imageUrl && (
                    <div style={{ position: 'relative', height: '100px', overflow: 'hidden' }}>
                      <img
                        src={getThumbnailUrl(villa.imageUrl)}
                        alt={villa.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '6px', right: '6px', padding: '2px 8px', background: 'rgba(11,28,38,0.8)', borderRadius: '9999px' }}>
                        <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#C4A461', fontWeight: 'bold' }}>
                          {villa.district || villa.location}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Villa Info */}
                  <div style={{ padding: '10px' }}>
                    <h3 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '13px', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{villa.name}</h3>

                    {/* Stats */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginBottom: '8px' }}>
                      <span>{villa.bedrooms} bed</span>
                      <span>•</span>
                      <span>{villa.maxGuests} guests</span>
                    </div>

                    {/* Price */}
                    <div style={{ color: '#C4A461', fontSize: '11px', fontWeight: '500', marginBottom: '10px' }}>
                      {villa.priceRange || villa.price}
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => onNavigate(`villa-${villa.id}`)}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '6px', 
                        background: '#C4A461', 
                        color: '#0B1C26', 
                        fontSize: '9px', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        fontWeight: 'bold', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'es' ? 'Ver Propiedad' : lang === 'fr' ? 'Voir Propriété' : 'View Property'}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default VillaListingMap;
