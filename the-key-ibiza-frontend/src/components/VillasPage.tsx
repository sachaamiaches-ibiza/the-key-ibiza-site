import React, { useState, useEffect } from 'react';
import { Language, Villa } from '../types';
import FooterSEO from './FooterSEO';
import { fetchVillas } from '../services/villaService';
import { getHeaderImageUrl } from '../utils/cloudinaryUrl';

// FAQ content for Villas page (multi-language)
const villasFAQ: Record<Language, { question: string; answer: string }[]> = {
  en: [
    {
      question: "What is the minimum stay for villa rentals in Ibiza?",
      answer: "During high season (June-September), the minimum stay is typically 7 nights. In low season, we can accommodate shorter stays of 3-5 nights depending on the property. Contact us for specific availability."
    },
    {
      question: "What's included in a luxury villa rental?",
      answer: "Our villa rentals include fully equipped kitchens, linens and towels, daily housekeeping (most properties), WiFi, and 24/7 concierge support. Many villas also include private pools, gardens, and parking. Additional services like private chef, transfers, and grocery provisioning are available upon request."
    },
    {
      question: "Do you offer airport transfers for villa guests?",
      answer: "Yes, we arrange private airport transfers in luxury vehicles. Our drivers meet you at Ibiza Airport and escort you directly to your villa. We also offer VIP services including fast-track through the airport and helicopter transfers."
    },
    {
      question: "Can I book a villa for a wedding or special event?",
      answer: "Selected villas in our portfolio are suitable for events and celebrations. We can help you organize everything from intimate dinners to large celebrations with catering, entertainment, and decoration. Contact us with your event requirements for personalized recommendations."
    },
    {
      question: "Is there a security deposit required for villa rentals?",
      answer: "Yes, most villas require a security deposit ranging from €3,000 to €15,000 depending on the property. This is typically held via credit card authorization and released within 7 days after check-out pending a satisfactory property inspection."
    }
  ],
  fr: [
    {
      question: "Quelle est la durée minimum de location d'une villa à Ibiza ?",
      answer: "En haute saison (juin-septembre), le séjour minimum est généralement de 7 nuits. En basse saison, nous pouvons accommoder des séjours plus courts de 3-5 nuits selon la propriété. Contactez-nous pour la disponibilité spécifique."
    },
    {
      question: "Qu'est-ce qui est inclus dans la location d'une villa de luxe ?",
      answer: "Nos locations incluent cuisines équipées, linge de maison, ménage quotidien (la plupart des propriétés), WiFi et conciergerie 24h/24. Beaucoup de villas incluent aussi piscine privée, jardins et parking. Services additionnels sur demande : chef privé, transferts, approvisionnement."
    },
    {
      question: "Proposez-vous des transferts aéroport pour les clients des villas ?",
      answer: "Oui, nous organisons des transferts privés en véhicules de luxe. Nos chauffeurs vous accueillent à l'aéroport d'Ibiza et vous conduisent directement à votre villa. Nous offrons aussi des services VIP incluant fast-track et transferts en hélicoptère."
    },
    {
      question: "Puis-je réserver une villa pour un mariage ou un événement ?",
      answer: "Certaines villas de notre portfolio sont adaptées aux événements et célébrations. Nous pouvons organiser des dîners intimes aux grandes fêtes avec traiteur, animation et décoration. Contactez-nous avec vos besoins pour des recommandations personnalisées."
    },
    {
      question: "Y a-t-il une caution requise pour la location de villa ?",
      answer: "Oui, la plupart des villas demandent une caution de 3 000 € à 15 000 € selon la propriété. Elle est généralement retenue par autorisation de carte bancaire et libérée sous 7 jours après le départ, après inspection satisfaisante."
    }
  ],
  es: [
    {
      question: "¿Cuál es la estancia mínima para alquilar una villa en Ibiza?",
      answer: "En temporada alta (junio-septiembre), la estancia mínima es típicamente de 7 noches. En temporada baja, podemos acomodar estancias más cortas de 3-5 noches dependiendo de la propiedad. Contáctenos para disponibilidad específica."
    },
    {
      question: "¿Qué está incluido en el alquiler de una villa de lujo?",
      answer: "Nuestros alquileres incluyen cocinas equipadas, ropa de cama y toallas, limpieza diaria (mayoría de propiedades), WiFi y conserjería 24/7. Muchas villas también incluyen piscina privada, jardines y parking. Servicios adicionales disponibles bajo petición."
    },
    {
      question: "¿Ofrecen transfers de aeropuerto para huéspedes de villas?",
      answer: "Sí, organizamos transfers privados en vehículos de lujo. Nuestros conductores le reciben en el Aeropuerto de Ibiza y le llevan directamente a su villa. También ofrecemos servicios VIP incluyendo fast-track y transfers en helicóptero."
    },
    {
      question: "¿Puedo reservar una villa para una boda o evento especial?",
      answer: "Algunas villas de nuestro portfolio son adecuadas para eventos y celebraciones. Podemos ayudarle a organizar desde cenas íntimas hasta grandes celebraciones con catering, entretenimiento y decoración. Contáctenos con sus requisitos."
    },
    {
      question: "¿Se requiere depósito de seguridad para el alquiler de villas?",
      answer: "Sí, la mayoría de las villas requieren un depósito de seguridad de 3.000 € a 15.000 € dependiendo de la propiedad. Se retiene típicamente mediante autorización de tarjeta de crédito y se libera en 7 días tras el check-out."
    }
  ],
  de: [
    {
      question: "Was ist die Mindestaufenthaltsdauer für Villenmieten auf Ibiza?",
      answer: "In der Hochsaison (Juni-September) beträgt der Mindestaufenthalt in der Regel 7 Nächte. In der Nebensaison können wir kürzere Aufenthalte von 3-5 Nächten je nach Objekt anbieten. Kontaktieren Sie uns für spezifische Verfügbarkeit."
    },
    {
      question: "Was ist in einer Luxusvilla-Miete enthalten?",
      answer: "Unsere Villenmieten beinhalten voll ausgestattete Küchen, Bettwäsche und Handtücher, tägliche Reinigung (die meisten Objekte), WiFi und 24/7 Concierge-Support. Viele Villen haben auch Privatpool, Gärten und Parkplatz. Zusätzliche Services auf Anfrage."
    },
    {
      question: "Bieten Sie Flughafentransfers für Villengäste an?",
      answer: "Ja, wir arrangieren private Transfers in Luxusfahrzeugen. Unsere Fahrer empfangen Sie am Flughafen Ibiza und bringen Sie direkt zu Ihrer Villa. Wir bieten auch VIP-Services wie Fast-Track und Helikoptertransfers."
    },
    {
      question: "Kann ich eine Villa für eine Hochzeit oder ein Event buchen?",
      answer: "Ausgewählte Villen in unserem Portfolio eignen sich für Events und Feiern. Wir können alles von intimen Abendessen bis zu großen Feiern mit Catering, Unterhaltung und Dekoration organisieren. Kontaktieren Sie uns mit Ihren Anforderungen."
    },
    {
      question: "Ist eine Kaution für die Villenmiete erforderlich?",
      answer: "Ja, die meisten Villen erfordern eine Kaution von 3.000 € bis 15.000 € je nach Objekt. Diese wird in der Regel per Kreditkartenautorisierung gehalten und innerhalb von 7 Tagen nach dem Check-out freigegeben."
    }
  ]
};

