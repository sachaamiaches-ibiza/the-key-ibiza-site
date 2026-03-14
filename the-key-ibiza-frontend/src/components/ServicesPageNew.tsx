
import React, { useMemo, useEffect } from 'react';
import { Language } from '../types';
import FooterSEO from './FooterSEO';
import { allServicesGrid } from './ServiceIcons';

// FAQ content for Services page (multi-language)
const servicesFAQ: Record<Language, { question: string; answer: string }[]> = {
  en: [
    {
      question: "What concierge services does The Key Ibiza offer?",
      answer: "The Key Ibiza offers a comprehensive range of luxury concierge services including private chef and catering, yacht charter, event planning, wellness and spa, security services, professional drivers, villa cleaning, babysitting, and 24/7 personal assistance."
    },
    {
      question: "Are your concierge services available 24/7?",
      answer: "Yes, our concierge team is available around the clock, 365 days a year. Whether you need a last-minute restaurant reservation at 2 AM or an emergency service, we're always here to assist you."
    },
    {
      question: "How do I book a private chef in Ibiza?",
      answer: "Booking a private chef is simple. Contact us with your preferred dates, number of guests, dietary requirements, and cuisine preferences. We'll match you with a chef from our network of Michelin-starred and experienced culinary professionals."
    },
    {
      question: "Do you provide security services for VIP clients?",
      answer: "Absolutely. We offer discreet, professional security services including personal bodyguards, property security, and event security. Our team consists of trained professionals with experience in VIP protection."
    },
    {
      question: "How far in advance should I book concierge services?",
      answer: "We recommend booking at least 2-4 weeks in advance for peak season (June-September). However, we specialize in last-minute requests and will always do our best to accommodate your needs, even with short notice."
    }
  ],
  fr: [
    {
      question: "Quels services de conciergerie The Key Ibiza propose-t-il ?",
      answer: "The Key Ibiza propose une gamme complète de services de conciergerie de luxe : chef privé et traiteur, location de yacht, organisation d'événements, bien-être et spa, sécurité, chauffeurs professionnels, ménage, baby-sitting et assistance personnelle 24h/24."
    },
    {
      question: "Vos services de conciergerie sont-ils disponibles 24h/24 ?",
      answer: "Oui, notre équipe de conciergerie est disponible 24h/24, 365 jours par an. Que vous ayez besoin d'une réservation de restaurant à 2h du matin ou d'un service d'urgence, nous sommes toujours là pour vous aider."
    },
    {
      question: "Comment réserver un chef privé à Ibiza ?",
      answer: "Réserver un chef privé est simple. Contactez-nous avec vos dates, le nombre de convives, vos exigences alimentaires et vos préférences culinaires. Nous vous mettrons en relation avec un chef de notre réseau de professionnels étoilés Michelin."
    },
    {
      question: "Proposez-vous des services de sécurité pour les clients VIP ?",
      answer: "Absolument. Nous proposons des services de sécurité discrets et professionnels : gardes du corps personnels, sécurité de propriété et sécurité événementielle. Notre équipe est composée de professionnels formés à la protection VIP."
    },
    {
      question: "Combien de temps à l'avance dois-je réserver les services ?",
      answer: "Nous recommandons de réserver 2 à 4 semaines à l'avance en haute saison (juin-septembre). Cependant, nous sommes spécialisés dans les demandes de dernière minute et ferons toujours notre possible pour répondre à vos besoins."
    }
  ],
  es: [
    {
      question: "¿Qué servicios de conserjería ofrece The Key Ibiza?",
      answer: "The Key Ibiza ofrece una gama completa de servicios de conserjería de lujo: chef privado y catering, alquiler de yates, organización de eventos, bienestar y spa, seguridad, conductores profesionales, limpieza, niñera y asistencia personal 24/7."
    },
    {
      question: "¿Sus servicios de conserjería están disponibles 24/7?",
      answer: "Sí, nuestro equipo de conserjería está disponible las 24 horas, los 365 días del año. Ya sea que necesite una reserva de restaurante a las 2 AM o un servicio de emergencia, siempre estamos aquí para ayudarle."
    },
    {
      question: "¿Cómo reservo un chef privado en Ibiza?",
      answer: "Reservar un chef privado es sencillo. Contáctenos con sus fechas preferidas, número de invitados, requisitos dietéticos y preferencias culinarias. Le pondremos en contacto con un chef de nuestra red de profesionales con estrellas Michelin."
    },
    {
      question: "¿Ofrecen servicios de seguridad para clientes VIP?",
      answer: "Por supuesto. Ofrecemos servicios de seguridad discretos y profesionales: guardaespaldas personales, seguridad de propiedades y seguridad de eventos. Nuestro equipo está formado por profesionales capacitados en protección VIP."
    },
    {
      question: "¿Con cuánta antelación debo reservar los servicios?",
      answer: "Recomendamos reservar con 2-4 semanas de antelación en temporada alta (junio-septiembre). Sin embargo, nos especializamos en solicitudes de último momento y siempre haremos lo posible por satisfacer sus necesidades."
    }
  ],
  de: [
    {
      question: "Welche Concierge-Services bietet The Key Ibiza an?",
      answer: "The Key Ibiza bietet eine umfassende Palette von Luxus-Concierge-Services: Privatkoch und Catering, Yachtcharter, Eventplanung, Wellness und Spa, Sicherheit, professionelle Fahrer, Reinigung, Kinderbetreuung und 24/7 persönliche Assistenz."
    },
    {
      question: "Sind Ihre Concierge-Services rund um die Uhr verfügbar?",
      answer: "Ja, unser Concierge-Team ist rund um die Uhr, 365 Tage im Jahr verfügbar. Ob Sie um 2 Uhr morgens eine Restaurantreservierung oder einen Notfalldienst benötigen, wir sind immer für Sie da."
    },
    {
      question: "Wie buche ich einen Privatkoch auf Ibiza?",
      answer: "Einen Privatkoch zu buchen ist einfach. Kontaktieren Sie uns mit Ihren bevorzugten Daten, Gästezahl, Ernährungsanforderungen und kulinarischen Vorlieben. Wir verbinden Sie mit einem Koch aus unserem Netzwerk von Michelin-Sterneköchen."
    },
    {
      question: "Bieten Sie Sicherheitsdienste für VIP-Kunden an?",
      answer: "Absolut. Wir bieten diskrete, professionelle Sicherheitsdienste: persönliche Bodyguards, Objektschutz und Veranstaltungssicherheit. Unser Team besteht aus ausgebildeten Fachleuten mit VIP-Schutz-Erfahrung."
    },
    {
      question: "Wie weit im Voraus sollte ich Services buchen?",
      answer: "Wir empfehlen, in der Hochsaison (Juni-September) 2-4 Wochen im Voraus zu buchen. Wir sind jedoch auf kurzfristige Anfragen spezialisiert und werden immer unser Bestes tun, um Ihre Wünsche zu erfüllen."
    }
  ]
};

