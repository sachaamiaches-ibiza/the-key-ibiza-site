
import React from 'react';

const iconColor = '#C9B27C';

// Villa Stats Icons
export const IconBed = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Headboard */}
    <path d="M6 12V28" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M34 12V28" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 12H34" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Mattress */}
    <rect x="4" y="20" width="32" height="8" rx="2" stroke={iconColor} strokeWidth="1.5"/>
    {/* Pillow */}
    <rect x="8" y="16" width="10" height="6" rx="2" stroke={iconColor} strokeWidth="1.5"/>
    {/* Legs */}
    <line x1="8" y1="28" x2="8" y2="32" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="32" y1="28" x2="32" y2="32" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconBath = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Shower head */}
    <circle cx="20" cy="8" r="4" stroke={iconColor} strokeWidth="1.5"/>
    {/* Water drops */}
    <line x1="16" y1="14" x2="16" y2="18" stroke={iconColor} strokeWidth="1" strokeLinecap="round"/>
    <line x1="20" y1="14" x2="20" y2="20" stroke={iconColor} strokeWidth="1" strokeLinecap="round"/>
    <line x1="24" y1="14" x2="24" y2="18" stroke={iconColor} strokeWidth="1" strokeLinecap="round"/>
    {/* Bathtub */}
    <path d="M6 24H34V30C34 32 32 34 30 34H10C8 34 6 32 6 30V24Z" stroke={iconColor} strokeWidth="1.5"/>
    <line x1="4" y1="24" x2="36" y2="24" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconGuests = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Person 1 - front */}
    <circle cx="20" cy="12" r="5" stroke={iconColor} strokeWidth="1.5"/>
    <path d="M10 32V28C10 24 14 22 20 22C26 22 30 24 30 28V32" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Person 2 - behind left */}
    <circle cx="10" cy="10" r="3" stroke={iconColor} strokeWidth="1.2"/>
    <path d="M4 22C4 20 6 18 10 18" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round"/>
    {/* Person 3 - behind right */}
    <circle cx="30" cy="10" r="3" stroke={iconColor} strokeWidth="1.2"/>
    <path d="M36 22C36 20 34 18 30 18" stroke={iconColor} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// 1. Personalized Events - Key with circular head
export const IconPersonalizedEvents = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="22" r="14" stroke={iconColor} strokeWidth="1.5"/>
    <circle cx="40" cy="22" r="7" stroke={iconColor} strokeWidth="1.5"/>
    <line x1="40" y1="36" x2="40" y2="68" stroke={iconColor} strokeWidth="2"/>
    <line x1="40" y1="48" x2="50" y2="48" stroke={iconColor} strokeWidth="2"/>
    <line x1="40" y1="56" x2="54" y2="56" stroke={iconColor} strokeWidth="2"/>
    <line x1="40" y1="64" x2="48" y2="64" stroke={iconColor} strokeWidth="2"/>
  </svg>
);

// 2. Night Life - Martini glass with olive
export const IconNightLife = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22 18H58L40 42V62" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="28" y1="62" x2="52" y2="62" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="32" cy="28" r="4" fill={iconColor}/>
  </svg>
);

// 3. Catering & Bottle Service - Chef hat on plate
export const IconCatering = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Chef hat top - puffy cloud shape */}
    <circle cx="30" cy="24" r="10" stroke={iconColor} strokeWidth="1.5"/>
    <circle cx="40" cy="18" r="10" stroke={iconColor} strokeWidth="1.5"/>
    <circle cx="50" cy="24" r="10" stroke={iconColor} strokeWidth="1.5"/>
    {/* Hat body */}
    <path d="M24 28V44H56V28" stroke={iconColor} strokeWidth="1.5"/>
    {/* Hat band */}
    <line x1="24" y1="44" x2="56" y2="44" stroke={iconColor} strokeWidth="2"/>
    {/* Plate */}
    <ellipse cx="40" cy="58" rx="24" ry="6" stroke={iconColor} strokeWidth="1.5"/>
    <line x1="16" y1="58" x2="64" y2="58" stroke={iconColor} strokeWidth="1.5"/>
  </svg>
);

// 4. Furniture - Sofa
export const IconFurniture = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Back cushion */}
    <path d="M18 28C18 24 22 22 40 22C58 22 62 24 62 28V38H18V28Z" stroke={iconColor} strokeWidth="1.5"/>
    {/* Seat */}
    <path d="M14 38H66V50H14V38Z" stroke={iconColor} strokeWidth="1.5"/>
    {/* Armrests */}
    <path d="M10 35C10 32 12 30 14 30V50H10V35Z" stroke={iconColor} strokeWidth="1.5"/>
    <path d="M70 35C70 32 68 30 66 30V50H70V35Z" stroke={iconColor} strokeWidth="1.5"/>
    {/* Legs */}
    <line x1="18" y1="50" x2="18" y2="58" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
    <line x1="62" y1="50" x2="62" y2="58" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 5. Health & Beauty - Medical cross with snake/caduceus
