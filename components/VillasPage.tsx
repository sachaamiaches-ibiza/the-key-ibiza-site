
import React from 'react';
import { Language } from '../types';
import FooterSEO from './FooterSEO';

interface VillasPageProps {
  onNavigate: (view: string) => void;
  lang: Language;
}

const villaCategories = [
  {
    id: 'villas-holiday',
    title: 'Holiday Rental',
    subtitle: 'Seasonal Escapes',
    description: 'Discover our curated collection of luxury villas available for weekly rentals. From modern architectural masterpieces to traditional Ibicencan fincas, each property offers an exclusive retreat with premium amenities, private pools, and breathtaking views. Perfect for unforgettable holidays in the Mediterranean paradise.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'villas-longterm',
    title: 'Long Term Rental',
    subtitle: 'Extended Stays',
    description: 'For those seeking an extended Ibiza experience, our long-term rental portfolio offers exceptional residences for monthly or yearly leases. Ideal for remote professionals, seasonal residents, or anyone wishing to immerse themselves in the island lifestyle with the comfort and privacy of a luxury home.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'villas-sale',
    title: 'Properties for Sale',
    subtitle: 'Investment Opportunities',
    description: 'Explore exclusive properties available for acquisition in Ibiza\'s most prestigious locations. From clifftop estates with panoramic sea views to private compounds in tranquil valleys, our sales portfolio represents the finest real estate opportunities on the island. Let us guide you through your investment journey.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
  },
];

const VillasPage: React.FC<VillasPageProps> = ({ onNavigate, lang }) => {
  return (
    <div className="pt-40 pb-12" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-6">
            Privilege Portfolio
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none mb-6">
            Luxury Villas
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto">
            Exceptional residences for every lifestyle
          </p>
        </div>

        {/* Zig-zag Categories */}
        <div className="space-y-24 md:space-y-32 mb-20">
          {villaCategories.map((category, index) => (
            <div
              key={category.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div
                  className="relative overflow-hidden rounded-[32px] group cursor-pointer"
                  onClick={() => onNavigate(category.id)}
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue/60 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Content */}
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                <span className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.4em] font-medium block mb-4">
                  {category.subtitle}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 italic">
                  {category.title}
                </h2>
                <div className="w-12 h-px bg-luxury-gold/30 mb-6"></div>
                <p className="text-white/50 text-sm md:text-base font-light leading-relaxed mb-8">
                  {category.description}
                </p>
                <button
                  onClick={() => onNavigate(category.id)}
                  className="px-8 py-3 rounded-full border border-luxury-gold/40 text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-luxury-gold hover:text-luxury-blue transition-all duration-500"
                >
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
        </div>

        <FooterSEO
          onNavigate={onNavigate}
          lang={lang}
          title="Ibiza's Premier Luxury Villa Collection"
          description="The Key Ibiza presents an unrivaled portfolio of exclusive properties across the island's most sought-after locations. From the dramatic cliffs of Es Cubells to the serene beaches of Cala Jondal, from the vibrant energy of Ibiza Town to the peaceful hills of San Juan, our collection spans every architectural style and lifestyle preference. Each property is personally vetted to ensure it meets our exacting standards of luxury, privacy, and excellence."
          links={[
            { label: "Yacht Charters", view: 'service-yacht' },
            { label: "VIP Services", view: 'services' },
            { label: "About Us", view: 'about' },
            { label: "Back to Home", view: 'home' }
          ]}
        />
      </div>
    </div>
  );
};

export default VillasPage;