interface ServicesPageNewProps {
  onNavigate: (view: string) => void;
  lang: Language;
}

const serviceDetails = [
  {
    id: 'events',
    title: 'Personalized Events',
    subtitle: 'Unforgettable Moments',
    description: 'From intimate gatherings to grand celebrations, we orchestrate bespoke events that reflect your unique vision. Our team coordinates every detail—exclusive venues, world-class entertainment, gourmet catering, and flawless execution—ensuring your event becomes an unforgettable experience.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'nightlife',
    title: 'Night Life',
    subtitle: 'Exclusive Access',
    description: 'Experience Ibiza\'s legendary nightlife with VIP access to the island\'s most prestigious clubs and venues. From private tables at Pacha to exclusive beach parties, we open doors to the most sought-after experiences in the world\'s party capital.',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'catering',
    title: 'Catering & Bottle Service',
    subtitle: 'Culinary Excellence',
    description: 'Elevate your experience with private chefs, sommelier services, and premium bottle service. From Michelin-starred cuisine in your villa to champagne on your yacht, we curate exceptional gastronomic journeys tailored to your preferences.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'furniture',
    title: 'Furniture',
    subtitle: 'Luxury Furnishings',
    description: 'Transform any space with our premium furniture rental service. From elegant outdoor lounges to sophisticated interior pieces, we provide designer furnishings that complement your lifestyle and enhance your Ibiza residence.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'health',
    title: 'Health & Beauty Program',
    subtitle: 'Wellness & Rejuvenation',
    description: 'Indulge in personalized wellness experiences with world-renowned therapists, beauty specialists, and health practitioners. From in-villa spa treatments to comprehensive detox programs, we design holistic journeys for mind, body, and soul.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'yoga',
    title: 'Yoga & Personal Growth',
    subtitle: 'Inner Harmony',
    description: 'Connect with your inner self through private yoga sessions, meditation retreats, and personal development workshops. Our certified instructors and coaches guide you on transformative journeys in Ibiza\'s most inspiring settings.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'photographer',
    title: 'Professional Photographer',
    subtitle: 'Captured Memories',
    description: 'Preserve your precious moments with our team of professional photographers and videographers. From lifestyle shoots to event coverage, we create stunning visual narratives that immortalize your Ibiza experience.',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'security',
    title: 'Security Services',
    subtitle: 'Discreet Protection',
    description: 'Enjoy complete peace of mind with our professional security services. Our trained personnel provide discreet yet effective protection, ensuring your privacy and safety throughout your stay on the island.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'cleaning',
    title: 'Cleaning Services',
    subtitle: 'Immaculate Standards',
    description: 'Maintain pristine living spaces with our premium housekeeping services. Our professional teams ensure your villa remains immaculate, with attention to every detail and respect for your privacy and schedule.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'driver',
    title: 'Driver Services',
    subtitle: 'Luxury Transportation',
    description: 'Travel in style with our professional chauffeur services. From airport transfers to island exploration, our fleet of luxury vehicles and experienced drivers ensure comfortable, punctual, and sophisticated transportation.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'deliveries',
    title: 'Deliveries',
    subtitle: 'Seamless Logistics',
    description: 'From grocery provisioning to luxury goods, we handle all your delivery needs with efficiency and discretion. Arrive to a fully stocked villa or receive anything you need, anywhere on the island.',
    image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'babysitting',
    title: 'Babysitting',
    subtitle: 'Trusted Childcare',
    description: 'Enjoy your time knowing your children are in excellent hands. Our vetted, professional childcare providers offer engaging activities and attentive care, giving parents the freedom to fully enjoy their Ibiza experience.',
    image: 'https://images.unsplash.com/photo-1587616211892-f743fcca64f9?auto=format&fit=crop&q=80&w=1200',
  },
];

