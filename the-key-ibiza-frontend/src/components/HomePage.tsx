import React, { useState, useEffect, useRef, useCallback } from 'react';
import Hero from './Hero';
import VillaCard from './VillaCard';
import Testimonials from './Testimonials';
import BlogPreview from './BlogPreview';
import FooterSEO from './FooterSEO';
import { servicesWithIcons, allServicesGrid } from './ServiceIcons';
import { translations } from '../translations';
import { Language, Villa } from '../types';
import { View } from '../App';

interface HomePageProps {
  onNavigate: (view: View, slug?: string) => void;
  lang: Language;
  onOpenContact: () => void;
  villas: Villa[];
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, lang, onOpenContact, villas }) => {
  const [serviceIndex, setServiceIndex] = useState(0);
  const [serviceVisible, setServiceVisible] = useState(true);
  const [mobileVillaIndex, setMobileVillaIndex] = useState(0);
  const mobileVillaRef = useRef<HTMLDivElement>(null);
  const mobileVillaTouchStart = useRef(0);

  const t = translations[lang].home;

  // Curate featured villas: prioritize Bailey, exclude Style from top 3
  const featuredVillas = React.useMemo(() => {
    const bailey = villas.find(v => v.name.toLowerCase().includes('bailey'));
    const others = villas.filter(v =>
      !v.name.toLowerCase().includes('bailey') &&
      !v.name.toLowerCase().includes('style')
    );
    if (bailey) {
      return [bailey, ...others].slice(0, 3);
    }
    return others.slice(0, 3);
  }, [villas]);

  // Memoized handler for BlogPreview to prevent re-renders from service slideshow
  const handleBlogNavigate = useCallback((view: string, slug?: string) => {
    if (slug) {
      onNavigate(`blog-${slug}` as View);
    } else {
      onNavigate(view as View);
    }
  }, [onNavigate]);

  // Auto-transition slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setServiceVisible(false);
      setTimeout(() => {
        setServiceIndex((prev) => (prev + 1) % servicesWithIcons.length);
        setServiceVisible(true);
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Hero onNavigate={onNavigate} lang={lang} onOpenContact={onOpenContact} />
      
      <section id="explore-world" className="w-full overflow-hidden scroll-mt-24" style={{ height: '240px', backgroundColor: '#0B1C26' }}>
        <div className="relative w-full h-full flex items-center justify-center">
        {servicesWithIcons.map((s, idx) => {
            const IconComponent = s.icon;
            return (
            <button
                type="button"
                key={s.id}
                onClick={() => onNavigate(s.id === 'photographer' ? 'photographer' : `service-${s.id}`)}
                className="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center bg-transparent border-0 outline-none"
                style={{
                opacity: idx === serviceIndex ? (serviceVisible ? 1 : 0) : 0,
                transform: idx === serviceIndex
                    ? (serviceVisible ? 'translateX(0)' : 'translateX(40px)')
                    : 'translateX(-40px)',
                transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
                pointerEvents: idx === serviceIndex ? 'auto' : 'none',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                }}
            >
                {/* Service Icon */}
                <IconComponent className="w-20 h-20 md:w-24 md:h-24 mb-4" />
                {/* Service Title */}
                <span
                style={{
                    color: '#C9B27C',
                    letterSpacing: '0.3em',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 400,
                }}
                >
                {s.title}
                </span>
            </button>
            );
        })}
        {/* Minimal dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {servicesWithIcons.map((_, idx) => (
            <button
                key={idx}
                onClick={(e) => {
                e.stopPropagation();
                setServiceVisible(false);
                setTimeout(() => {
                    setServiceIndex(idx);
                    setServiceVisible(true);
                }, 400);
                }}
                style={{
                width: idx === serviceIndex ? '20px' : '6px',
                height: '2px',
                backgroundColor: idx === serviceIndex ? '#C9B27C' : 'rgba(201,178,124,0.3)',
                transition: 'all 0.5s ease',
                }}
            />
            ))}
        </div>
        </div>
      </section>

      <section id="services-grid" className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16 md:mb-20">
            <span
            className="block mb-4"
            style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.5em',
                color: 'rgba(201,178,124,0.6)',
                textTransform: 'uppercase',
                fontWeight: 600,
            }}
            >
            Our Services
            </span>
            <h2
            className="text-3xl md:text-5xl lg:text-6xl"
            style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                color: '#F5F3EE',
            }}
            >
            {t.bespoke} <span className="italic" style={{ color: '#C9B27C' }}>{t.excellence}</span>
            </h2>
        </div>

        {/* Icons Grid - 2 rows of 7 */}
        <div className="flex flex-wrap justify-center md:grid md:grid-cols-7 gap-8 md:gap-5 lg:gap-8 max-w-6xl mx-auto">
            {allServicesGrid.map((service) => {
            const IconComponent = service.icon;
            return (
                <button
                type="button"
                key={service.id}
                onClick={() => onNavigate(service.id === 'photographer' ? 'photographer' : `service-${service.id}`)}
                className="flex flex-col items-center cursor-pointer group w-[calc(33.333%-22px)] md:w-auto bg-transparent border-0 outline-none p-0"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                >
                {/* Circular Icon Container */}
                <div
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110"
                    style={{
                    border: '1px solid rgba(201,178,124,0.3)',
                    backgroundColor: 'transparent',
                    }}
                >
                    <IconComponent className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                </div>
                {/* Service Title */}
                <span
                    className="text-center transition-colors duration-300 group-hover:text-[#C9B27C]"
                    style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    lineHeight: '1.4',
                    }}
                >
                    {service.title}
                </span>
                </button>
            );
            })}
        </div>
        </div>
      </section>

      <section id="villas" className="py-16 md:py-20 lg:py-24 scroll-mt-24" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 md:mb-20">
            <span className="text-luxury-gold uppercase tracking-[0.6em] text-[10px] font-medium block mb-6">{t.selectedCollection}</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-4 text-white">{t.signatureResidences}</h2>
            <p className="text-white/40 text-sm md:text-base font-light tracking-wide">{t.residencesDesc}</p>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 lg:gap-14">
            {featuredVillas.map(villa => <VillaCard key={villa.id} villa={villa} onNavigate={onNavigate} lang={lang} />)}
        </div>

        {/* Mobile: Swipeable carousel */}
        <div className="md:hidden">
            <div
            ref={mobileVillaRef}
            className="overflow-hidden"
            onTouchStart={(e) => {
                mobileVillaTouchStart.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
                const touchEnd = e.changedTouches[0].clientX;
                const diff = mobileVillaTouchStart.current - touchEnd;
                const threshold = 50;
                const maxIndex = Math.min(villas.length, 3) - 1;

                if (diff > threshold && mobileVillaIndex < maxIndex) {
                setMobileVillaIndex(mobileVillaIndex + 1);
                } else if (diff < -threshold && mobileVillaIndex > 0) {
                setMobileVillaIndex(mobileVillaIndex - 1);
                }
            }}
            >
            <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${mobileVillaIndex * 100}%)` }}
            >
                {featuredVillas.map(villa => (
                <div key={villa.id} className="w-full flex-shrink-0 px-2">
                    <VillaCard villa={villa} onNavigate={onNavigate} lang={lang} />
                </div>
                ))}
            </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
            {featuredVillas.map((_, i) => (
                <button
                key={i}
                onClick={() => setMobileVillaIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === mobileVillaIndex ? 'bg-luxury-gold w-6' : 'bg-white/30'}`}
                />
            ))}
            </div>
        </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Blog Preview Section */}
      <BlogPreview onNavigate={handleBlogNavigate} lang={lang} />

      <FooterSEO
        onNavigate={onNavigate}
        lang={lang}
        title={lang === 'es' ? "Posicionamiento y Excelencia: El Referente del Lujo en Ibiza" : "Ibiza Luxury Authority: Positioning & Excellence"}
        description={lang === 'es' ? 
        "The Key Ibiza es la agencia líder de conserjería de lujo y gestión de estilo de vida en la isla. Nuestra especialización estratégica abarca desde el alquiler de villas exclusivas de alta gama en ubicaciones privilegiadas como Cala Jondal, Es Cubells, Porroig y Santa Eulalia, hasta la inversión inmobiliaria premium. Como expertos locales en el mercado de Real Estate de Ibiza, ofrecemos acceso directo a propiedades 'off-market' y residencias minimalistas de diseño icónico que no se encuentran en portales convencionales. Nuestra misión es orquestar experiencias VIP personalizadas bajo demanda, incluyendo el alquiler de yates de lujo y superyates, servicios de seguridad privada discreta con escoltas cualificados, transporte VIP con chófer, chefs privados de estrella Michelin y programas integrales de bienestar holístico. Conectamos a una clientela internacional exigente con el alma más auténtica y privada del Mediterráneo, garantizando una estancia impecable y discreta bajo los más altos estándares de excelencia humana y profesional en las Islas Baleares." : 
        "The Key Ibiza stands as the premier luxury concierge and lifestyle management agency on the island. We specialize in strategic high-end villa rentals in coveted locations like Cala Jondal, Es Cubells, Porroig, and Santa Eulalia, as well as premium real estate investment. As local experts in the Ibiza property market, we provide direct access to off-market properties and iconic designer minimalist residences not found on conventional portals. Our mission is to orchestrate bespoke VIP experiences on demand, including luxury yacht and superyacht charters, discreet private security services with qualified escorts, VIP chauffeur transportation, Michelin-starred private chefs, and comprehensive holistic wellness programs. We connect a demanding international clientele with the most authentic and private soul of the Mediterranean, ensuring a flawless and discreet stay governed by the highest standards of human and professional excellence in the Balearic Islands."}
        links={[
        { label: translations[lang].nav.villas, view: 'villas-holiday' },
        { label: translations[lang].nav.services, view: 'services' },
        { label: translations[lang].nav.about, view: 'about' },
        { label: translations[lang].nav.blog, view: 'blog' },
        { label: "Villa Sales", view: 'villas-sale' },
        { label: "Yacht Charter Ibiza", view: 'service-yacht' }
        ]}
      />
    </>
  );
};

export default HomePage;

