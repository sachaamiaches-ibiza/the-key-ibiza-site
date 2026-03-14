/**
 * SEO Configuration for The Key Ibiza
 * Keywords and meta descriptions for all services in all languages
 */

import { Language } from './types';

interface ServiceSEO {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  h2: string;
}

interface PageSEO {
  en: ServiceSEO;
  fr: ServiceSEO;
  es: ServiceSEO;
  de: ServiceSEO;
}

export const seoConfig: Record<string, PageSEO> = {
  // ============================================
  // VILLAS
  // ============================================
  'holiday-rentals': {
    en: {
      title: 'Luxury Villa Rental Ibiza | Holiday Villas with Pool | The Key Ibiza',
      description: 'Rent exclusive luxury villas in Ibiza with private pool, sea views, and concierge service. Premium holiday rentals in Cala Jondal, Es Cubells, San Jose. Book your dream villa.',
      keywords: ['luxury villa rental ibiza', 'ibiza villa with pool', 'holiday villa ibiza', 'private villa ibiza', 'villa rental cala jondal', 'es cubells villa', 'san jose villa rental', 'ibiza holiday home', 'exclusive villa ibiza'],
      h1: 'Luxury Villa Rentals in Ibiza',
      h2: 'Exclusive Holiday Villas with Pool & Sea Views'
    },
    fr: {
      title: 'Location Villa de Luxe Ibiza | Villas Vacances avec Piscine | The Key Ibiza',
      description: 'Louez des villas de luxe exclusives à Ibiza avec piscine privée, vue mer et service de conciergerie. Locations premium à Cala Jondal, Es Cubells, San Jose. Réservez votre villa de rêve.',
      keywords: ['location villa luxe ibiza', 'villa ibiza avec piscine', 'location vacances ibiza', 'villa privée ibiza', 'louer villa ibiza', 'villa cala jondal', 'location villa es cubells', 'maison vacances ibiza', 'villa prestige ibiza'],
      h1: 'Location de Villas de Luxe à Ibiza',
      h2: 'Villas Exclusives avec Piscine & Vue Mer'
    },
    es: {
      title: 'Alquiler Villa de Lujo Ibiza | Villas Vacaciones con Piscina | The Key Ibiza',
      description: 'Alquile villas de lujo exclusivas en Ibiza con piscina privada, vistas al mar y servicio de conserjería. Alquileres premium en Cala Jondal, Es Cubells, San Jose.',
      keywords: ['alquiler villa lujo ibiza', 'villa ibiza con piscina', 'alquiler vacacional ibiza', 'villa privada ibiza', 'alquilar villa ibiza', 'villa cala jondal', 'villa es cubells', 'casa vacaciones ibiza', 'villa exclusiva ibiza'],
      h1: 'Alquiler de Villas de Lujo en Ibiza',
      h2: 'Villas Exclusivas con Piscina y Vistas al Mar'
    },
    de: {
      title: 'Luxus Villa Mieten Ibiza | Ferienvilla mit Pool | The Key Ibiza',
      description: 'Mieten Sie exklusive Luxusvillen auf Ibiza mit privatem Pool, Meerblick und Concierge-Service. Premium-Vermietungen in Cala Jondal, Es Cubells, San Jose.',
      keywords: ['luxus villa mieten ibiza', 'villa ibiza mit pool', 'ferienvilla ibiza', 'private villa ibiza', 'villa mieten ibiza', 'villa cala jondal', 'villa es cubells', 'ferienhaus ibiza', 'exklusive villa ibiza'],
      h1: 'Luxusvillen Mieten auf Ibiza',
      h2: 'Exklusive Ferienvillen mit Pool & Meerblick'
    }
  },

  'long-term': {
    en: {
      title: 'Long Term Villa Rental Ibiza | Monthly Rentals | The Key Ibiza',
      description: 'Long term luxury villa rentals in Ibiza. Monthly and yearly leases for executives, remote workers, and families. Premium properties with all amenities included.',
      keywords: ['long term rental ibiza', 'monthly villa rental ibiza', 'yearly rental ibiza', 'ibiza expat housing', 'long stay ibiza', 'winter rental ibiza', 'remote work ibiza villa'],
      h1: 'Long Term Villa Rentals in Ibiza',
      h2: 'Monthly & Yearly Luxury Rentals'
    },
    fr: {
      title: 'Location Longue Durée Villa Ibiza | Location Mensuelle | The Key Ibiza',
      description: 'Location longue durée de villas de luxe à Ibiza. Baux mensuels et annuels pour cadres, télétravailleurs et familles. Propriétés premium tout inclus.',
      keywords: ['location longue durée ibiza', 'location mensuelle villa ibiza', 'location annuelle ibiza', 'expatrié ibiza logement', 'séjour longue durée ibiza', 'location hiver ibiza', 'télétravail ibiza'],
      h1: 'Location Longue Durée à Ibiza',
      h2: 'Locations Mensuelles & Annuelles de Luxe'
    },
    es: {
      title: 'Alquiler Larga Temporada Villa Ibiza | Alquiler Mensual | The Key Ibiza',
      description: 'Alquiler de larga temporada de villas de lujo en Ibiza. Contratos mensuales y anuales para ejecutivos, teletrabajadores y familias.',
      keywords: ['alquiler larga temporada ibiza', 'alquiler mensual villa ibiza', 'alquiler anual ibiza', 'expatriado ibiza vivienda', 'estancia larga ibiza', 'alquiler invierno ibiza'],
      h1: 'Alquiler Larga Temporada en Ibiza',
      h2: 'Alquileres Mensuales y Anuales de Lujo'
    },
    de: {
      title: 'Langzeitmiete Villa Ibiza | Monatsmiete | The Key Ibiza',
      description: 'Langzeitvermietung von Luxusvillen auf Ibiza. Monats- und Jahresverträge für Führungskräfte, Remote-Arbeiter und Familien.',
      keywords: ['langzeitmiete ibiza', 'monatsmiete villa ibiza', 'jahresmiete ibiza', 'expat ibiza wohnung', 'langzeitaufenthalt ibiza', 'wintermiete ibiza'],
      h1: 'Langzeitmiete auf Ibiza',
      h2: 'Luxus Monats- & Jahresmieten'
    }
  },

  'for-sale': {
    en: {
      title: 'Luxury Property for Sale Ibiza | Buy Villa Ibiza | The Key Ibiza',
      description: 'Exclusive luxury properties for sale in Ibiza. Buy your dream villa in prime locations. Off-market properties, sea view estates, and investment opportunities.',
      keywords: ['property for sale ibiza', 'buy villa ibiza', 'luxury real estate ibiza', 'ibiza property investment', 'villa for sale cala jondal', 'ibiza off-market property', 'sea view villa ibiza buy'],
      h1: 'Luxury Properties for Sale in Ibiza',
      h2: 'Exclusive Villas & Investment Opportunities'
    },
    fr: {
      title: 'Propriété de Luxe à Vendre Ibiza | Acheter Villa Ibiza | The Key Ibiza',
      description: 'Propriétés de luxe exclusives à vendre à Ibiza. Achetez votre villa de rêve dans les meilleurs emplacements. Biens off-market et opportunités d\'investissement.',
      keywords: ['propriété à vendre ibiza', 'acheter villa ibiza', 'immobilier luxe ibiza', 'investissement immobilier ibiza', 'villa à vendre ibiza', 'bien off-market ibiza', 'achat maison ibiza'],
      h1: 'Propriétés de Luxe à Vendre à Ibiza',
      h2: 'Villas Exclusives & Opportunités d\'Investissement'
    },
    es: {
      title: 'Propiedad de Lujo en Venta Ibiza | Comprar Villa Ibiza | The Key Ibiza',
      description: 'Propiedades de lujo exclusivas en venta en Ibiza. Compre su villa soñada en ubicaciones premium. Propiedades off-market y oportunidades de inversión.',
      keywords: ['propiedad en venta ibiza', 'comprar villa ibiza', 'inmobiliaria lujo ibiza', 'inversión inmobiliaria ibiza', 'villa en venta ibiza', 'propiedad off-market ibiza'],
      h1: 'Propiedades de Lujo en Venta en Ibiza',
      h2: 'Villas Exclusivas & Oportunidades de Inversión'
    },
    de: {
      title: 'Luxusimmobilien Kaufen Ibiza | Villa Kaufen Ibiza | The Key Ibiza',
      description: 'Exklusive Luxusimmobilien zum Verkauf auf Ibiza. Kaufen Sie Ihre Traumvilla in Premiumlagen. Off-Market Immobilien und Investitionsmöglichkeiten.',
      keywords: ['immobilie kaufen ibiza', 'villa kaufen ibiza', 'luxus immobilien ibiza', 'immobilien investment ibiza', 'haus kaufen ibiza', 'off-market immobilie ibiza'],
      h1: 'Luxusimmobilien Kaufen auf Ibiza',
      h2: 'Exklusive Villen & Investitionsmöglichkeiten'
    }
  },

  // ============================================
  // BOATS & YACHTS
  // ============================================
  'boats': {
    en: {
      title: 'Yacht Charter Ibiza | Boat Rental | Luxury Charters | The Key Ibiza',
      description: 'Luxury yacht and boat charter in Ibiza and Formentera. Private yacht rental with crew, day charters, sunset cruises. Book your exclusive maritime experience.',
      keywords: ['yacht charter ibiza', 'boat rental ibiza', 'luxury yacht ibiza', 'private boat hire ibiza', 'yacht rental formentera', 'ibiza boat trip', 'sunset cruise ibiza', 'superyacht charter ibiza'],
      h1: 'Yacht & Boat Charter in Ibiza',
      h2: 'Luxury Maritime Experiences'
    },
    fr: {
      title: 'Location Yacht Ibiza | Location Bateau | Charters Luxe | The Key Ibiza',
      description: 'Location de yachts et bateaux de luxe à Ibiza et Formentera. Location privée avec équipage, excursions à la journée, croisières coucher de soleil.',
      keywords: ['location yacht ibiza', 'location bateau ibiza', 'yacht luxe ibiza', 'louer bateau ibiza', 'charter yacht formentera', 'excursion bateau ibiza', 'croisière coucher soleil ibiza', 'superyacht ibiza'],
      h1: 'Location de Yacht & Bateau à Ibiza',
      h2: 'Expériences Maritimes de Luxe'
    },
    es: {
      title: 'Alquiler Yate Ibiza | Alquiler Barco | Charters Lujo | The Key Ibiza',
      description: 'Alquiler de yates y barcos de lujo en Ibiza y Formentera. Alquiler privado con tripulación, excursiones de un día, cruceros al atardecer.',
      keywords: ['alquiler yate ibiza', 'alquiler barco ibiza', 'yate lujo ibiza', 'alquilar barco ibiza', 'charter yate formentera', 'excursión barco ibiza', 'crucero atardecer ibiza'],
      h1: 'Alquiler de Yates y Barcos en Ibiza',
      h2: 'Experiencias Marítimas de Lujo'
    },
    de: {
      title: 'Yacht Mieten Ibiza | Boot Mieten | Luxus Charter | The Key Ibiza',
      description: 'Luxus Yacht- und Bootscharter auf Ibiza und Formentera. Private Yachtvermietung mit Crew, Tagesausflüge, Sonnenuntergangskreuzfahrten.',
      keywords: ['yacht mieten ibiza', 'boot mieten ibiza', 'luxus yacht ibiza', 'boot chartern ibiza', 'yacht charter formentera', 'bootsausflug ibiza', 'sonnenuntergang kreuzfahrt ibiza'],
      h1: 'Yacht & Boot Mieten auf Ibiza',
      h2: 'Luxuriöse Maritime Erlebnisse'
    }
  },

  'yachts': {
    en: {
      title: 'Luxury Yacht Rental Ibiza | Superyacht Charter | The Key Ibiza',
      description: 'Premium luxury yachts for charter in Ibiza. Superyachts with crew, motor yachts, sailing yachts. Explore Ibiza and Formentera in ultimate style.',
      keywords: ['luxury yacht ibiza', 'superyacht charter ibiza', 'motor yacht ibiza', 'sailing yacht ibiza', 'yacht with crew ibiza', 'private yacht ibiza', 'mega yacht ibiza'],
      h1: 'Luxury Yacht Rentals',
      h2: 'Premium Superyacht Charters in Ibiza'
    },
    fr: {
      title: 'Location Yacht Luxe Ibiza | Charter Superyacht | The Key Ibiza',
      description: 'Yachts de luxe premium à louer à Ibiza. Superyachts avec équipage, yachts à moteur, voiliers. Explorez Ibiza et Formentera avec style.',
      keywords: ['yacht luxe ibiza', 'charter superyacht ibiza', 'yacht moteur ibiza', 'voilier ibiza', 'yacht avec équipage ibiza', 'yacht privé ibiza', 'mega yacht ibiza'],
      h1: 'Location de Yachts de Luxe',
      h2: 'Charters de Superyachts Premium à Ibiza'
    },
    es: {
      title: 'Alquiler Yate Lujo Ibiza | Charter Superyate | The Key Ibiza',
      description: 'Yates de lujo premium en alquiler en Ibiza. Superyates con tripulación, yates a motor, veleros. Explore Ibiza y Formentera con estilo.',
      keywords: ['yate lujo ibiza', 'charter superyate ibiza', 'yate motor ibiza', 'velero ibiza', 'yate con tripulación ibiza', 'yate privado ibiza'],
      h1: 'Alquiler de Yates de Lujo',
      h2: 'Charters de Superyates Premium en Ibiza'
    },
    de: {
      title: 'Luxus Yacht Mieten Ibiza | Superyacht Charter | The Key Ibiza',
      description: 'Premium Luxusyachten zum Charter auf Ibiza. Superyachten mit Crew, Motoryachten, Segelyachten. Erkunden Sie Ibiza und Formentera mit Stil.',
      keywords: ['luxus yacht ibiza', 'superyacht charter ibiza', 'motoryacht ibiza', 'segelyacht ibiza', 'yacht mit crew ibiza', 'private yacht ibiza'],
      h1: 'Luxusyachten Mieten',
      h2: 'Premium Superyacht Charter auf Ibiza'
    }
  },

  'catamarans': {
    en: {
      title: 'Catamaran Charter Ibiza | Sailing Catamaran Rental | The Key Ibiza',
      description: 'Luxury catamaran charter in Ibiza and Formentera. Spacious sailing catamarans for day trips, sunset sails, and island hopping adventures.',
      keywords: ['catamaran charter ibiza', 'catamaran rental ibiza', 'sailing catamaran ibiza', 'catamaran formentera', 'catamaran day trip ibiza', 'luxury catamaran ibiza'],
      h1: 'Catamaran Charter in Ibiza',
      h2: 'Spacious Sailing Experiences'
    },
    fr: {
      title: 'Location Catamaran Ibiza | Charter Catamaran | The Key Ibiza',
      description: 'Location de catamarans de luxe à Ibiza et Formentera. Catamarans spacieux pour excursions à la journée, couchers de soleil et découverte des îles.',
      keywords: ['location catamaran ibiza', 'charter catamaran ibiza', 'catamaran voile ibiza', 'catamaran formentera', 'excursion catamaran ibiza', 'catamaran luxe ibiza'],
      h1: 'Location de Catamaran à Ibiza',
      h2: 'Expériences de Navigation Spacieuses'
    },
    es: {
      title: 'Alquiler Catamarán Ibiza | Charter Catamarán | The Key Ibiza',
      description: 'Alquiler de catamaranes de lujo en Ibiza y Formentera. Catamaranes espaciosos para excursiones de un día, atardeceres y aventuras entre islas.',
      keywords: ['alquiler catamarán ibiza', 'charter catamarán ibiza', 'catamarán vela ibiza', 'catamarán formentera', 'excursión catamarán ibiza', 'catamarán lujo ibiza'],
      h1: 'Alquiler de Catamarán en Ibiza',
      h2: 'Experiencias de Navegación Espaciosas'
    },
    de: {
      title: 'Katamaran Mieten Ibiza | Katamaran Charter | The Key Ibiza',
      description: 'Luxus Katamaran Charter auf Ibiza und Formentera. Geräumige Segelkatamarane für Tagesausflüge, Sonnenuntergangsfahrten und Inselhopping.',
      keywords: ['katamaran mieten ibiza', 'katamaran charter ibiza', 'segelkatamaran ibiza', 'katamaran formentera', 'katamaran ausflug ibiza', 'luxus katamaran ibiza'],
      h1: 'Katamaran Mieten auf Ibiza',
      h2: 'Geräumige Segelerlebnisse'
    }
  },

  // ============================================
  // SECURITY
  // ============================================
  'security': {
    en: {
      title: 'Private Security Ibiza | VIP Bodyguards | Close Protection | The Key Ibiza',
      description: 'Professional private security services in Ibiza. VIP bodyguards, close protection, event security, residential security for high-net-worth individuals.',
      keywords: ['private security ibiza', 'bodyguard ibiza', 'vip protection ibiza', 'close protection ibiza', 'security guard ibiza', 'event security ibiza', 'residential security ibiza', 'celebrity security ibiza'],
      h1: 'Private Security Services in Ibiza',
      h2: 'VIP Protection & Close Protection'
    },
    fr: {
      title: 'Sécurité Privée Ibiza | Garde du Corps VIP | Protection Rapprochée | The Key Ibiza',
      description: 'Services de sécurité privée professionnels à Ibiza. Gardes du corps VIP, protection rapprochée, sécurité événementielle pour personnalités.',
      keywords: ['sécurité privée ibiza', 'garde du corps ibiza', 'protection vip ibiza', 'protection rapprochée ibiza', 'agent sécurité ibiza', 'sécurité événement ibiza', 'sécurité résidentielle ibiza'],
      h1: 'Services de Sécurité Privée à Ibiza',
      h2: 'Protection VIP & Protection Rapprochée'
    },
    es: {
      title: 'Seguridad Privada Ibiza | Guardaespaldas VIP | Protección | The Key Ibiza',
      description: 'Servicios de seguridad privada profesional en Ibiza. Guardaespaldas VIP, protección cercana, seguridad para eventos y residencias.',
      keywords: ['seguridad privada ibiza', 'guardaespaldas ibiza', 'protección vip ibiza', 'escolta ibiza', 'seguridad eventos ibiza', 'seguridad residencial ibiza'],
      h1: 'Servicios de Seguridad Privada en Ibiza',
      h2: 'Protección VIP y Escoltas'
    },
    de: {
      title: 'Private Sicherheit Ibiza | VIP Bodyguard | Personenschutz | The Key Ibiza',
      description: 'Professionelle private Sicherheitsdienste auf Ibiza. VIP Bodyguards, Personenschutz, Veranstaltungssicherheit für vermögende Personen.',
      keywords: ['private sicherheit ibiza', 'bodyguard ibiza', 'vip schutz ibiza', 'personenschutz ibiza', 'sicherheitsdienst ibiza', 'event sicherheit ibiza'],
      h1: 'Private Sicherheitsdienste auf Ibiza',
      h2: 'VIP Schutz & Personenschutz'
    }
  },

  // ============================================
  // WELLNESS
  // ============================================
  'wellness': {
    en: {
      title: 'Wellness & Spa Ibiza | Private Massage | Luxury Treatments | The Key Ibiza',
      description: 'Luxury wellness services in Ibiza. Private spa treatments, in-villa massage, beauty services, holistic therapies. Rejuvenate in paradise.',
      keywords: ['wellness ibiza', 'spa ibiza', 'private massage ibiza', 'in-villa spa ibiza', 'beauty treatment ibiza', 'holistic therapy ibiza', 'luxury spa ibiza', 'massage at home ibiza'],
      h1: 'Wellness & Spa Services in Ibiza',
      h2: 'Private Luxury Treatments in Your Villa'
    },
    fr: {
      title: 'Bien-être & Spa Ibiza | Massage Privé | Soins Luxe | The Key Ibiza',
      description: 'Services de bien-être de luxe à Ibiza. Soins spa privés, massage à domicile, soins beauté, thérapies holistiques. Ressourcez-vous au paradis.',
      keywords: ['bien-être ibiza', 'spa ibiza', 'massage privé ibiza', 'spa à domicile ibiza', 'soin beauté ibiza', 'thérapie holistique ibiza', 'spa luxe ibiza', 'massage villa ibiza'],
      h1: 'Services Bien-être & Spa à Ibiza',
      h2: 'Soins de Luxe Privés dans Votre Villa'
    },
    es: {
      title: 'Bienestar & Spa Ibiza | Masaje Privado | Tratamientos Lujo | The Key Ibiza',
      description: 'Servicios de bienestar de lujo en Ibiza. Tratamientos spa privados, masaje a domicilio, servicios de belleza, terapias holísticas.',
      keywords: ['bienestar ibiza', 'spa ibiza', 'masaje privado ibiza', 'spa a domicilio ibiza', 'tratamiento belleza ibiza', 'terapia holística ibiza', 'spa lujo ibiza'],
      h1: 'Servicios de Bienestar & Spa en Ibiza',
      h2: 'Tratamientos de Lujo Privados en su Villa'
    },
    de: {
      title: 'Wellness & Spa Ibiza | Private Massage | Luxus Behandlungen | The Key Ibiza',
      description: 'Luxus Wellness-Services auf Ibiza. Private Spa-Behandlungen, Massage in der Villa, Beauty-Services, ganzheitliche Therapien.',
      keywords: ['wellness ibiza', 'spa ibiza', 'private massage ibiza', 'spa in villa ibiza', 'beauty behandlung ibiza', 'ganzheitliche therapie ibiza', 'luxus spa ibiza'],
      h1: 'Wellness & Spa Services auf Ibiza',
      h2: 'Private Luxusbehandlungen in Ihrer Villa'
    }
  },

  // ============================================
  // NIGHTLIFE
  // ============================================
  'nightlife': {
    en: {
      title: 'Ibiza Nightlife VIP | Club Tables | VIP Access | The Key Ibiza',
      description: 'VIP nightlife experiences in Ibiza. Club table reservations, VIP access, bottle service at Pacha, Amnesia, Ushuaia, Hi Ibiza. Skip the line.',
      keywords: ['ibiza nightlife', 'vip table ibiza', 'club reservation ibiza', 'pacha vip table', 'amnesia vip ibiza', 'ushuaia table booking', 'hi ibiza vip', 'ibiza club access', 'bottle service ibiza'],
      h1: 'VIP Nightlife Experiences in Ibiza',
      h2: 'Club Tables & VIP Access'
    },
    fr: {
      title: 'Vie Nocturne Ibiza VIP | Tables Club | Accès VIP | The Key Ibiza',
      description: 'Expériences VIP de la vie nocturne à Ibiza. Réservation de tables, accès VIP, service bouteille au Pacha, Amnesia, Ushuaia, Hi Ibiza.',
      keywords: ['vie nocturne ibiza', 'table vip ibiza', 'réservation club ibiza', 'table pacha ibiza', 'amnesia vip ibiza', 'réservation ushuaia', 'hi ibiza vip', 'accès club ibiza', 'bouteille ibiza'],
      h1: 'Expériences VIP Vie Nocturne à Ibiza',
      h2: 'Tables Club & Accès VIP'
    },
    es: {
      title: 'Vida Nocturna Ibiza VIP | Mesas Club | Acceso VIP | The Key Ibiza',
      description: 'Experiencias VIP de vida nocturna en Ibiza. Reserva de mesas, acceso VIP, servicio de botellas en Pacha, Amnesia, Ushuaia, Hi Ibiza.',
      keywords: ['vida nocturna ibiza', 'mesa vip ibiza', 'reserva club ibiza', 'mesa pacha ibiza', 'amnesia vip ibiza', 'reserva ushuaia', 'hi ibiza vip', 'acceso club ibiza'],
      h1: 'Experiencias VIP Vida Nocturna en Ibiza',
      h2: 'Mesas Club & Acceso VIP'
    },
    de: {
      title: 'Ibiza Nachtleben VIP | Club Tische | VIP Zugang | The Key Ibiza',
      description: 'VIP Nachtleben-Erlebnisse auf Ibiza. Tischreservierungen, VIP-Zugang, Flaschenservice bei Pacha, Amnesia, Ushuaia, Hi Ibiza.',
      keywords: ['ibiza nachtleben', 'vip tisch ibiza', 'club reservierung ibiza', 'pacha tisch ibiza', 'amnesia vip ibiza', 'ushuaia reservierung', 'hi ibiza vip', 'club zugang ibiza'],
      h1: 'VIP Nachtleben-Erlebnisse auf Ibiza',
      h2: 'Club Tische & VIP Zugang'
    }
  },

  // ============================================
  // EVENTS
  // ============================================
  'events': {
    en: {
      title: 'Event Planning Ibiza | Private Parties | Luxury Events | The Key Ibiza',
      description: 'Luxury event planning in Ibiza. Private parties, weddings, corporate events, birthday celebrations. Full-service event management and production.',
      keywords: ['event planning ibiza', 'private party ibiza', 'wedding ibiza', 'corporate event ibiza', 'birthday party ibiza', 'event organizer ibiza', 'luxury event ibiza', 'party planner ibiza'],
      h1: 'Luxury Event Planning in Ibiza',
      h2: 'Private Parties & Exclusive Celebrations'
    },
    fr: {
      title: 'Organisation Événements Ibiza | Fêtes Privées | Événements Luxe | The Key Ibiza',
      description: 'Organisation d\'événements de luxe à Ibiza. Fêtes privées, mariages, événements corporate, anniversaires. Service complet de gestion événementielle.',
      keywords: ['organisation événement ibiza', 'fête privée ibiza', 'mariage ibiza', 'événement corporate ibiza', 'anniversaire ibiza', 'organisateur événement ibiza', 'événement luxe ibiza', 'wedding planner ibiza'],
      h1: 'Organisation d\'Événements de Luxe à Ibiza',
      h2: 'Fêtes Privées & Célébrations Exclusives'
    },
    es: {
      title: 'Organización Eventos Ibiza | Fiestas Privadas | Eventos Lujo | The Key Ibiza',
      description: 'Organización de eventos de lujo en Ibiza. Fiestas privadas, bodas, eventos corporativos, cumpleaños. Servicio completo de gestión de eventos.',
      keywords: ['organización eventos ibiza', 'fiesta privada ibiza', 'boda ibiza', 'evento corporativo ibiza', 'cumpleaños ibiza', 'organizador eventos ibiza', 'evento lujo ibiza'],
      h1: 'Organización de Eventos de Lujo en Ibiza',
      h2: 'Fiestas Privadas & Celebraciones Exclusivas'
    },
    de: {
      title: 'Eventplanung Ibiza | Private Partys | Luxus Events | The Key Ibiza',
      description: 'Luxus Eventplanung auf Ibiza. Private Partys, Hochzeiten, Firmenevents, Geburtstagsfeiern. Full-Service Eventmanagement.',
      keywords: ['eventplanung ibiza', 'private party ibiza', 'hochzeit ibiza', 'firmenevent ibiza', 'geburtstagsfeier ibiza', 'eventorganisator ibiza', 'luxus event ibiza'],
      h1: 'Luxus Eventplanung auf Ibiza',
      h2: 'Private Partys & Exklusive Feiern'
    }
  },

  // ============================================
  // CATERING / PRIVATE CHEF
  // ============================================
  'catering': {
    en: {
      title: 'Private Chef Ibiza | Catering Services | In-Villa Dining | The Key Ibiza',
      description: 'Private chef and catering services in Ibiza. Michelin-star chefs, in-villa dining, event catering, personal chef hire. Culinary excellence delivered.',
      keywords: ['private chef ibiza', 'catering ibiza', 'in-villa chef ibiza', 'personal chef ibiza', 'michelin chef ibiza', 'event catering ibiza', 'private dining ibiza', 'chef at home ibiza'],
      h1: 'Private Chef & Catering in Ibiza',
      h2: 'Michelin-Quality Dining in Your Villa'
    },
    fr: {
      title: 'Chef Privé Ibiza | Traiteur | Dîner à Domicile | The Key Ibiza',
      description: 'Services de chef privé et traiteur à Ibiza. Chefs étoilés Michelin, dîner à domicile, traiteur événementiel. L\'excellence culinaire à votre villa.',
      keywords: ['chef privé ibiza', 'traiteur ibiza', 'chef à domicile ibiza', 'chef personnel ibiza', 'chef michelin ibiza', 'traiteur événement ibiza', 'dîner privé ibiza', 'cuisinier privé ibiza'],
      h1: 'Chef Privé & Traiteur à Ibiza',
      h2: 'Cuisine Étoilée dans Votre Villa'
    },
    es: {
      title: 'Chef Privado Ibiza | Catering | Cena a Domicilio | The Key Ibiza',
      description: 'Servicios de chef privado y catering en Ibiza. Chefs con estrella Michelin, cena a domicilio, catering para eventos. Excelencia culinaria.',
      keywords: ['chef privado ibiza', 'catering ibiza', 'chef a domicilio ibiza', 'chef personal ibiza', 'chef michelin ibiza', 'catering eventos ibiza', 'cena privada ibiza'],
      h1: 'Chef Privado & Catering en Ibiza',
      h2: 'Cocina con Estrella Michelin en su Villa'
    },
    de: {
      title: 'Privatkoch Ibiza | Catering Service | Dinner in der Villa | The Key Ibiza',
      description: 'Privatkoch und Catering-Services auf Ibiza. Michelin-Sterneköche, Dinner in der Villa, Event-Catering. Kulinarische Exzellenz.',
      keywords: ['privatkoch ibiza', 'catering ibiza', 'koch in villa ibiza', 'persönlicher koch ibiza', 'michelin koch ibiza', 'event catering ibiza', 'private dining ibiza'],
      h1: 'Privatkoch & Catering auf Ibiza',
      h2: 'Michelin-Qualität in Ihrer Villa'
    }
  },

  // ============================================
  // FURNITURE / INTERIOR
  // ============================================
  'furniture': {
    en: {
      title: 'Luxury Furniture Rental Ibiza | Event Furniture | Interior Design | The Key Ibiza',
      description: 'Premium furniture rental and interior styling in Ibiza. Event furniture, villa staging, luxury decor for parties and photoshoots.',
      keywords: ['furniture rental ibiza', 'event furniture ibiza', 'interior design ibiza', 'villa staging ibiza', 'luxury decor ibiza', 'party furniture ibiza', 'photoshoot props ibiza'],
      h1: 'Luxury Furniture Rental in Ibiza',
      h2: 'Event Furniture & Interior Styling'
    },
    fr: {
      title: 'Location Mobilier Luxe Ibiza | Mobilier Événement | Décoration | The Key Ibiza',
      description: 'Location de mobilier premium et décoration intérieure à Ibiza. Mobilier événementiel, mise en scène villa, décor luxe pour fêtes et shootings.',
      keywords: ['location mobilier ibiza', 'mobilier événement ibiza', 'décoration intérieure ibiza', 'mise en scène villa ibiza', 'décor luxe ibiza', 'mobilier fête ibiza'],
      h1: 'Location de Mobilier de Luxe à Ibiza',
      h2: 'Mobilier Événementiel & Décoration'
    },
    es: {
      title: 'Alquiler Mobiliario Lujo Ibiza | Mobiliario Eventos | Decoración | The Key Ibiza',
      description: 'Alquiler de mobiliario premium y decoración de interiores en Ibiza. Mobiliario para eventos, puesta en escena de villas, decoración de lujo.',
      keywords: ['alquiler mobiliario ibiza', 'mobiliario eventos ibiza', 'decoración interiores ibiza', 'puesta en escena villa ibiza', 'decoración lujo ibiza'],
      h1: 'Alquiler de Mobiliario de Lujo en Ibiza',
      h2: 'Mobiliario para Eventos & Decoración'
    },
    de: {
      title: 'Luxus Möbelverleih Ibiza | Event Möbel | Inneneinrichtung | The Key Ibiza',
      description: 'Premium Möbelverleih und Inneneinrichtung auf Ibiza. Event-Möbel, Villa-Staging, Luxus-Dekor für Partys und Fotoshootings.',
      keywords: ['möbelverleih ibiza', 'event möbel ibiza', 'inneneinrichtung ibiza', 'villa staging ibiza', 'luxus dekor ibiza'],
      h1: 'Luxus Möbelverleih auf Ibiza',
      h2: 'Event-Möbel & Inneneinrichtung'
    }
  },

  // ============================================
  // HEALTH / MEDICAL
  // ============================================
  'health': {
    en: {
      title: 'Private Doctor Ibiza | Medical Services | House Calls | The Key Ibiza',
      description: 'Private medical services in Ibiza. House calls, private doctors, emergency medical care, IV therapy, health concierge for VIP clients.',
      keywords: ['private doctor ibiza', 'medical services ibiza', 'house call doctor ibiza', 'iv therapy ibiza', 'emergency doctor ibiza', 'health concierge ibiza', 'private healthcare ibiza'],
      h1: 'Private Medical Services in Ibiza',
      h2: 'Doctors & Healthcare at Your Villa'
    },
    fr: {
      title: 'Médecin Privé Ibiza | Services Médicaux | Visite à Domicile | The Key Ibiza',
      description: 'Services médicaux privés à Ibiza. Visites à domicile, médecins privés, soins d\'urgence, thérapie IV, conciergerie santé pour clients VIP.',
      keywords: ['médecin privé ibiza', 'services médicaux ibiza', 'médecin à domicile ibiza', 'thérapie iv ibiza', 'médecin urgence ibiza', 'conciergerie santé ibiza'],
      h1: 'Services Médicaux Privés à Ibiza',
      h2: 'Médecins & Soins de Santé à Votre Villa'
    },
    es: {
      title: 'Médico Privado Ibiza | Servicios Médicos | Visita a Domicilio | The Key Ibiza',
      description: 'Servicios médicos privados en Ibiza. Visitas a domicilio, médicos privados, atención médica de emergencia, terapia IV, conserjería de salud.',
      keywords: ['médico privado ibiza', 'servicios médicos ibiza', 'médico a domicilio ibiza', 'terapia iv ibiza', 'médico urgencias ibiza', 'conserjería salud ibiza'],
      h1: 'Servicios Médicos Privados en Ibiza',
      h2: 'Médicos & Atención Sanitaria en su Villa'
    },
    de: {
      title: 'Privatarzt Ibiza | Medizinische Dienste | Hausbesuche | The Key Ibiza',
      description: 'Private medizinische Dienste auf Ibiza. Hausbesuche, Privatärzte, Notfallversorgung, IV-Therapie, Gesundheits-Concierge.',
      keywords: ['privatarzt ibiza', 'medizinische dienste ibiza', 'arzt hausbesuch ibiza', 'iv therapie ibiza', 'notarzt ibiza', 'gesundheits concierge ibiza'],
      h1: 'Private Medizinische Dienste auf Ibiza',
      h2: 'Ärzte & Gesundheitsversorgung in Ihrer Villa'
    }
  },

  // ============================================
  // YOGA / FITNESS
  // ============================================
  'yoga': {
    en: {
      title: 'Private Yoga Ibiza | Personal Trainer | Fitness | The Key Ibiza',
      description: 'Private yoga and fitness services in Ibiza. In-villa yoga sessions, personal trainers, sunrise yoga, beach fitness, wellness retreats.',
      keywords: ['private yoga ibiza', 'yoga instructor ibiza', 'personal trainer ibiza', 'in-villa yoga ibiza', 'sunrise yoga ibiza', 'beach yoga ibiza', 'fitness ibiza', 'wellness retreat ibiza'],
      h1: 'Private Yoga & Fitness in Ibiza',
      h2: 'Personal Training at Your Villa'
    },
    fr: {
      title: 'Yoga Privé Ibiza | Coach Personnel | Fitness | The Key Ibiza',
      description: 'Services de yoga et fitness privés à Ibiza. Séances de yoga à domicile, coachs personnels, yoga au lever du soleil, fitness sur la plage.',
      keywords: ['yoga privé ibiza', 'professeur yoga ibiza', 'coach personnel ibiza', 'yoga à domicile ibiza', 'yoga lever soleil ibiza', 'yoga plage ibiza', 'fitness ibiza', 'retraite bien-être ibiza'],
      h1: 'Yoga & Fitness Privé à Ibiza',
      h2: 'Coaching Personnel à Votre Villa'
    },
    es: {
      title: 'Yoga Privado Ibiza | Entrenador Personal | Fitness | The Key Ibiza',
      description: 'Servicios de yoga y fitness privados en Ibiza. Sesiones de yoga en villa, entrenadores personales, yoga al amanecer, fitness en la playa.',
      keywords: ['yoga privado ibiza', 'profesor yoga ibiza', 'entrenador personal ibiza', 'yoga en villa ibiza', 'yoga amanecer ibiza', 'yoga playa ibiza', 'fitness ibiza'],
      h1: 'Yoga & Fitness Privado en Ibiza',
      h2: 'Entrenamiento Personal en su Villa'
    },
    de: {
      title: 'Private Yoga Ibiza | Personal Trainer | Fitness | The Key Ibiza',
      description: 'Private Yoga- und Fitness-Services auf Ibiza. Yoga in der Villa, Personal Trainer, Sonnenaufgangs-Yoga, Strand-Fitness.',
      keywords: ['private yoga ibiza', 'yoga lehrer ibiza', 'personal trainer ibiza', 'yoga in villa ibiza', 'sonnenaufgang yoga ibiza', 'strand yoga ibiza', 'fitness ibiza'],
      h1: 'Private Yoga & Fitness auf Ibiza',
      h2: 'Personal Training in Ihrer Villa'
    }
  },

  // ============================================
  // CLEANING
  // ============================================
  'cleaning': {
    en: {
      title: 'Villa Cleaning Ibiza | Housekeeping | Maid Service | The Key Ibiza',
      description: 'Professional villa cleaning and housekeeping in Ibiza. Daily maid service, deep cleaning, laundry, turnover cleaning for rental properties.',
      keywords: ['villa cleaning ibiza', 'housekeeping ibiza', 'maid service ibiza', 'deep cleaning ibiza', 'laundry service ibiza', 'rental cleaning ibiza', 'housekeeper ibiza'],
      h1: 'Villa Cleaning Services in Ibiza',
      h2: 'Professional Housekeeping & Maid Service'
    },
    fr: {
      title: 'Ménage Villa Ibiza | Femme de Ménage | Service Nettoyage | The Key Ibiza',
      description: 'Services de ménage professionnel pour villas à Ibiza. Service quotidien, nettoyage en profondeur, blanchisserie, ménage pour locations.',
      keywords: ['ménage villa ibiza', 'femme de ménage ibiza', 'service nettoyage ibiza', 'nettoyage profondeur ibiza', 'blanchisserie ibiza', 'ménage location ibiza'],
      h1: 'Services de Ménage pour Villas à Ibiza',
      h2: 'Ménage Professionnel & Service de Maison'
    },
    es: {
      title: 'Limpieza Villa Ibiza | Servicio Doméstico | Limpieza | The Key Ibiza',
      description: 'Servicios de limpieza profesional para villas en Ibiza. Servicio diario, limpieza profunda, lavandería, limpieza para alquileres.',
      keywords: ['limpieza villa ibiza', 'servicio doméstico ibiza', 'asistenta ibiza', 'limpieza profunda ibiza', 'lavandería ibiza', 'limpieza alquiler ibiza'],
      h1: 'Servicios de Limpieza para Villas en Ibiza',
      h2: 'Limpieza Profesional & Servicio Doméstico'
    },
    de: {
      title: 'Villa Reinigung Ibiza | Haushaltshilfe | Reinigungsservice | The Key Ibiza',
      description: 'Professionelle Villenreinigung und Haushaltshilfe auf Ibiza. Täglicher Service, Tiefenreinigung, Wäscheservice.',
      keywords: ['villa reinigung ibiza', 'haushaltshilfe ibiza', 'reinigungsservice ibiza', 'tiefenreinigung ibiza', 'wäscheservice ibiza'],
      h1: 'Villa Reinigungsservice auf Ibiza',
      h2: 'Professionelle Haushaltshilfe'
    }
  },

  // ============================================
  // DRIVER / CHAUFFEUR
  // ============================================
  'driver': {
    en: {
      title: 'Private Chauffeur Ibiza | VIP Driver | Airport Transfer | The Key Ibiza',
      description: 'Private chauffeur and driver services in Ibiza. Airport transfers, VIP transportation, luxury car rental with driver, 24/7 availability.',
      keywords: ['private chauffeur ibiza', 'driver ibiza', 'airport transfer ibiza', 'vip transport ibiza', 'car with driver ibiza', 'luxury transfer ibiza', 'private driver ibiza'],
      h1: 'Private Chauffeur Services in Ibiza',
      h2: 'VIP Transportation & Airport Transfers'
    },
    fr: {
      title: 'Chauffeur Privé Ibiza | Transfert Aéroport | Transport VIP | The Key Ibiza',
      description: 'Services de chauffeur privé à Ibiza. Transferts aéroport, transport VIP, location de voiture avec chauffeur, disponibilité 24h/24.',
      keywords: ['chauffeur privé ibiza', 'driver ibiza', 'transfert aéroport ibiza', 'transport vip ibiza', 'voiture avec chauffeur ibiza', 'transfert luxe ibiza'],
      h1: 'Services de Chauffeur Privé à Ibiza',
      h2: 'Transport VIP & Transferts Aéroport'
    },
    es: {
      title: 'Chófer Privado Ibiza | Transfer Aeropuerto | Transporte VIP | The Key Ibiza',
      description: 'Servicios de chófer privado en Ibiza. Transfers aeropuerto, transporte VIP, alquiler de coche con conductor, disponibilidad 24/7.',
      keywords: ['chófer privado ibiza', 'conductor ibiza', 'transfer aeropuerto ibiza', 'transporte vip ibiza', 'coche con conductor ibiza', 'transfer lujo ibiza'],
      h1: 'Servicios de Chófer Privado en Ibiza',
      h2: 'Transporte VIP & Transfers Aeropuerto'
    },
    de: {
      title: 'Privater Chauffeur Ibiza | Flughafentransfer | VIP Transport | The Key Ibiza',
      description: 'Private Chauffeur- und Fahrdienste auf Ibiza. Flughafentransfers, VIP-Transport, Mietwagen mit Fahrer, 24/7 Verfügbarkeit.',
      keywords: ['privater chauffeur ibiza', 'fahrer ibiza', 'flughafentransfer ibiza', 'vip transport ibiza', 'auto mit fahrer ibiza', 'luxus transfer ibiza'],
      h1: 'Private Chauffeur-Dienste auf Ibiza',
      h2: 'VIP Transport & Flughafentransfers'
    }
  },

  // ============================================
  // BABYSITTING / CHILDCARE
  // ============================================
  'babysitting': {
    en: {
      title: 'Babysitter Ibiza | Nanny Service | Childcare | The Key Ibiza',
      description: 'Professional babysitting and nanny services in Ibiza. Experienced childcare, multilingual nannies, day and night care for your holiday.',
      keywords: ['babysitter ibiza', 'nanny ibiza', 'childcare ibiza', 'babysitting service ibiza', 'nanny service ibiza', 'child minder ibiza', 'holiday childcare ibiza'],
      h1: 'Babysitting & Nanny Services in Ibiza',
      h2: 'Professional Childcare for Your Holiday'
    },
    fr: {
      title: 'Baby-sitter Ibiza | Service Nounou | Garde Enfants | The Key Ibiza',
      description: 'Services de baby-sitting et nounou professionnels à Ibiza. Garde d\'enfants expérimentée, nounous multilingues, garde jour et nuit.',
      keywords: ['baby-sitter ibiza', 'nounou ibiza', 'garde enfants ibiza', 'service baby-sitting ibiza', 'nanny ibiza', 'garde enfant vacances ibiza'],
      h1: 'Services Baby-sitting & Nounou à Ibiza',
      h2: 'Garde d\'Enfants Professionnelle pour vos Vacances'
    },
    es: {
      title: 'Canguro Ibiza | Servicio Niñera | Cuidado Niños | The Key Ibiza',
      description: 'Servicios profesionales de canguro y niñera en Ibiza. Cuidado infantil experimentado, niñeras multilingües, cuidado día y noche.',
      keywords: ['canguro ibiza', 'niñera ibiza', 'cuidado niños ibiza', 'servicio canguro ibiza', 'nanny ibiza', 'cuidado infantil vacaciones ibiza'],
      h1: 'Servicios de Canguro & Niñera en Ibiza',
      h2: 'Cuidado Infantil Profesional para sus Vacaciones'
    },
    de: {
      title: 'Babysitter Ibiza | Kinderbetreuung | Nanny Service | The Key Ibiza',
      description: 'Professionelle Babysitter- und Nanny-Services auf Ibiza. Erfahrene Kinderbetreuung, mehrsprachige Nannies, Tag- und Nachtbetreuung.',
      keywords: ['babysitter ibiza', 'nanny ibiza', 'kinderbetreuung ibiza', 'babysitter service ibiza', 'kindermädchen ibiza', 'urlaub kinderbetreuung ibiza'],
      h1: 'Babysitter & Nanny Services auf Ibiza',
      h2: 'Professionelle Kinderbetreuung für Ihren Urlaub'
    }
  },

  // ============================================
  // MAIN PAGES
  // ============================================
  'home': {
    en: {
      title: 'The Key Ibiza | Luxury Concierge & Villa Rentals | Ibiza',
      description: 'Discover 50+ luxury villas, yacht charters, and 24/7 concierge services in Ibiza. Book your dream holiday today.',
      keywords: ['the key ibiza', 'ibiza concierge', 'luxury ibiza', 'ibiza villa rental', 'ibiza yacht charter', 'ibiza luxury services', 'vip ibiza', 'ibiza experiences'],
      h1: 'The Key Ibiza',
      h2: 'Luxury Concierge & Villa Rentals'
    },
    fr: {
      title: 'The Key Ibiza | Conciergerie de Luxe & Location de Villas | Ibiza',
      description: 'Découvrez 50+ villas de luxe, yachts et services de conciergerie sur mesure à Ibiza. Réservez votre séjour de rêve.',
      keywords: ['the key ibiza', 'conciergerie ibiza', 'luxe ibiza', 'location villa ibiza', 'location yacht ibiza', 'services luxe ibiza', 'vip ibiza', 'expériences ibiza'],
      h1: 'The Key Ibiza',
      h2: 'Conciergerie de Luxe & Location de Villas'
    },
    es: {
      title: 'The Key Ibiza | Conserjería de Lujo & Alquiler de Villas | Ibiza',
      description: 'Descubre 50+ villas de lujo, yates y servicios de conserjería a medida en Ibiza. Reserva tu estancia de ensueño.',
      keywords: ['the key ibiza', 'conserjería ibiza', 'lujo ibiza', 'alquiler villa ibiza', 'alquiler yate ibiza', 'servicios lujo ibiza', 'vip ibiza', 'experiencias ibiza'],
      h1: 'The Key Ibiza',
      h2: 'Conserjería de Lujo & Alquiler de Villas'
    },
    de: {
      title: 'The Key Ibiza | Luxus Concierge & Villen Vermietung | Ibiza',
      description: 'Entdecken Sie 50+ Luxusvillen, Yachtcharter und 24/7 Concierge-Services auf Ibiza. Buchen Sie Ihren Traumurlaub.',
      keywords: ['the key ibiza', 'concierge ibiza', 'luxus ibiza', 'villa mieten ibiza', 'yacht mieten ibiza', 'luxus services ibiza', 'vip ibiza', 'erlebnisse ibiza'],
      h1: 'The Key Ibiza',
      h2: 'Luxus Concierge & Villen Vermietung'
    }
  },

  'about': {
    en: {
      title: 'About Us | The Key Ibiza | Luxury Concierge Team',
      description: 'Meet the team behind The Key Ibiza. 15+ years of local expertise in luxury villas and concierge services. Let us plan your trip.',
      keywords: ['about the key ibiza', 'ibiza concierge team', 'luxury ibiza experts', 'ibiza local experts', 'villa rental experts ibiza', 'who is the key ibiza'],
      h1: 'About The Key Ibiza',
      h2: 'Your Local Luxury Experts'
    },
    fr: {
      title: 'À Propos | The Key Ibiza | Équipe de Conciergerie de Luxe',
      description: 'Découvrez l\'équipe The Key Ibiza. 15+ ans d\'expertise locale en villas de luxe et conciergerie. Planifions votre séjour.',
      keywords: ['à propos the key ibiza', 'équipe conciergerie ibiza', 'experts luxe ibiza', 'experts locaux ibiza', 'spécialistes villa ibiza'],
      h1: 'À Propos de The Key Ibiza',
      h2: 'Vos Experts Locaux du Luxe'
    },
    es: {
      title: 'Sobre Nosotros | The Key Ibiza | Equipo de Conserjería de Lujo',
      description: 'Conoce al equipo de The Key Ibiza. 15+ años de experiencia local en villas de lujo y conserjería. Planifiquemos tu viaje.',
      keywords: ['sobre the key ibiza', 'equipo conserjería ibiza', 'expertos lujo ibiza', 'expertos locales ibiza', 'especialistas villa ibiza'],
      h1: 'Sobre The Key Ibiza',
      h2: 'Tus Expertos Locales en Lujo'
    },
    de: {
      title: 'Über Uns | The Key Ibiza | Luxus Concierge Team',
      description: 'Das Team von The Key Ibiza. Über 15 Jahre lokale Expertise in Luxusvillen und Concierge-Services. Planen Sie mit uns.',
      keywords: ['über the key ibiza', 'concierge team ibiza', 'luxus experten ibiza', 'lokale experten ibiza', 'villa spezialisten ibiza'],
      h1: 'Über The Key Ibiza',
      h2: 'Ihre Lokalen Luxus-Experten'
    }
  },

  'contact': {
    en: {
      title: 'Contact Us | The Key Ibiza | Get in Touch',
      description: 'Contact The Key Ibiza for luxury villas, yacht charters, and concierge services. WhatsApp, email, or call – response within 24h.',
      keywords: ['contact the key ibiza', 'ibiza concierge contact', 'book villa ibiza', 'ibiza inquiry', 'the key ibiza phone', 'the key ibiza email', 'ibiza villa booking'],
      h1: 'Contact The Key Ibiza',
      h2: 'We\'re Here to Help'
    },
    fr: {
      title: 'Contactez-Nous | The Key Ibiza | Nous Contacter',
      description: 'Contactez The Key Ibiza pour villas de luxe, yachts et conciergerie. WhatsApp, email ou appelez-nous – réponse sous 24h.',
      keywords: ['contact the key ibiza', 'conciergerie ibiza contact', 'réserver villa ibiza', 'demande ibiza', 'téléphone the key ibiza', 'email the key ibiza'],
      h1: 'Contactez The Key Ibiza',
      h2: 'Nous Sommes à Votre Écoute'
    },
    es: {
      title: 'Contáctanos | The Key Ibiza | Ponte en Contacto',
      description: 'Contacta con The Key Ibiza para villas de lujo, yates y conserjería. WhatsApp, email o llámanos – respuesta en 24h.',
      keywords: ['contacto the key ibiza', 'conserjería ibiza contacto', 'reservar villa ibiza', 'consulta ibiza', 'teléfono the key ibiza', 'email the key ibiza'],
      h1: 'Contacta con The Key Ibiza',
      h2: 'Estamos Aquí para Ayudarte'
    },
    de: {
      title: 'Kontakt | The Key Ibiza | Kontaktieren Sie Uns',
      description: 'Kontaktieren Sie The Key Ibiza für Luxusvillen, Yachtcharter und Concierge-Services. WhatsApp, E-Mail oder Anruf – Antwort in 24h.',
      keywords: ['kontakt the key ibiza', 'concierge ibiza kontakt', 'villa buchen ibiza', 'anfrage ibiza', 'telefon the key ibiza', 'email the key ibiza'],
      h1: 'Kontaktieren Sie The Key Ibiza',
      h2: 'Wir Sind für Sie Da'
    }
  },

  'blog': {
    en: {
      title: 'Blog | The Key Ibiza | Ibiza Lifestyle & Travel Tips',
      description: 'Insider tips, best restaurants, hidden beaches, and nightlife guides for Ibiza. Explore the blog and plan your perfect trip.',
      keywords: ['ibiza blog', 'ibiza travel tips', 'ibiza insider guide', 'best restaurants ibiza', 'ibiza beaches', 'ibiza nightlife guide', 'ibiza lifestyle', 'things to do ibiza'],
      h1: 'The Key Ibiza Blog',
      h2: 'Ibiza Lifestyle & Insider Tips'
    },
    fr: {
      title: 'Blog | The Key Ibiza | Lifestyle Ibiza & Conseils Voyage',
      description: 'Conseils d\'initiés, meilleurs restaurants, plages secrètes et guides vie nocturne à Ibiza. Explorez le blog et planifiez votre séjour.',
      keywords: ['blog ibiza', 'conseils voyage ibiza', 'guide initié ibiza', 'meilleurs restaurants ibiza', 'plages ibiza', 'guide vie nocturne ibiza', 'lifestyle ibiza'],
      h1: 'Blog The Key Ibiza',
      h2: 'Lifestyle Ibiza & Conseils d\'Initiés'
    },
    es: {
      title: 'Blog | The Key Ibiza | Lifestyle Ibiza & Consejos de Viaje',
      description: 'Consejos de expertos, mejores restaurantes, playas secretas y guías de vida nocturna en Ibiza. Explora el blog y planifica tu viaje.',
      keywords: ['blog ibiza', 'consejos viaje ibiza', 'guía insider ibiza', 'mejores restaurantes ibiza', 'playas ibiza', 'guía vida nocturna ibiza', 'lifestyle ibiza'],
      h1: 'Blog The Key Ibiza',
      h2: 'Lifestyle Ibiza & Consejos de Expertos'
    },
    de: {
      title: 'Blog | The Key Ibiza | Ibiza Lifestyle & Reisetipps',
      description: 'Insider-Tipps, beste Restaurants, versteckte Strände und Nachtleben-Guides für Ibiza. Erkunden Sie den Blog und planen Sie Ihre Reise.',
      keywords: ['ibiza blog', 'ibiza reisetipps', 'ibiza insider guide', 'beste restaurants ibiza', 'strände ibiza', 'nachtleben guide ibiza', 'lifestyle ibiza'],
      h1: 'The Key Ibiza Blog',
      h2: 'Ibiza Lifestyle & Insider-Tipps'
    }
  },

  'services': {
    en: {
      title: 'Luxury Concierge Services Ibiza | The Key Ibiza',
      description: 'Full-service luxury concierge in Ibiza: private chef, yacht charter, events, wellness, security. Available 24/7. Request a quote.',
      keywords: ['concierge services ibiza', 'luxury services ibiza', 'private chef ibiza', 'ibiza vip services', 'personal assistant ibiza', '24/7 concierge ibiza', 'ibiza lifestyle services'],
      h1: 'Luxury Concierge Services',
      h2: '24/7 Bespoke Services for Your Perfect Stay'
    },
    fr: {
      title: 'Services de Conciergerie de Luxe Ibiza | The Key Ibiza',
      description: 'Conciergerie de luxe à Ibiza: chef privé, yacht, événements, bien-être, sécurité. Disponible 24/7. Demandez un devis.',
      keywords: ['services conciergerie ibiza', 'services luxe ibiza', 'chef privé ibiza', 'services vip ibiza', 'assistant personnel ibiza', 'conciergerie 24/7 ibiza'],
      h1: 'Services de Conciergerie de Luxe',
      h2: 'Services Sur Mesure 24/7 pour un Séjour Parfait'
    },
    es: {
      title: 'Servicios de Conserjería de Lujo Ibiza | The Key Ibiza',
      description: 'Conserjería de lujo en Ibiza: chef privado, yate, eventos, bienestar, seguridad. Disponible 24/7. Solicita presupuesto.',
      keywords: ['servicios conserjería ibiza', 'servicios lujo ibiza', 'chef privado ibiza', 'servicios vip ibiza', 'asistente personal ibiza', 'conserjería 24/7 ibiza'],
      h1: 'Servicios de Conserjería de Lujo',
      h2: 'Servicios a Medida 24/7 para una Estancia Perfecta'
    },
    de: {
      title: 'Luxus Concierge Services Ibiza | The Key Ibiza',
      description: 'Luxus-Concierge auf Ibiza: Privatkoch, Yachtcharter, Events, Wellness, Sicherheit. 24/7 verfügbar. Angebot anfordern.',
      keywords: ['concierge services ibiza', 'luxus services ibiza', 'privatkoch ibiza', 'vip services ibiza', 'persönlicher assistent ibiza', '24/7 concierge ibiza'],
      h1: 'Luxus Concierge Services',
      h2: 'Maßgeschneiderte Services 24/7 für Ihren Perfekten Aufenthalt'
    }
  }
};

/**
 * Get SEO config for a specific page and language
 */
export function getSEO(page: string, lang: Language): ServiceSEO | null {
  const pageConfig = seoConfig[page];
  if (!pageConfig) return null;

  // Fallback to English if language not available
  return pageConfig[lang as keyof PageSEO] || pageConfig.en;
}

/**
 * Get all keywords for a language (for sitemap/robots)
 */
export function getAllKeywords(lang: Language): string[] {
  const allKeywords: string[] = [];

  Object.values(seoConfig).forEach(pageConfig => {
    const langConfig = pageConfig[lang as keyof PageSEO] || pageConfig.en;
    allKeywords.push(...langConfig.keywords);
  });

  return [...new Set(allKeywords)]; // Remove duplicates
}
