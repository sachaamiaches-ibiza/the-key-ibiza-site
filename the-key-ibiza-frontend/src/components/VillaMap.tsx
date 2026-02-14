
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VillaMapProps {
  latitude: number;
  longitude: number;
}

// Centro geográfico de Ibiza
const IBIZA_CENTER: [number, number] = [38.98, 1.43];

const VillaMap: React.FC<VillaMapProps> = ({ latitude, longitude }) => {
  if (typeof latitude !== 'number' || isNaN(latitude)) return null;
  if (typeof longitude !== 'number' || isNaN(longitude)) return null;

  const goldenPin = L.divIcon({
    html: `
      <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 28 16 28s16-16 16-28c0-8.837-7.163-16-16-16z" fill="#C9B27C"/>
        <circle cx="16" cy="16" r="6" fill="#0B1C26"/>
      </svg>
    `,
    className: '',
    iconSize: [32, 44],
    iconAnchor: [16, 44],
  });

  // Pin en las coordenadas exactas de la villa
  const villaPosition: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={IBIZA_CENTER}
      zoom={10}
      minZoom={10}
      maxZoom={10}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ width: '100%', height: '300px', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={villaPosition} icon={goldenPin}>
        <Popup>Villa location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default VillaMap;
