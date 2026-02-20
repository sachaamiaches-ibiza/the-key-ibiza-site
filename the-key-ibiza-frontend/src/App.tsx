
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VillaCard from './components/VillaCard';
import AIConcierge from './components/AIConcierge';
import ServicesPageNew from './components/ServicesPageNew';
import PhotographerPage from './components/PhotographerPage';
import AboutPage from './components/AboutPage';
import ServiceDetail from './components/ServiceDetail';
import VillaDetailPage from './components/VillaDetailPage';
import VillaListingPage from './components/VillaListingPage';
import ValerieDetail from './components/ValerieDetail';
import FrancescaDetail from './components/FrancescaDetail';
import BlogPage from './components/BlogPage';
import FooterSEO from './components/FooterSEO';
import VipLogin from './components/VipLogin';
import ComingSoon from './components/ComingSoon';
import BoatsPage from './components/BoatsPage';
import YachtsPage from './components/YachtsPage';
import CatamaransPage from './components/CatamaransPage';
import VillasPage from './components/VillasPage';
import { servicesWithIcons, allServicesGrid } from './components/ServiceIcons';
import { getServices } from './constants';
import { translations } from './translations';
import { Language, Villa } from './types';
import { fetchVillas, fetchVillaBySlug, getPublicVillas, getAllVillas } from './services/villaService';
import { vipAuth } from './services/vipAuth';

export type View = 
  | 'home' | 'services' | 'photographer' | 'about' | 'blog' | 'valerie-detail' | 'francesca-detail'
  | 'service-villas' | 'villas-holiday' | 'villas-longterm' | 'villas-sale'
  | 'service-yacht' | 'service-security' | 'service-wellness' | 'service-nightlife'
  | 'service-events' | 'service-catering' | 'service-furniture' | 'service-health' 
  | 'service-yoga' | 'service-cleaning' | 'service-driver' | 'service-deliveries' 
  | 'service-babysitting'
  | string;

interface ContactFormProps {
  lang: Language;
}

