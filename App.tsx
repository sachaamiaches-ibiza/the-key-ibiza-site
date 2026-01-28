
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VillaCard from './components/VillaCard';
import AIConcierge from './components/AIConcierge';
import ServicesPage from './components/ServicesPage';
import PhotographerPage from './components/PhotographerPage';
import AboutPage from './components/AboutPage';
import ServiceDetail from './components/ServiceDetail';
import VillaDetailPage from './components/VillaDetailPage';
import VillaListingPage from './components/VillaListingPage';
import ValerieDetail from './components/ValerieDetail';
import FrancescaDetail from './components/FrancescaDetail';
import BlogPage from './components/BlogPage';
import FooterSEO from './components/FooterSEO';
import { getVillas, getServices } from './constants';
import { translations } from './translations';
import { Language } from './types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="luxury-card p-12 md:p-20 rounded-[60px] text-center animate-fade-in flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-luxury-gold/20 rounded-full flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-3xl font-serif text-white mb-4">{t.success}</h3>
        <p className="text-white/50 mb-8 font-light">{t.successDesc}</p>
        <button onClick={() => setStatus('idle')} className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold border-b border-luxury-gold pb-1">
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <div className="luxury-card p-8 md:p-16 rounded-[60px] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
      <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white mb-10 text-center lg:text-left">{t.title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">{t.name}</label>
            <input 
              type="text" 
              required
              className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-full px-8 py-5 text-white focus:outline-none focus:border-luxury-gold transition-colors`}
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if(errors.name) setErrors({...errors, name: ''});
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">{t.email}</label>
            <input 
              type="email" 
              required
              className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-full px-8 py-5 text-white focus:outline-none focus:border-luxury-gold transition-colors`}
              placeholder="e.g. john@luxury.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if(errors.email) setErrors({...errors, email: ''});
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">{t.phone}</label>
          <input 
            type="tel" 
            required
            className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-full px-8 py-5 text-white focus:outline-none focus:border-luxury-gold transition-colors`}
            placeholder="+34 ..."
            value={formData.phone}
            onChange={(e) => {
              setFormData({...formData, phone: e.target.value});
              if(errors.phone) setErrors({...errors, phone: ''});
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">{t.message}</label>
          <textarea 
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-[40px] px-8 py-6 text-white focus:outline-none focus:border-luxury-gold transition-colors resize-none"
            placeholder="..."
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-luxury-gold text-luxury-blue py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[11px] lg:text-[12px] hover:bg-white hover:shadow-[0_0_50px_rgba(196,164,97,0.5)] transition-all flex items-center justify-center space-x-4"
          >
            {status === 'submitting' ? <span className="animate-pulse">...</span> : <span>{t.send}</span>}
          </button>
        </div>
      </form>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const VILLAS = getVillas(lang);
  const SERVICES = getServices(lang);
  const t = translations[lang].home;

  const renderView = () => {
    if (view.startsWith('villa-')) {
      const villaId = view.replace('villa-', '');
      const villa = VILLAS.find(v => v.id === villaId);
      if (villa) return <VillaDetailPage villa={villa} onNavigate={setView} lang={lang} />;
    }

    switch (view) {
      case 'services': return <ServicesPage onNavigate={setView} lang={lang} />;
      case 'photographer': return <PhotographerPage onNavigate={setView} lang={lang} />;
      case 'about': return <AboutPage onNavigate={setView} lang={lang} />;
      case 'blog': return <BlogPage onNavigate={setView} lang={lang} />;
      case 'valerie-detail': return <ValerieDetail onNavigate={setView} lang={lang} />;
      case 'francesca-detail': return <FrancescaDetail onNavigate={setView} lang={lang} />;
      case 'villas-holiday':
      case 'villas-longterm':
      case 'villas-sale':
        return <VillaListingPage category={view} onNavigate={setView} lang={lang} />;
      case 'service-villas': return <ServiceDetail serviceId="villas" onNavigate={setView} lang={lang} />;
      default:
        if (view.startsWith('service-')) {
          const id = view.replace('service-', '');
          return <ServiceDetail serviceId={id} onNavigate={setView} lang={lang} />;
        }
        return (
          <>
            <Hero onNavigate={setView} lang={lang} />
            
            <section id="explore-world" className="py-24 md:py-40 lg:py-60 xl:py-80 container mx-auto px-6 lg:px-12 scroll-mt-24">
              <div className="text-center max-w-5xl mx-auto mb-20 md:mb-32">
                <span className="text-luxury-gold uppercase tracking-[0.6em] text-[10px] md:text-xs font-bold block mb-8">{t.exploreTitle}</span>
                <h2 className="text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-white mb-10 leading-tight">{t.premiumTitle} <span className="italic text-gradient">{t.concierge}</span></h2>
                <p className="text-white/50 text-xl lg:text-2xl font-light leading-relaxed max-w-4xl mx-auto">
                  {t.exploreDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                {SERVICES.map((s, idx) => (
                  <div 
                    key={s.id}
                    onClick={() => setView(s.id === 'photographer' ? 'photographer' : `service-${s.id}`)}
                    className="group relative h-[500px] lg:h-[600px] rounded-[60px] lg:rounded-[80px] overflow-hidden cursor-pointer border border-white/5 transition-all duration-1000 hover:scale-[1.03] animate-slide-up"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110" alt={s.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue via-luxury-blue/40 to-transparent"></div>
                    <div className="absolute bottom-12 left-12 right-12">
                      <span className="text-5xl lg:text-6xl mb-6 block transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">{s.icon}</span>
                      <h3 className="text-3xl lg:text-4xl font-serif text-white mb-4 group-hover:text-luxury-gold transition-colors">{s.title}</h3>
                      <p className="text-white/60 text-base lg:text-lg font-light mb-8 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">{s.description}</p>
                      <button className="text-[10px] lg:text-[11px] uppercase tracking-[0.5em] font-bold text-luxury-gold border-b border-luxury-gold/40 pb-2 group-hover:border-luxury-gold">{t.discoverMore}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="vision" className="py-24 md:py-40 lg:py-60 xl:py-80 bg-luxury-slate/20">
              <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 xl:gap-48 items-center">
                <div className="space-y-16">
                  <div className="space-y-8">
                    <span className="text-luxury-gold uppercase tracking-[0.6em] text-xs font-bold block">{t.philosophy}</span>
                    <h2 className="text-4xl md:text-7xl lg:text-9xl xl:text-[10rem] font-serif leading-[1] text-white">{t.bespoke} <br/> <span className="italic text-gradient">{t.excellence}</span>.</h2>
                    <p className="text-white/70 text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-justify max-w-xl">
                      {t.philosophyDesc}
                    </p>
                  </div>
                  <button onClick={() => setView('about')} className="group flex items-center space-x-6 text-luxury-gold uppercase tracking-[0.4em] text-xs font-bold">
                    <span>{t.readStory}</span>
                    <div className="w-12 h-px bg-luxury-gold group-hover:w-24 transition-all duration-700"></div>
                  </button>
                </div>
                <div className="relative aspect-[4/5] rounded-[80px] overflow-hidden shadow-2xl border border-white/5 transform lg:rotate-2 xl:rotate-3 transition-transform duration-1000 hover:rotate-0">
                  <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Luxury" />
                  <div className="absolute inset-0 bg-luxury-gold/5 mix-blend-overlay"></div>
                </div>
              </div>
            </section>

            <section id="villas" className="py-24 md:py-40 lg:py-60 xl:py-80 border-y border-white/5 scroll-mt-24">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-4xl mb-24 lg:mb-32">
                  <span className="text-luxury-gold uppercase tracking-[0.6em] text-xs font-bold block mb-8">{t.selectedCollection}</span>
                  <h2 className="text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-serif mb-10 text-white">{t.signatureResidences}.</h2>
                  <p className="text-white/60 text-xl lg:text-2xl font-light">{t.residencesDesc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 lg:gap-14">
                  {VILLAS.slice(0, 3).map(villa => <VillaCard key={villa.id} villa={villa} onNavigate={setView} lang={lang} />)}
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
      <Navbar currentView={view} onNavigate={setView} lang={lang} onLanguageChange={setLang} />
      <main className="animate-fade-in">{renderView()}</main>
      <section id="contact" className="py-32 md:py-52 xl:py-64 bg-luxury-blue relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12 xl:max-w-[1600px] relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-start">
          <div className="space-y-16">
            <h2 className="text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] font-serif text-white leading-none tracking-tighter">THE KEY <br/><span className="text-luxury-gold">IBIZA</span></h2>
            <div className="space-y-8">
              <p className="text-[10px] lg:text-xs uppercase tracking-[0.8em] text-white/30 font-black">{translations[lang].contact.direct}</p>
              <a href="tel:+34660153207" className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white hover:text-luxury-gold transition-colors block tracking-tighter">+34 660 153 207</a>
              <a href="mailto:hello@thekey-ibiza.com" className="text-xl lg:text-2xl xl:text-3xl text-white/60 hover:text-white transition-colors block font-light tracking-widest">hello@thekey-ibiza.com</a>
            </div>
            
            <div className="flex space-x-12 pt-10">
               {['Instagram', 'WhatsApp', 'LinkedIn'].map(social => (
                 <a key={social} href="#" className="text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-luxury-gold transition-colors font-bold border-b border-transparent hover:border-luxury-gold pb-2">{social}</a>
               ))}
            </div>
          </div>
          <ContactForm lang={lang} />
        </div>
        {/* Abstract background detail */}
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px]"></div>
      </section>
      <footer className="py-24 bg-luxury-blue/90 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
           <div className="w-16 h-px bg-white/10 mx-auto mb-12"></div>
           <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.6em] text-white/20 font-bold">
             &copy; {new Date().getFullYear()} THE KEY IBIZA. EXCELLENCE & DISCRETION. ALL RIGHTS RESERVED.
           </p>
        </div>
      </footer>
      <AIConcierge lang={lang} />
    </div>
  );
};

export default App;
