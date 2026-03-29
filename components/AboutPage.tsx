
import React from 'react';
import { Language } from '../types';
import FooterSEO from './FooterSEO';

interface AboutPageProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, lang }) => {
  return (
    <div className="pt-40 pb-24">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 text-white/40 hover:text-luxury-gold transition-colors mb-20 uppercase tracking-widest text-[10px] font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Back to Home</span>
        </button>

        <div className="max-w-4xl mb-24 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block mb-6">Our Identity</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight mb-8">
            Who We Are — <br/> <span className="italic text-white/50">The Soul Behind The Key Ibiza.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed text-justify">
            At The Key Ibiza, we are more than a concierge service — we are a passionate collective of Ibiza residents, deeply connected to the island’s soul and committed to curating extraordinary experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center animate-fade-in">
          <div className="space-y-8 text-lg font-light leading-relaxed text-white/70 text-justify">
            <h3 className="text-3xl font-serif text-white mb-6">The Legacy of La Villa</h3>
            <p>
              Before bringing The Key Ibiza to life, we were proud to be part of <span className="text-white font-medium italic">La Villa</span>, a cherished family-run business renowned across multiple regions for its expertise in high-end interior and exterior design.
            </p>
            <p>
              This foundational experience taught us the true value of craftsmanship, personalized service, and design excellence.
            </p>
          </div>
          <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border border-white/5 group">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Ibiza Heritage"
            />
          </div>
        </div>

        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Leadership</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white">The Founders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="luxury-card p-12 rounded-[60px] text-center space-y-6 hover:border-luxury-gold/40 transition-all group">
               <div className="w-32 h-32 mx-auto rounded-full bg-luxury-slate flex items-center justify-center text-luxury-gold text-3xl font-serif italic border-2 border-luxury-gold/20 group-hover:border-luxury-gold transition-all">SA</div>
               <div>
                  <h4 className="text-2xl font-serif text-white mb-1">Sacha Amiach</h4>
                  <p className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold">Founder</p>
               </div>
            </div>
            <div className="luxury-card p-12 rounded-[60px] text-center space-y-6 hover:border-luxury-gold/40 transition-all group">
               <div className="w-32 h-32 mx-auto rounded-full bg-luxury-slate flex items-center justify-center text-luxury-gold text-3xl font-serif italic border-2 border-luxury-gold/20 group-hover:border-luxury-gold transition-all">AS</div>
               <div>
                  <h4 className="text-2xl font-serif text-white mb-1">Angelina Stoycheva</h4>
                  <p className="text-luxury-gold uppercase tracking-widest text-[10px] font-bold">Co-founder</p>
               </div>
            </div>
          </div>
        </div>

        <FooterSEO 
          onNavigate={onNavigate} 
          lang={lang}
          title={lang === 'es' ? "Nuestra Identidad y Visión: La Esencia de The Key Ibiza" : "Our Identity & Vision: The Essence of The Key Ibiza"}
          description={lang === 'es' ? 
            "La esencia de The Key Ibiza reside en nuestra herencia profunda de diseño mediterráneo y una atención meticulosa al detalle que solo años de experiencia pueden otorgar. Con una trayectoria consolidada en el sector del lujo tras nuestra etapa fundacional en 'La Villa', hemos forjado una red de contactos inigualable en las Islas Baleares, lo que nos permite ofrecer un acceso privilegiado a lo inalcanzable. Nuestra historia no es solo sobre servicios de conserjería; es una promesa de autenticidad humana, excelencia operativa y discreción absoluta. Entendemos el lujo como la intersección perfecta entre el confort absoluto y el respeto profundo por la cultura local de Ibiza. Como curadores de experiencias y gestores de estilo de vida, seleccionamos personalmente cada villa, yate y proveedor para garantizar que cada estancia sea una obra maestra del estilo de vida contemporáneo. Respaldados por décadas de conocimiento experto sobre el terreno y una pasión inquebrantable por la hospitalidad VIP, somos su socio de confianza para descubrir la Ibiza más secreta y exclusiva." : 
            "The essence of The Key Ibiza lies in our deep Mediterranean design heritage and a meticulous attention to detail that only years of experience can provide. With a consolidated track record in the luxury sector following our foundational stage at 'La Villa', we have forged an unparalleled network of contacts in the Balearic Islands, allowing us to offer privileged access to the unattainable. Our story is not just about concierge services; it is a promise of human authenticity, operational excellence, and absolute discretion. We understand luxury as the perfect intersection between absolute comfort and deep respect for Ibiza's local culture. As experience curators and lifestyle managers, we personally select every villa, yacht, and provider to ensure that each stay is a masterpiece of contemporary lifestyle. Backed by decades of expert on-the-ground knowledge and an unwavering passion for VIP hospitality, we are your trusted partner for discovering the most secret and exclusive Ibiza."}
          links={[
            { label: "Our VIP Services", view: 'services' },
            { label: "Luxury Villa Collection", view: 'villas-holiday' },
            { label: "Wellness Visionary", view: 'service-wellness' },
            { label: "Insights Blog", view: 'blog' },
            { label: "Ibiza Real Estate Market", view: 'villas-sale' }
          ]}
        />
      </div>
    </div>
  );
};

export default AboutPage;
