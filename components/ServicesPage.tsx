
import React from 'react';
import { getServices } from '../constants';
import { Language } from '../types';
import FooterSEO from './FooterSEO';

interface ServicesPageProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, lang }) => {
  const SERVICES = getServices(lang);

  return (
    <div className="pt-40 pb-24 container mx-auto px-6">
      <div className="mb-24 text-center max-w-4xl mx-auto">
        <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block mb-6 animate-slide-up">Private Concierge</span>
        <h1 className="text-5xl md:text-9xl font-serif text-white leading-none mb-10 animate-slide-up">Our World</h1>
        <p className="text-white/50 text-xl font-light leading-relaxed animate-fade-in">
          More than a concierge service, we are your lifestyle architects. Every service is orchestrated with absolute precision to redefine your Ibiza experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((s, idx) => (
          <div 
            key={s.id}
            onClick={() => onNavigate(s.id === 'photographer' ? 'photographer' : `service-${s.id}`)}
            className={`group p-12 luxury-card rounded-[60px] border border-white/5 hover:border-luxury-gold/30 transition-all duration-700 cursor-pointer relative overflow-hidden animate-slide-up`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-125 duration-700">
              {s.icon}
            </div>
            <span className="text-5xl mb-8 block">{s.icon}</span>
            <h3 className="text-3xl font-serif text-white mb-6 group-hover:text-luxury-gold transition-colors">{s.title}</h3>
            <p className="text-white/40 text-lg font-light leading-relaxed mb-10">{s.description}</p>
            <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold border-b border-luxury-gold pb-1 group-hover:pr-4 transition-all">
              Discover
            </button>
          </div>
        ))}
      </div>

      <FooterSEO 
        onNavigate={onNavigate} 
        lang={lang}
        title={lang === 'es' ? "Gestión de Estilo de Vida y Servicios VIP 360º en Ibiza" : "360º Lifestyle Management & VIP Services in Ibiza"}
        description={lang === 'es' ? 
          "Nuestra exclusiva gama de servicios de conserjería de élite en Ibiza ha sido diseñada para superar los estándares más exigentes del lujo contemporáneo internacional. Como especialistas en Lifestyle Management y gestión de experiencias VIP, coordinamos de forma integral cada aspecto de su estancia: desde el alquiler de yates de lujo y superyates para navegar las aguas de Formentera hasta la provisión de seguridad privada altamente cualificada con escoltas profesionales para su absoluta tranquilidad. Ofrecemos programas de bienestar holístico personalizados con terapeutas de renombre, servicios de catering gourmet con chefs privados de estrella Michelin y la organización integral de eventos exclusivos en las localizaciones más icónicas de la isla. The Key Ibiza es su llave maestra para acceder a lo inalcanzable, proporcionando soluciones logísticas de primer nivel como traslados VIP con chófer, cuidado infantil de confianza (babysitting premium) y entregas de lujo personalizadas a su villa. Nuestra extensa red de proveedores locales garantiza una ejecución impecable y discreción absoluta para que usted pueda disfrutar plenamente de la esencia más privada del Mediterráneo." : 
          "Our exclusive range of elite concierge services in Ibiza has been meticulously designed to exceed the most demanding standards of international contemporary luxury. As specialists in Lifestyle Management and VIP experience coordination, we comprehensively manage every aspect of your stay: from luxury yacht and superyacht charters for navigating the crystal waters of Formentera to the provision of highly qualified private security with professional escorts for your absolute peace of mind. We offer personalized holistic wellness programs with renowned therapists, gourmet catering services with Michelin-starred private chefs, and the full organization of exclusive events at the island's most iconic locations. The Key Ibiza is your master key to accessing the unattainable, providing top-tier logistical solutions such as VIP chauffeur transfers, trusted premium childcare (babysitting), and personalized luxury deliveries to your villa. Our extensive network of local providers ensures flawless execution and absolute discretion so you can fully enjoy the most private essence of the Mediterranean."}
        links={[
          { label: "Exclusive Villa Collection", view: 'villas-holiday' },
          { label: "Yacht Charters & Superyachts", view: 'service-yacht' },
          { label: "Private VIP Security", view: 'service-security' },
          { label: "Wellness & Retreat Programs", view: 'service-wellness' },
          { label: "The Key Brand Story", view: 'about' },
          { label: "Our Lifestyle Blog", view: 'blog' }
        ]}
      />
    </div>
  );
};

export default ServicesPage;
