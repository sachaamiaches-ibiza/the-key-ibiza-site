
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import FooterSEO from './FooterSEO';
import { fetchVillas } from '../services/villaService';

interface AboutPageProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, lang }) => {
  const [villaImages, setVillaImages] = useState<string[]>([]);

  // Fetch villa images for the about page sections
  useEffect(() => {
    fetchVillas().then(villas => {
      const images: string[] = [];
      // Get header images from different villas
      for (let i = 0; i < Math.min(3, villas.length); i++) {
        const villa = villas[i];
        if (villa?.headerImages && villa.headerImages.length > 0) {
          images.push(villa.headerImages[0]);
        } else if (villa?.imageUrl) {
          images.push(villa.imageUrl);
        }
      }
      if (images.length >= 2) {
        setVillaImages(images);
      }
    }).catch(err => console.error('Error fetching villa images:', err));
  }, []);

  return (
    <div className="pt-40 pb-12" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-6">
            Our Identity
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none mb-6">
            About Us
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto">
            The soul behind The Key Ibiza
          </p>
        </div>

        {/* Section 1 - Who We Are (Image Left) */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center mb-24 md:mb-32">
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-[32px] group">
              <img
                src={villaImages[0] || "https://images.unsplash.com/photo-1558384216-3694038a8341?auto=format&fit=crop&q=80&w=1200"}
                alt="Luxury Villa Ibiza"
                className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/60 via-transparent to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.4em] font-medium block mb-4">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6 italic">
              Who We Are
            </h2>
            <div className="w-12 h-px bg-luxury-gold/30 mb-6"></div>
            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed mb-4">
              At The Key Ibiza, we are more than a concierge service — we are a passionate collective of Ibiza residents, deeply connected to the island's soul and committed to curating extraordinary experiences.
            </p>
            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed">
              Our intimate knowledge of the island, combined with an unwavering commitment to excellence, allows us to unlock doors that remain closed to others.
            </p>
          </div>
        </div>

        {/* Section 2 - Legacy (Image Right) */}
        <div className="flex flex-col md:flex-row-reverse gap-10 md:gap-16 items-center mb-24 md:mb-32">
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-[32px] group">
              <img
                src="/la-villa-furniture.jpg"
                alt="La Villa Garden Design"
                className="w-full h-[300px] md:h-[450px] object-contain bg-[#0B1C26] transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/60 via-transparent to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pr-8">
            <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.4em] font-medium block mb-4">
              Our Heritage
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6 italic">
              The Legacy of La Villa
            </h2>
            <div className="w-12 h-px bg-luxury-gold/30 mb-6"></div>
            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed mb-4">
              Before bringing The Key Ibiza to life, we were proud to be part of <a href="https://www.lavillagardendesign.com/es/" target="_blank" rel="noopener noreferrer" className="text-luxury-gold italic hover:text-white transition-colors cursor-pointer">La Villa</a>, a cherished family-run business renowned across multiple regions for its expertise in high-end interior and exterior design.
            </p>
            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed">
              This foundational experience taught us the true value of craftsmanship, personalized service, and design excellence that we now bring to every client relationship.
            </p>
          </div>
        </div>

        {/* Section 3 - Vision (Image Left) */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center mb-24 md:mb-32">
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-[32px] group">
              <img
                src={villaImages[1] || villaImages[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200"}
                alt="Luxury Villa"
                className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/60 via-transparent to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.4em] font-medium block mb-4">
              Our Promise
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6 italic">
              Excellence & Discretion
            </h2>
            <div className="w-12 h-px bg-luxury-gold/30 mb-6"></div>
            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed mb-4">
              We understand that true luxury lies in the details — the anticipation of needs before they arise, the seamless orchestration of complex requests, and the preservation of privacy at every turn.
            </p>
            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed">
              Our commitment to discretion and excellence ensures that every experience we curate reflects the highest standards of sophisticated living.
            </p>
          </div>
        </div>

        {/* Founders Section */}
        <div className="mb-24 md:mb-32">
          <div className="text-center mb-16">
            <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.4em] font-medium block mb-4">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white italic">The Founders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-4xl mx-auto">
            {/* Founder 1 */}
            <div
              className="group cursor-pointer"
              onClick={() => onNavigate('valerie-detail')}
            >
              <div className="relative overflow-hidden rounded-[32px] mb-6">
                <div className="w-full h-[350px] md:h-[400px] bg-gradient-to-br from-luxury-slate to-luxury-blue flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <span className="text-luxury-gold text-6xl md:text-7xl font-serif italic opacity-30 group-hover:opacity-50 transition-opacity">SA</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue via-transparent to-transparent"></div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors">Sacha Amiach</h3>
                <p className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.3em] font-medium">Founder</p>
              </div>
            </div>

            {/* Founder 2 */}
            <div
              className="group cursor-pointer"
              onClick={() => onNavigate('francesca-detail')}
            >
              <div className="relative overflow-hidden rounded-[32px] mb-6">
                <div className="w-full h-[350px] md:h-[400px] bg-gradient-to-br from-luxury-slate to-luxury-blue flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <span className="text-luxury-gold text-6xl md:text-7xl font-serif italic opacity-30 group-hover:opacity-50 transition-opacity">AS</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue via-transparent to-transparent"></div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors">Angelina Stoycheva</h3>
                <p className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.3em] font-medium">Co-founder</p>
              </div>
            </div>
          </div>
        </div>

        <FooterSEO
          onNavigate={onNavigate}
          lang={lang}
          title="Our Identity & Vision"
          description="The essence of The Key Ibiza lies in our deep Mediterranean design heritage and meticulous attention to detail. With decades of experience in the luxury sector, we have forged an unparalleled network across the Balearic Islands. Our story is a promise of human authenticity, operational excellence, and absolute discretion. We are your trusted partner for discovering the most exclusive Ibiza."
          links={[
            { label: "Our Services", view: 'services' },
            { label: "Luxury Villas", view: 'service-villas' },
            { label: "Yacht Charters", view: 'service-yacht' },
            { label: "Back to Home", view: 'home' }
          ]}
        />
      </div>
    </div>
  );
};

export default AboutPage;
