
import { Villa, Service, Language } from './types';

export const getVillas = (lang: Language): Villa[] => [
  {
    id: 'can-kef',
    name: 'Can Kef',
    location: 'S’Estanyol',
    shortDescription: lang === 'es' ? 'Obra maestra del minimalismo arquitectónico con privacidad absoluta.' : 'Architectural minimalist masterpiece offering absolute privacy.',
    price: lang === 'es' ? 'Disponible bajo solicitud' : 'On Request',
    priceRange: lang === 'es' ? 'Disponible bajo solicitud' : 'Available upon request',
    numericPrice: 0,
    bedrooms: 8,
    bathrooms: 9,
    maxGuests: 16,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000',
    category: 'Modern',
    listingType: 'holiday',
    fullDescription: lang === 'es' ? [
      "Arquitectura icónica inspirada en el Pabellón de Barcelona de Mies van der Rohe.",
      "Una propiedad de lujo tranquila que ofrece total privacidad en una de las ubicaciones más deseables de la isla."
    ] : [
      "Iconic architecture inspired by Mies van der Rohe’s Barcelona Pavilion.",
      "A tranquil luxury property providing total privacy."
    ],
    features: lang === 'es' ? ["Parcela de 50.000 m2", "Piscina 22m"] : ["50,000 m2 Plot", "22m Pool"],
    gallery: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    id: 'casa-cigala',
    name: 'Casa Cigala',
    location: 'Cala Jondal',
    shortDescription: lang === 'es' ? 'La elegancia rústica se encuentra con el alma auténtica del Mediterráneo.' : 'Rustic elegance meets the authentic soul of the Mediterranean.',
    price: lang === 'es' ? 'Desde 15.000€ / semana' : 'From 15,000€ / week',
    priceRange: '15.000€ - 35.000€',
    numericPrice: 15000,
    bedrooms: 6,
    bathrooms: 6,
    maxGuests: 12,
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&q=80&w=2000', 
    category: 'Traditional',
    listingType: 'holiday',
    fullDescription: lang === 'es' ? [
      "Casa Cigala es la definición del lujo rústico ibicenco. Una propiedad que celebra la mampostería tradicional y la luz del Mediterráneo.",
      "Destaca por sus interiores encalados con suelos de terracota auténtica y mobiliario de obra integrado que aporta una calidez orgánica única.",
      "El baño principal es una pieza de diseño singular, contando con una chimenea de obra integrada frente a los lavabos, permitiendo una experiencia de bienestar inigualable.",
      "Las suites se abren directamente a terrazas privadas con vistas a jardines de palmeras, fundiendo el interior con la naturaleza de la isla."
    ] : [
      "Casa Cigala is the definition of rustic Ibizan luxury. A property celebrating traditional masonry and Mediterranean light.",
      "It features whitewashed interiors with authentic terracotta floors and integrated built-in furniture providing unique organic warmth.",
      "The master bathroom is a unique design piece, featuring a built-in fireplace facing the sinks, offering an unparalleled wellness experience.",
      "Suites open directly to private terraces with palm garden views, merging the interior with the island's nature."
    ],
    features: lang === 'es' ? [
      "Chimenea de obra en suite principal",
      "Suelos de barro cocido tradicional",
      "Lavabos dobles de mampostería",
      "Vistas al jardín mediterráneo y mar",
      "Mobiliario de madera maciza",
      "Acceso directo a terrazas",
      "Aire acondicionado centralizado",
      "Ubicación privilegiada en Cala Jondal"
    ] : [
      "Built-in fireplace in master suite",
      "Traditional terracotta flooring",
      "Double masonry washbasins",
      "Sea and Mediterranean garden views",
      "Solid wood furniture",
      "Direct terrace access",
      "Central air conditioning",
      "Prime Cala Jondal location"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&q=80&w=1200", 
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200", 
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1200", 
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"  
    ],
    seasonalPrices: [
      { month: lang === 'es' ? "Mayo / Octubre" : "May / October", price: "15.000€" },
      { month: lang === 'es' ? "Junio / Septiembre" : "June / September", price: "22.000€" },
      { month: lang === 'es' ? "Julio / Agosto" : "July / August", price: "35.000€" }
    ]
  },
  {
    id: 'nui-blau',
    name: 'Nui Blau',
    location: 'Santa Eulalia',
    shortDescription: lang === 'es' ? 'Un santuario de serenidad y artesanía tradicional ibicenca.' : 'A serene sanctuary of traditional Ibizan craftsmanship.',
    price: lang === 'es' ? 'Bajo solicitud' : 'On Request',
    priceRange: lang === 'es' ? 'Consulte disponibilidad' : 'Check availability',
    numericPrice: 0,
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=2000',
    category: 'Traditional',
    listingType: 'holiday',
    fullDescription: lang === 'es' ? [
      "Villa Nui Blau representa la Ibiza más pura. Un refugio tradicional con toques de confort contemporáneo.",
      "Sus estancias principales conservan la esencia de la mampostería ibicenca, con baños que integran chimeneas y ventanales que enmarcan la costa.",
      "Ideal para quienes buscan la calma de los materiales naturales y la arquitectura que respira."
    ] : [
      "Villa Nui Blau represents pure Ibiza. A traditional retreat with contemporary comfort touches.",
      "Main rooms preserve the essence of Ibizan masonry, featuring bathrooms with integrated fireplaces and windows framing the coast."
    ],
    features: lang === 'es' ? ["Estilo tradicional", "Baños de obra", "Vistas al mar"] : ["Traditional style", "Masonry bathrooms", "Sea views"],
    gallery: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200"
    ]
  }
];

export const getServices = (lang: Language): Service[] => [
  {
    id: 'villas',
    title: lang === 'es' ? 'Villas de Lujo' : 'Luxury Villas',
    description: lang === 'es' ? 'Colección invisible de propiedades off-market.' : 'Invisible collection of off-market properties.',
    icon: '🏡',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'yacht',
    title: lang === 'es' ? 'Yates & Charters' : 'Yachting & Charters',
    description: lang === 'es' ? 'Navegue por las aguas de Formentera con estilo.' : 'Sail the Formentera waters with absolute style.',
    icon: '🛥️',
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2bb96a?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'security',
    title: lang === 'es' ? 'Seguridad Privada' : 'Private Security',
    description: lang === 'es' ? 'Protección discreta para su total tranquilidad.' : 'Discreet protection for your total peace of mind.',
    icon: '🛡️',
    imageUrl: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'wellness',
    title: lang === 'es' ? 'Bienestar Holístico' : 'Holistic Wellness',
    description: lang === 'es' ? 'Programas de yoga y salud personalizados.' : 'Personalized yoga and health programs.',
    icon: '🧘',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'nightlife',
    title: lang === 'es' ? 'Vida Nocturna' : 'Nightlife',
    description: lang === 'es' ? 'Acceso VIP a los clubes más icónicos.' : 'VIP access to the most iconic clubs.',
    icon: '✨',
    imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'catering',
    title: lang === 'es' ? 'Gastronomía' : 'Gastronomy',
    description: lang === 'es' ? 'Chefs privados y catering de alta gama.' : 'Private chefs and high-end catering.',
    icon: '🍽️',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000'
  }
];