export const IconHealthBeauty = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cross - vertical */}
    <rect x="35" y="10" width="10" height="30" rx="1" stroke={iconColor} strokeWidth="1.5"/>
    {/* Cross - horizontal */}
    <rect x="25" y="16" width="30" height="10" rx="1" stroke={iconColor} strokeWidth="1.5"/>
    {/* Staff below cross */}
    <line x1="40" y1="40" x2="40" y2="70" stroke={iconColor} strokeWidth="2.5"/>
    {/* Snake - simple S curve wrapping */}
    <path d="M40 44C48 44 50 50 46 54C42 58 40 54 40 54C40 54 38 58 34 54C30 50 32 44 40 44" stroke={iconColor} strokeWidth="1.5" fill="none"/>
    <path d="M40 58C48 58 48 64 44 66C40 68 40 64 40 64C40 64 40 68 36 66C32 64 32 58 40 58" stroke={iconColor} strokeWidth="1.5" fill="none"/>
  </svg>
);

// 6. Yoga & Personal Growth - Person sitting in yoga pose
export const IconYoga = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="40" cy="16" r="6" stroke={iconColor} strokeWidth="1.5"/>
    {/* Torso */}
    <path d="M40 22V44" stroke={iconColor} strokeWidth="1.5"/>
    {/* Arms raised up in V shape */}
    <path d="M40 28L26 14" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M40 28L54 14" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Legs in lotus/crossed position - sitting */}
    <path d="M40 44L26 52C22 54 20 58 24 60C28 62 34 58 40 56" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M40 44L54 52C58 54 60 58 56 60C52 62 46 58 40 56" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Feet/ankles crossed */}
    <ellipse cx="40" cy="62" rx="12" ry="4" stroke={iconColor} strokeWidth="1.5"/>
  </svg>
);

// 7. Professional Photographer - Camera with lens (aperture style)
export const IconPhotographer = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Outer circle - lens ring */}
    <circle cx="40" cy="40" r="26" stroke={iconColor} strokeWidth="1.5"/>
    {/* Inner circle */}
    <circle cx="40" cy="40" r="18" stroke={iconColor} strokeWidth="1.5"/>
    {/* Aperture blades - 6 curved segments */}
    <path d="M40 22 Q48 30 44 40 Q40 32 40 22" stroke={iconColor} strokeWidth="1.2" fill="none"/>
    <path d="M55 28 Q52 40 44 44 Q52 36 55 28" stroke={iconColor} strokeWidth="1.2" fill="none"/>
    <path d="M55 52 Q44 52 40 44 Q50 48 55 52" stroke={iconColor} strokeWidth="1.2" fill="none"/>
    <path d="M40 58 Q32 50 36 40 Q40 48 40 58" stroke={iconColor} strokeWidth="1.2" fill="none"/>
    <path d="M25 52 Q28 40 36 36 Q28 44 25 52" stroke={iconColor} strokeWidth="1.2" fill="none"/>
    <path d="M25 28 Q36 28 40 36 Q30 32 25 28" stroke={iconColor} strokeWidth="1.2" fill="none"/>
    {/* Center dot */}
    <circle cx="40" cy="40" r="4" fill={iconColor}/>
  </svg>
);

// 8. Security Services - Shield with checkmark
export const IconSecurity = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Outer shield */}
    <path d="M40 10L16 22V40C16 56 28 66 40 72C52 66 64 56 64 40V22L40 10Z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Inner shield */}
    <path d="M40 20L24 28V40C24 52 32 58 40 62C48 58 56 52 56 40V28L40 20Z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Checkmark */}
    <path d="M30 40L37 47L52 32" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 9. Cleaning Services - Broom
export const IconCleaning = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Handle */}
    <line x1="40" y1="10" x2="40" y2="42" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round"/>
    {/* Broom head binding */}
    <rect x="32" y="40" width="16" height="6" stroke={iconColor} strokeWidth="1.5"/>
    {/* Bristles */}
    <path d="M32 46L28 70" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M36 46L34 70" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M40 46L40 70" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M44 46L46 70" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M48 46L52 70" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// 10. Driver Services - Steering wheel
export const IconDriver = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Outer wheel */}
    <circle cx="40" cy="40" r="26" stroke={iconColor} strokeWidth="1.5"/>
    {/* Inner hub */}
    <circle cx="40" cy="40" r="8" stroke={iconColor} strokeWidth="1.5"/>
    {/* Center */}
    <circle cx="40" cy="40" r="3" fill={iconColor}/>
    {/* Spokes */}
    <line x1="40" y1="14" x2="40" y2="32" stroke={iconColor} strokeWidth="3" strokeLinecap="round"/>
    <line x1="40" y1="48" x2="40" y2="66" stroke={iconColor} strokeWidth="3" strokeLinecap="round"/>
    <line x1="14" y1="40" x2="32" y2="40" stroke={iconColor} strokeWidth="3" strokeLinecap="round"/>
    <line x1="48" y1="40" x2="66" y2="40" stroke={iconColor} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// 11. Deliveries - Delivery truck
