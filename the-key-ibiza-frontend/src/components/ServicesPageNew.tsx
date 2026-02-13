
import React from 'react';
import { Language } from '../types';
import FooterSEO from './FooterSEO';
import { allServicesGrid } from './ServiceIcons';

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
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
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
  const scrollToService = (serviceId: string) => {
    const element = document.getElementById(`service-${serviceId}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

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
                onClick={() => scrollToService(service.id)}
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
                    onClick={() => onNavigate('contact')}
                    className="px-8 py-3 rounded-full bg-luxury-gold text-luxury-blue border border-luxury-gold text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-luxury-blue hover:text-luxury-gold transition-all duration-500"
                  >
                    Inquire Now
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