const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const t = translations[lang].contact;
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone) newErrors.phone = 'Required';
    return newErrors;
  };

  const sendEmail = async () => {
    const messageContent = `New Contact Form Submission\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message || 'No message provided'}`;

    // Send via Formsubmit.co (free email service, no registration required)
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('message', formData.message || 'No message provided');
    formDataToSend.append('_subject', 'New Contact Form Submission – The Key Ibiza');
    formDataToSend.append('_captcha', 'false');
    formDataToSend.append('_template', 'table');

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@thekey-ibiza.com', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error('Email failed');
      }
    } catch (error) {
      // Fallback: open mailto
      const subject = encodeURIComponent('New Contact Form Submission');
      const body = encodeURIComponent(messageContent);
      window.open(`mailto:hello@thekey-ibiza.com?subject=${subject}&body=${body}`, '_blank');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');
    await sendEmail();
    setStatus('success');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-lg font-serif text-white mb-2">{t.success}</h3>
        <p className="text-white/40 text-sm mb-4">{t.successDesc}</p>
        <button onClick={() => setStatus('idle')} className="text-luxury-gold text-[9px] uppercase tracking-widest">
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        required
        className={`w-full bg-transparent border-b ${errors.name ? 'border-red-500/50' : 'border-white/20'} px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30`}
        placeholder={t.name}
        value={formData.name}
        onChange={(e) => {
          setFormData({...formData, name: e.target.value});
          if(errors.name) setErrors({...errors, name: ''});
        }}
      />
      <input
        type="email"
        required
        className={`w-full bg-transparent border-b ${errors.email ? 'border-red-500/50' : 'border-white/20'} px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30`}
        placeholder={t.email}
        value={formData.email}
        onChange={(e) => {
          setFormData({...formData, email: e.target.value});
          if(errors.email) setErrors({...errors, email: ''});
        }}
      />
      <input
        type="tel"
        required
        className={`w-full bg-transparent border-b ${errors.phone ? 'border-red-500/50' : 'border-white/20'} px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30`}
        placeholder={t.phone}
        value={formData.phone}
        onChange={(e) => {
          setFormData({...formData, phone: e.target.value});
          if(errors.phone) setErrors({...errors, phone: ''});
        }}
      />
      <textarea
        rows={3}
        className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors resize-none placeholder:text-white/30"
        placeholder={t.message}
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-luxury-gold text-luxury-blue py-3 rounded-full text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all mt-4"
      >
        {status === 'submitting' ? '...' : t.send}
      </button>
    </form>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>(() => {
    // Load language from localStorage on initial render
    const savedLang = localStorage.getItem('thekey-language');
    if (savedLang && ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ar', 'hi', 'ru'].includes(savedLang)) {
      return savedLang as Language;
    }
    return 'en';
  });
  const [serviceIndex, setServiceIndex] = useState(0);
  const [serviceVisible, setServiceVisible] = useState(true);
  const [mobileVillaIndex, setMobileVillaIndex] = useState(0);
  const mobileVillaRef = useRef<HTMLDivElement>(null);
  const mobileVillaTouchStart = useRef(0);

  // Villa data from Backend API
  const [allVillas, setAllVillas] = useState<Villa[]>([]);
  const [isVip, setIsVip] = useState(vipAuth.isAuthenticated());
  const [villasLoading, setVillasLoading] = useState(true);
  const [directVilla, setDirectVilla] = useState<Villa | null>(null);

  // Search dates persistence - keeps dates when navigating between listing and detail pages
  const [searchCheckIn, setSearchCheckIn] = useState<string>('');
  const [searchCheckOut, setSearchCheckOut] = useState<string>('');

  // Legal modals
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [imprintModalOpen, setImprintModalOpen] = useState(false);

  // Handler to update search dates from any component
  const handleSearchDatesChange = (checkIn: string, checkOut: string) => {
    setSearchCheckIn(checkIn);
    setSearchCheckOut(checkOut);
  };

  // Fetch villas from Backend
  useEffect(() => {
    const loadVillas = async () => {
      setVillasLoading(true);
      try {
        const villas = await fetchVillas();
        setAllVillas(villas);
        console.log('✅ ALL VILLAS FROM BACKEND:', villas.length);
      } catch (error) {
        console.error('Failed to load villas:', error);
      }
      setVillasLoading(false);
    };
    loadVillas();
  }, []);

  // Fetch single villa directly from Backend when needed
  useEffect(() => {
    if (view.startsWith('villa-') && !villasLoading) {
      const villaId = view.replace('villa-', '');
      const villaInState = allVillas.find(v => v.id === villaId);

      if (!villaInState && !directVilla) {
        // Villa not in state, fetch directly from Backend
        fetchVillaBySlug(villaId).then(villa => {
          if (villa) {
            setDirectVilla(villa);
          }
        });
      } else if (villaInState) {
        // Clear direct villa if we found it in state
        setDirectVilla(null);
      }
    } else {
      // Clear direct villa when navigating away
      setDirectVilla(null);
    }
  }, [view, allVillas, villasLoading]);

  // Filter villas based on VIP status
  const VILLAS = isVip ? getAllVillas(allVillas) : getPublicVillas(allVillas);
  const SERVICES = getServices(lang);

  // Handle VIP auth change
  const handleVipAuthChange = (authenticated: boolean) => {
  setIsVip(authenticated);
};

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('thekey-language', lang);
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Auto-transition slideshow
  useEffect(() => {
    if (view !== 'home') return;
    const interval = setInterval(() => {
      setServiceVisible(false);
      setTimeout(() => {
        setServiceIndex((prev) => (prev + 1) % servicesWithIcons.length);
        setServiceVisible(true);
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, [view]);
  const t = translations[lang].home;

  console.log('RENDER VILLAS:', allVillas.length);

  const renderView = () => {
    if (view.startsWith('villa-')) {
      const villaId = view.replace('villa-', '');
      // First check in filtered VILLAS, then in all villas, then in directly fetched villa
      const villa = VILLAS.find(v => v.id === villaId) || allVillas.find(v => v.id === villaId) || directVilla;

      if (villa) {
        return (
          <VillaDetailPage
            villa={villa}
            onNavigate={setView}
            lang={lang}
            initialCheckIn={searchCheckIn}
            initialCheckOut={searchCheckOut}
            onDatesChange={handleSearchDatesChange}
            isVip={isVip}
          />
        );
      } else if (villasLoading) {
        // Still loading - show loading state
        return (
          <div className="pt-40 pb-20 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
            <div className="container mx-auto px-6 text-center">
              <div className="w-12 h-12 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">Loading villa...</p>
            </div>
          </div>
        );
      } else {
        // Villa not found - show message
        return (
          <div className="pt-40 pb-20 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
            <div className="container mx-auto px-6 text-center">
              <h1 className="text-4xl font-serif text-white mb-4">Villa Not Found</h1>
              <p className="text-white/60 mb-8">The villa you're looking for is not available.</p>
              <button
                onClick={() => setView('villas-holiday')}
                className="px-8 py-3 bg-luxury-gold text-luxury-blue rounded-full text-sm uppercase tracking-wider hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all"
              >
                View All Villas
              </button>
            </div>
          </div>
        );
      }
    }

    switch (view) {
      case 'services': return <ServicesPageNew onNavigate={setView} lang={lang} />;
      case 'photographer': return <PhotographerPage onNavigate={setView} lang={lang} />;
      case 'about': return <AboutPage onNavigate={setView} lang={lang} />;
      case 'blog': return <ComingSoon title="Blog" onNavigate={setView} lang={lang} />;
      case 'valerie-detail': return <ValerieDetail onNavigate={setView} lang={lang} />;
      case 'francesca-detail': return <FrancescaDetail onNavigate={setView} lang={lang} />;
      case 'villas-holiday':
        return (
          <VillaListingPage
            category={view}
            onNavigate={setView}
            lang={lang}
            initialCheckIn={searchCheckIn}
            initialCheckOut={searchCheckOut}
            onDatesChange={handleSearchDatesChange}
            villas={VILLAS}
          />
        );
      case 'villas-longterm':
        return <ComingSoon title="Long Term Rentals" onNavigate={setView} lang={lang} />;
      case 'villas-sale':
        return <ComingSoon title="Properties for Sale" onNavigate={setView} lang={lang} />;
      case 'boats-yachts':
        return <YachtsPage onNavigate={setView} lang={lang} />;
      case 'boats-catamarans':
        return <CatamaransPage onNavigate={setView} lang={lang} />;
      case 'service-yacht':
        return <BoatsPage onNavigate={setView} lang={lang} />;
      case 'service-villas': return <VillasPage onNavigate={setView} lang={lang} />;
      default:
        if (view.startsWith('service-')) {
          const id = view.replace('service-', '');
          return <ServiceDetail serviceId={id} onNavigate={setView} lang={lang} />;
        }
        return (
          <>
            <Hero onNavigate={setView} lang={lang} />
            
            <section id="explore-world" className="w-full overflow-hidden scroll-mt-24" style={{ height: '240px', backgroundColor: '#0B1C26' }}>
              <div className="relative w-full h-full flex items-center justify-center">
                {servicesWithIcons.map((s, idx) => {
                  const IconComponent = s.icon;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setView(s.id === 'photographer' ? 'photographer' : `service-${s.id}`)}
                      className="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center"
                      style={{
                        opacity: idx === serviceIndex ? (serviceVisible ? 1 : 0) : 0,
                        transform: idx === serviceIndex
                          ? (serviceVisible ? 'translateX(0)' : 'translateX(40px)')
                          : 'translateX(-40px)',
                        transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
                        pointerEvents: idx === serviceIndex ? 'auto' : 'none',
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
                    </div>
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
                      <div
                        key={service.id}
                        onClick={() => setView(service.id === 'photographer' ? 'photographer' : `service-${service.id}`)}
                        className="flex flex-col items-center cursor-pointer group w-[calc(33.333%-22px)] md:w-auto"
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
                      </div>
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
                  {VILLAS.slice(0, 3).map(villa => <VillaCard key={villa.id} villa={villa} onNavigate={setView} lang={lang} />)}
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
                      const maxIndex = Math.min(VILLAS.length, 3) - 1;

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
                      {VILLAS.slice(0, 3).map(villa => (
                        <div key={villa.id} className="w-full flex-shrink-0 px-2">
                          <VillaCard villa={villa} onNavigate={setView} lang={lang} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dots indicator */}
                  <div className="flex justify-center gap-2 mt-6">
                    {VILLAS.slice(0, 3).map((_, i) => (
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

            <FooterSEO 
              onNavigate={setView} 
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
    }
  };

  return (
    <div className="min-h-screen selection:bg-luxury-gold selection:text-white overflow-x-hidden">
      {/* Golden Top Bar - visible on all pages */}
      <div
        data-navbar="true"
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{ backgroundColor: '#C9B27C' }}
      >
        <div className="container mx-auto px-6 py-1.5 flex justify-between items-center">
          <span
            className="hidden md:inline"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '8px',
              letterSpacing: '0.18em',
              color: '#0B1C26',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginLeft: '8px',
            }}
          >
            The Key that opens all the doors to an unforgettable experience.
          </span>
          <div className="flex items-center gap-3 md:gap-5 mx-auto md:mx-0" style={{ marginRight: '14px' }}>
            <a
              href="https://wa.me/34660153207"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '8px',
                letterSpacing: '0.12em',
                color: '#0B1C26',
                fontWeight: 500,
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              +34 660 153 207
            </a>
            <a
              href="mailto:hello@thekey-ibiza.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '8px',
                letterSpacing: '0.06em',
                color: '#0B1C26',
                fontWeight: 500,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              hello@thekey-ibiza.com
            </a>
          </div>
        </div>
      </div>
      <Navbar currentView={view} onNavigate={setView} lang={lang} onLanguageChange={setLang} />
      <main className="animate-fade-in relative z-[1]">{renderView()}</main>
      <section id="contact" className="py-20 md:py-28 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-center">

          {/* LEFT - Logo + Contact Info */}
          <div className="text-center md:text-left">
            {/* Logo */}
            <div className="flex flex-col items-center md:items-start mb-8">
              <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-14 mb-4">
                <circle cx="50" cy="35" r="32" stroke="#C9B27C" strokeWidth="3.5" />
                <circle cx="50" cy="35" r="18" stroke="#C9B27C" strokeWidth="2.5" strokeDasharray="80 20" />
                <path d="M50 35V130" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 65H70" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 82H82" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 99H75" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 116H88" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 130H65" stroke="#C9B27C" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <span className="text-xl tracking-[0.25em]" style={{ fontFamily: 'Playfair Display, serif', color: '#C9B27C' }}>THE KEY</span>
              <span className="text-sm tracking-[0.3em] italic" style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(201,178,124,0.7)' }}>Ibiza</span>
            </div>
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="https://wa.me/34660153207" target="_blank" rel="noopener noreferrer" className="text-white text-base font-light hover:text-luxury-gold transition-colors flex items-center justify-center md:justify-start gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                +34 660 153 207
              </a>
              <a href="mailto:hello@thekey-ibiza.com" className="text-white/50 text-sm hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                hello@thekey-ibiza.com
              </a>
            </div>
            <div className="flex justify-center md:justify-start space-x-5">
              {['Instagram', 'WhatsApp', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="text-[9px] uppercase tracking-[0.15em] text-white/30 hover:text-luxury-gold transition-colors">{social}</a>
              ))}
            </div>
          </div>

          {/* MIDDLE - VIP Access */}
          <VipLogin onAuthChange={handleVipAuthChange} />

          {/* RIGHT - Contact Form */}
          <div className="text-center md:text-left">
            <h3 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-semibold mb-6">Bespoke Inquiry</h3>
            <ContactForm lang={lang} />
          </div>

        </div>
      </section>
      <footer className="py-12" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 lg:px-12">
          {/* Legal Links */}
          <div className="flex justify-center gap-8 mb-8">
            <button
              onClick={() => setDisclaimerModalOpen(true)}
              className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors"
            >
              Disclaimer
            </button>
            <button
              onClick={() => setImprintModalOpen(true)}
              className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors"
            >
              Imprint
            </button>
            <button
              onClick={() => setDisclaimerModalOpen(true)}
              className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors"
            >
              Privacy Policy
            </button>
          </div>
          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.4em] text-white/30">
              &copy; {new Date().getFullYear()} THE KEY IBIZA
            </p>
            <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.4em] text-white/30">
              Excellence & Discretion — All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

      {/* ===== DISCLAIMER MODAL ===== */}
      {disclaimerModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-[9998]"
            onClick={() => setDisclaimerModalOpen(false)}
          />
          <div
            className="relative z-[9999] bg-gradient-to-b from-[#1a2634] to-[#0f1923] rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            style={{ border: '1px solid rgba(196,164,97,0.2)' }}
          >
            <button
              onClick={() => setDisclaimerModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-serif text-luxury-gold mb-6">Disclaimer & Privacy Policy</h2>

            <div className="text-white/70 text-sm leading-relaxed space-y-4">
              <h3 className="text-luxury-gold text-base font-semibold mt-4">1. General Information</h3>
              <p>
                The content of this website is for general information purposes only. The Key Ibiza makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">2. Privacy Policy</h3>
              <p>
                We are committed to protecting your privacy. Any personal information collected through this website will be used solely for the purpose of providing our services and will not be shared with third parties without your consent, except as required by law.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">3. Data Collection</h3>
              <p>
                We collect information you provide directly to us, such as when you fill out a contact form, request information about our services, or communicate with us. This may include your name, email address, phone number, and any other information you choose to provide.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">4. Cookies</h3>
              <p>
                This website uses cookies to enhance your browsing experience. By continuing to use this site, you consent to our use of cookies in accordance with our privacy policy.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">5. Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at hello@thekey-ibiza.com.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">6. Third-Party Links</h3>
              <p>
                This website may contain links to external sites. We are not responsible for the content or privacy practices of these sites.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">7. Contact</h3>
              <p>
                For any questions regarding this disclaimer or privacy policy, please contact us at:<br />
                <span className="text-luxury-gold">hello@thekey-ibiza.com</span>
              </p>
            </div>

            <button
              onClick={() => setDisclaimerModalOpen(false)}
              className="mt-8 w-full py-3 bg-luxury-gold text-luxury-blue rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===== IMPRINT MODAL ===== */}
      {imprintModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-[9998]"
            onClick={() => setImprintModalOpen(false)}
          />
          <div
            className="relative z-[9999] bg-gradient-to-b from-[#1a2634] to-[#0f1923] rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            style={{ border: '1px solid rgba(196,164,97,0.2)' }}
          >
            <button
              onClick={() => setImprintModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-serif text-luxury-gold mb-6">Imprint</h2>

            <div className="text-white/70 text-sm leading-relaxed space-y-4">
              <h3 className="text-luxury-gold text-base font-semibold">Company Information</h3>
              <p>
                <strong className="text-white">The Key Ibiza</strong><br />
                Luxury Concierge Services
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">Address</h3>
              <p>
                Ibiza, Balearic Islands<br />
                Spain
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">Contact</h3>
              <p>
                Email: <span className="text-luxury-gold">hello@thekey-ibiza.com</span><br />
                Website: <span className="text-luxury-gold">www.thekey-ibiza.com</span>
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">Responsible for Content</h3>
              <p>
                The Key Ibiza<br />
                In accordance with § 55 Abs. 2 RStV
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">Dispute Resolution</h3>
              <p>
                The European Commission provides a platform for online dispute resolution (ODR):
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">Liability for Content</h3>
              <p>
                As a service provider, we are responsible for our own content on these pages according to general laws. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
              </p>

              <h3 className="text-luxury-gold text-base font-semibold mt-4">Copyright</h3>
              <p>
                The content and works created by the site operators on these pages are subject to copyright law. Reproduction, editing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.
              </p>
            </div>

            <button
              onClick={() => setImprintModalOpen(false)}
              className="mt-8 w-full py-3 bg-luxury-gold text-luxury-blue rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <AIConcierge lang={lang} />
    </div>
  );
};

export default App;