const ServicesPageNew: React.FC<ServicesPageNewProps> = ({ onNavigate, lang }) => {
  // Navigate to service detail page
  const goToService = (serviceId: string) => {
    onNavigate(serviceId === 'photographer' ? 'photographer' : `service-${serviceId}`);
  };

  // Inject FAQ Schema into document head for SEO (captured by pre-renderer)
  // Always use English for SEO schema - Google indexes primarily in English
  useEffect(() => {
    const faqs = servicesFAQ.en;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    // Create and inject script tag
    const scriptId = 'faq-schema-services';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    // Cleanup on unmount
    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [lang]);

  return (
    <div className="pt-40 pb-12" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-6">
            Bespoke Excellence
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none mb-6">
            Our Services
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto">
            Curating extraordinary experiences tailored to your desires
          </p>
        </div>

        {/* Circular Icons Grid */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-6 md:gap-8 max-w-6xl mx-auto mb-24">
          {allServicesGrid.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => goToService(service.id)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110 group-hover:border-luxury-gold/60"
                  style={{
                    border: '1px solid rgba(201,178,124,0.3)',
                    backgroundColor: 'transparent',
                  }}
                >
                  <IconComponent className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                </div>
                <span
                  className="text-center transition-colors duration-300 group-hover:text-[#C9B27C]"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    lineHeight: '1.3',
                  }}
                >
                  {service.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Zig-zag Services */}
        <div className="space-y-20 md:space-y-28 mb-20">
          {serviceDetails.map((service, index) => {
            const iconData = allServicesGrid.find(s => s.id === service.id);
            const IconComponent = iconData?.icon;

            return (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center scroll-mt-32`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden rounded-[32px] group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-[280px] md:h-[400px] object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/60 via-transparent to-transparent"></div>
                  </div>
                </div>

                {/* Content */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    {IconComponent && <IconComponent className="w-10 h-10 md:w-12 md:h-12" />}
                    <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.4em] font-medium">
                      {service.subtitle}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-5 italic">
                    {service.title}
                  </h2>
                  <div className="w-12 h-px bg-luxury-gold/30 mb-5"></div>
                  <p className="text-white/50 text-sm md:text-base font-light leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <button
                    onClick={() => goToService(service.id)}
                    className="px-8 py-3 rounded-full bg-luxury-gold text-luxury-blue border border-luxury-gold text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-luxury-blue hover:text-luxury-gold transition-all duration-500"
                  >
                    Discover More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <FooterSEO
          onNavigate={onNavigate}
          lang={lang}
          title="Premium Concierge Services in Ibiza"
          description="The Key Ibiza delivers an unparalleled suite of luxury concierge services designed to elevate every aspect of your island experience. Our dedicated team of lifestyle managers, available around the clock, ensures that every request—from the simple to the seemingly impossible—is handled with discretion, efficiency, and impeccable attention to detail. We believe that true luxury lies in the freedom to enjoy life's finest moments without concern for logistics or limitations."
          links={[
            { label: "Luxury Villas", view: 'service-villas' },
            { label: "Yacht Charters", view: 'service-yacht' },
            { label: "About Us", view: 'about' },
            { label: "Back to Home", view: 'home' }
          ]}
        />
      </div>
    </div>
  );
};

export default ServicesPageNew;