export const IconDeliveries = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Truck body */}
    <rect x="8" y="28" width="40" height="28" stroke={iconColor} strokeWidth="1.5"/>
    {/* Cabin */}
    <path d="M48 36H62C66 36 68 38 68 42V56H48V36Z" stroke={iconColor} strokeWidth="1.5"/>
    {/* Cabin window */}
    <path d="M52 36V44H64" stroke={iconColor} strokeWidth="1.5"/>
    {/* Wheels */}
    <circle cx="22" cy="58" r="6" stroke={iconColor} strokeWidth="1.5"/>
    <circle cx="22" cy="58" r="2" fill={iconColor}/>
    <circle cx="58" cy="58" r="6" stroke={iconColor} strokeWidth="1.5"/>
    <circle cx="58" cy="58" r="2" fill={iconColor}/>
    {/* Ground line */}
    <line x1="28" y1="56" x2="52" y2="56" stroke={iconColor} strokeWidth="1.5"/>
  </svg>
);

// 12. Babysitting - Pacifier (chupete)
export const IconBabysitting = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Nipple/teat */}
    <ellipse cx="40" cy="18" rx="10" ry="12" stroke={iconColor} strokeWidth="1.5"/>
    {/* Mouth shield - butterfly/rounded shape */}
    <path d="M18 38C18 32 28 28 40 28C52 28 62 32 62 38C62 44 52 48 40 48C28 48 18 44 18 38Z" stroke={iconColor} strokeWidth="1.5"/>
    {/* Shield holes */}
    <circle cx="28" cy="38" r="3" stroke={iconColor} strokeWidth="1"/>
    <circle cx="52" cy="38" r="3" stroke={iconColor} strokeWidth="1"/>
    {/* Handle/ring at bottom */}
    <circle cx="40" cy="60" r="10" stroke={iconColor} strokeWidth="2"/>
    {/* Connection to shield */}
    <rect x="36" y="48" width="8" height="6" stroke={iconColor} strokeWidth="1.5"/>
  </svg>
);

export const serviceIconsMap: Record<string, React.FC<{ className?: string }>> = {
  'events': IconPersonalizedEvents,
  'nightlife': IconNightLife,
  'catering': IconCatering,
  'furniture': IconFurniture,
  'health': IconHealthBeauty,
  'yoga': IconYoga,
  'photographer': IconPhotographer,
  'security': IconSecurity,
  'cleaning': IconCleaning,
  'driver': IconDriver,
  'deliveries': IconDeliveries,
  'babysitting': IconBabysitting,
};

// Icon for Villas
export const IconVillas = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Roof */}
    <path d="M10 38L40 14L70 38" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* House body */}
    <rect x="18" y="38" width="44" height="28" stroke={iconColor} strokeWidth="1.5"/>
    {/* Door */}
    <rect x="34" y="48" width="12" height="18" stroke={iconColor} strokeWidth="1.5"/>
    {/* Windows */}
    <rect x="22" y="44" width="8" height="8" stroke={iconColor} strokeWidth="1.5"/>
    <rect x="50" y="44" width="8" height="8" stroke={iconColor} strokeWidth="1.5"/>
  </svg>
);

// Icon for Yachts
export const IconYachts = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Mast */}
    <line x1="35" y1="12" x2="35" y2="48" stroke={iconColor} strokeWidth="1.5"/>
    {/* Main sail */}
    <path d="M35 14L58 44L35 44Z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Front sail */}
    <path d="M35 18L18 44L35 44Z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Hull */}
    <path d="M12 48H58L52 60H18L12 48Z" stroke={iconColor} strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Waves */}
    <path d="M8 66C14 62 20 66 26 62C32 58 38 62 44 58C50 62 56 58 62 62C68 66 74 62 80 66" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// For slideshow (3 main services)
export const servicesWithIcons = [
  { id: 'villas', title: 'Villas', icon: IconVillas },
  { id: 'yacht', title: 'Yachts & Charters', icon: IconYachts },
  { id: 'events', title: 'Personalized Events', icon: IconPersonalizedEvents },
];

// For grid section (14 services - 2 rows of 7)
export const allServicesGrid = [
  // Row 1
  { id: 'villas', title: 'Villa rental', icon: IconVillas },
  { id: 'yacht', title: 'Boat charter', icon: IconYachts },
  { id: 'events', title: 'Personalized Events', icon: IconPersonalizedEvents },
  { id: 'nightlife', title: 'Night Life', icon: IconNightLife },
  { id: 'catering', title: 'Catering & Bottle Service', icon: IconCatering },
  { id: 'furniture', title: 'Furniture', icon: IconFurniture },
  { id: 'health', title: 'Health & Beauty Program', icon: IconHealthBeauty },
  // Row 2
  { id: 'yoga', title: 'Yoga & Personal Growth', icon: IconYoga },
  { id: 'photographer', title: 'Professional Photographer', icon: IconPhotographer },
  { id: 'security', title: 'Security Services', icon: IconSecurity },
  { id: 'cleaning', title: 'Cleaning Services', icon: IconCleaning },
  { id: 'driver', title: 'Driver Services', icon: IconDriver },
  { id: 'deliveries', title: 'Deliveries', icon: IconDeliveries },
  { id: 'babysitting', title: 'Babysitting', icon: IconBabysitting },
];