interface VillasPageProps {
  onNavigate: (view: string) => void;
  lang: Language;
}

const VillasPage: React.FC<VillasPageProps> = ({ onNavigate, lang }) => {
  const [villaImages, setVillaImages] = useState<string[]>([]);

  // Inject FAQ Schema into document head for SEO (captured by pre-renderer)
  // Always use English for SEO schema - Google indexes primarily in English
  useEffect(() => {
    const faqs = villasFAQ.en;
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
    const scriptId = 'faq-schema-villas';
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

  // Fetch villas to get real images with Cloudinary optimization
  useEffect(() => {
    fetchVillas().then(villas => {
      // Get images from different villas for variety
      const images: string[] = [];
      for (let i = 0; i < Math.min(3, villas.length); i++) {
        const villa = villas[i * 10] || villas[i]; // Spread out selection for variety
        if (villa?.imageUrl) {
          images.push(getHeaderImageUrl(villa.imageUrl));
        }
      }
      if (images.length >= 3) {
        setVillaImages(images);
      }
    });
  }, []);

  const sections = [
    {
      id: 'holiday',
      title: lang === 'es' ? 'Alquiler Vacacional' : lang === 'fr' ? 'Location Saisonnière' : 'Holiday Rentals',
      subtitle: lang === 'es' ? 'Escapadas de Lujo' : lang === 'fr' ? 'Escapades de Luxe' : 'Luxury Escapes',
      description: lang === 'es'
        ? 'Descubra nuestra colección exclusiva de villas de lujo para alquiler vacacional en Ibiza. Cada propiedad ha sido cuidadosamente seleccionada para ofrecer una experiencia única, combinando ubicaciones privilegiadas, diseño arquitectónico excepcional y servicios de conserjería personalizados.'
        : lang === 'fr'
        ? 'Découvrez notre collection exclusive de villas de luxe à louer pour les vacances à Ibiza. Chaque propriété a été soigneusement sélectionnée pour offrir une expérience unique, alliant emplacements privilégiés, design architectural exceptionnel et services de conciergerie personnalisés.'
        : 'Discover our exclusive collection of luxury villas for holiday rental in Ibiza. Each property has been carefully selected to offer a unique experience, combining privileged locations, exceptional architectural design, and personalized concierge services.',
      image: villaImages[0] || '',
      buttonText: lang === 'es' ? 'Explorar Alquileres' : lang === 'fr' ? 'Explorer les Locations' : 'Explore Rentals',
      view: 'villas-holiday'
    },
    {
      id: 'longterm',
      title: lang === 'es' ? 'Larga Estancia' : lang === 'fr' ? 'Location Longue Durée' : 'Long-Term Rentals',
      subtitle: lang === 'es' ? 'Residencias Exclusivas' : lang === 'fr' ? 'Résidences Exclusives' : 'Exclusive Residences',
      description: lang === 'es'
        ? 'Para aquellos que buscan establecerse en la isla durante temporadas más largas, ofrecemos una selección de residencias de larga estancia. Propiedades excepcionales que combinan el confort de un hogar con los servicios de un hotel de cinco estrellas.'
        : lang === 'fr'
        ? 'Pour ceux qui souhaitent s\'installer sur l\'île pendant de longues périodes, nous proposons une sélection de résidences longue durée. Des propriétés exceptionnelles qui allient le confort d\'une maison aux services d\'un hôtel cinq étoiles.'
        : 'For those seeking to settle on the island for extended periods, we offer a selection of long-stay residences. Exceptional properties that combine the comfort of a home with five-star hotel services.',
      image: villaImages[1] || '',
      buttonText: lang === 'es' ? 'Ver Residencias' : lang === 'fr' ? 'Voir les Résidences' : 'View Residences',
      view: 'villas-longterm'
    },
    {
      id: 'sales',
      title: lang === 'es' ? 'Propiedades en Venta' : lang === 'fr' ? 'Propriétés à Vendre' : 'Properties for Sale',
      subtitle: lang === 'es' ? 'Inversión Premium' : lang === 'fr' ? 'Investissement Premium' : 'Premium Investment',
      description: lang === 'es'
        ? 'Acceda a las propiedades más exclusivas del mercado inmobiliario de Ibiza. Nuestra cartera incluye villas de diseño contemporáneo, fincas tradicionales restauradas y propiedades off-market para inversores exigentes que buscan oportunidades únicas.'
        : lang === 'fr'
        ? 'Accédez aux propriétés les plus exclusives du marché immobilier d\'Ibiza. Notre portefeuille comprend des villas au design contemporain, des fincas traditionnelles restaurées et des propriétés hors marché pour les investisseurs exigeants.'
        : 'Access the most exclusive properties in the Ibiza real estate market. Our portfolio includes contemporary design villas, restored traditional fincas, and off-market properties for discerning investors seeking unique opportunities.',
      image: villaImages[2] || '',
      buttonText: lang === 'es' ? 'Ver Propiedades' : lang === 'fr' ? 'Voir les Propriétés' : 'View Properties',
      view: 'villas-sale'
    }
  ];

  return (
      <div className="min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
      {/* Hero Section */}
      <div className="pt-40 pb-20 text-center px-6">
        <span
          className="block mb-6 uppercase tracking-[0.5em] text-xs font-medium"
          style={{ color: '#C4A461' }}
        >
          {lang === 'es' ? 'Colección Exclusiva' : lang === 'fr' ? 'Collection Exclusive' : 'Exclusive Collection'}
        </span>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl mb-6"
          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, color: '#F5F3EE' }}
        >
          {lang === 'es' ? 'Nuestras' : lang === 'fr' ? 'Nos' : 'Our'}{' '}
          <span className="italic" style={{ color: '#C4A461' }}>Villas</span>
        </h1>
        <p
          className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 300 }}
        >
          {lang === 'es'
            ? 'Descubra la esencia del lujo mediterráneo a través de nuestra selección de propiedades excepcionales.'
            : lang === 'fr'
            ? 'Découvrez l\'essence du luxe méditerranéen à travers notre sélection de propriétés exceptionnelles.'
            : 'Discover the essence of Mediterranean luxury through our selection of exceptional properties.'}
        </p>
      </div>

      {/* Zig-Zag Sections */}
      <div className="pb-20 px-6 lg:px-12 space-y-16 lg:space-y-24">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16 max-w-7xl mx-auto`}
          >
            {/* Image Side */}
            <div className="w-full lg:w-[45%] h-[280px] md:h-[350px] lg:h-[400px] relative overflow-hidden group rounded-2xl lg:rounded-3xl">
              {section.image ? (
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-luxury-slate/30 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-luxury-gold/30 rounded-full"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26]/60 via-transparent to-transparent rounded-2xl lg:rounded-3xl"></div>
              {/* Button on image */}
              <button
                onClick={() => onNavigate(section.view)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-500 backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(196, 164, 97, 0.9)',
                  color: '#0B1C26',
                  border: '1px solid #C4A461',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(11, 28, 38, 0.9)';
                  e.currentTarget.style.color = '#C4A461';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(196, 164, 97, 0.9)';
                  e.currentTarget.style.color = '#0B1C26';
                }}
              >
                {section.buttonText}
              </button>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-4 md:p-8 lg:p-12">
              <div className="max-w-xl">
                {/* Subtitle */}
                <span
                  className="block mb-4 uppercase tracking-[0.4em] text-[10px] font-semibold"
                  style={{ color: 'rgba(196, 164, 97, 0.7)' }}
                >
                  {section.subtitle}
                </span>

                {/* Title */}
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl mb-6"
                  style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, color: '#F5F3EE' }}
                >
                  {section.title}
                </h2>

                {/* Decorative Line */}
                <div className="w-16 h-px mb-6" style={{ backgroundColor: '#C4A461' }}></div>

                {/* Description */}
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 300 }}
                >
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer SEO */}
      <FooterSEO
        onNavigate={onNavigate}
        lang={lang}
        title={lang === 'es'
          ? "Especialistas en Real Estate de Lujo en Ibiza"
          : "Ibiza Luxury Real Estate Specialists"}
        description={lang === 'es'
          ? "The Key Ibiza ofrece acceso exclusivo a las propiedades más prestigiosas de la isla, desde villas contemporáneas hasta fincas tradicionales restauradas con los más altos estándares de lujo."
          : "The Key Ibiza offers exclusive access to the island's most prestigious properties, from contemporary villas to traditional fincas restored to the highest luxury standards."}
        links={[
          { label: lang === 'es' ? 'Alquiler Vacacional' : 'Holiday Rentals', view: 'villas-holiday' },
          { label: lang === 'es' ? 'Larga Estancia' : 'Long-Term Rentals', view: 'villas-longterm' },
          { label: lang === 'es' ? 'Propiedades en Venta' : 'Properties for Sale', view: 'villas-sale' },
          { label: lang === 'es' ? 'Servicios VIP' : 'VIP Services', view: 'services' },
          { label: lang === 'es' ? 'Contacto' : 'Contact', view: 'contact' }
        ]}
      />
    </div>
  );
};

export default VillasPage;
