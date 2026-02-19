import React, { useState, useEffect } from 'react';
import { Language, Villa } from '../types';
import FooterSEO from './FooterSEO';
import { fetchVillas } from '../services/villaService';
import { getHeaderImageUrl } from '../utils/cloudinaryUrl';

interface VillasPageProps {
  onNavigate: (view: string) => void;
  lang: Language;
}

const VillasPage: React.FC<VillasPageProps> = ({ onNavigate, lang }) => {
  const [villaImages, setVillaImages] = useState<string[]>([]);

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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26]/40 via-transparent to-transparent rounded-2xl lg:rounded-3xl"></div>
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
                  className="text-sm md:text-base leading-relaxed mb-8"
                  style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 300 }}
                >
                  {section.description}
                </p>

                {/* Button */}
                <button
                  onClick={() => onNavigate(section.view)}
                  className="px-8 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-500"
                  style={{
                    backgroundColor: '#C4A461',
                    color: '#0B1C26',
                    border: '1px solid #C4A461',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B1C26';
                    e.currentTarget.style.color = '#C4A461';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#C4A461';
                    e.currentTarget.style.color = '#0B1C26';
                  }}
                >
                  {section.buttonText}
                </button>
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
