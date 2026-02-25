
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import FooterSEO from './FooterSEO';

// Auto-detect environment
const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

interface BoatsPageProps {
  onNavigate: (view: string) => void;
  lang: Language;
}

const BoatsPage: React.FC<BoatsPageProps> = ({ onNavigate, lang }) => {
  const [darkKnightVideo, setDarkKnightVideo] = useState<string | null>(null);

  // Fetch Dark Knight video from Cloudinary
  useEffect(() => {
    const fetchDarkKnightMedia = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/cloudinary/images?folder=${encodeURIComponent('Yates/Dark Knight/Header')}`);
        if (res.ok) {
          const data = await res.json();
          const videos = (data.images || []).filter((url: string) =>
            url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.webm') || url.toLowerCase().includes('/video/')
          );
          if (videos.length > 0) {
            setDarkKnightVideo(videos[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching Dark Knight media:', error);
      }
    };
    fetchDarkKnightMedia();
  }, []);

  const boatCategories = [
    {
      id: 'yachts',
      title: 'Yates',
      subtitle: 'Luxury Yachts',
      description: 'Experience the Mediterranean in unparalleled style aboard our exclusive selection of luxury yachts. From intimate day charters to week-long adventures, our fleet offers the ultimate in privacy, comfort, and sophistication. Each vessel comes with experienced crew, ensuring an impeccable journey through the crystal waters of Ibiza and Formentera.',
      video: darkKnightVideo,
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2bb96a?auto=format&fit=crop&q=80&w=1200',
      view: 'boats-yachts',
    },
    {
      id: 'catamarans',
      title: 'Catamaranes',
      subtitle: 'Premium Catamarans',
      description: 'Discover the freedom of sailing with our premium catamaran collection. Perfect for groups and families, these spacious vessels offer stability, comfort, and elegance. Enjoy panoramic views from multiple decks, swim in secluded coves, and create unforgettable memories as you explore the Balearic coastline in absolute luxury.',
      video: null,
      image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=1200',
      view: 'boats-catamarans',
    },
  ];
  return (
    <div className="pt-40 pb-12" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold block italic mb-6">
            Maritime Excellence
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none mb-6">
            Yachts & Charters
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto">
            Explore the Balearic waters in absolute luxury
          </p>
        </div>

        {/* Zig-zag Categories */}
        <div className="space-y-24 md:space-y-32 mb-20">
          {boatCategories.map((category, index) => (
            <div
              key={category.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center`}
            >
              {/* Image/Video */}
              <div className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-[32px] group">
                  {category.video ? (
                    <video
                      src={category.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
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
                  onClick={() => onNavigate(category.view)}
                  className="px-8 py-3 rounded-full bg-luxury-gold text-luxury-blue border border-luxury-gold text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-luxury-blue hover:text-luxury-gold transition-all duration-500"
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
          title="Luxury Yacht Charters in Ibiza & Formentera"
          description="The Key Ibiza offers an exceptional fleet of luxury yachts and catamarans for private charter. Whether you're planning a sunset cruise, a day trip to Formentera's pristine beaches, or an extended voyage through the Balearic Islands, our maritime concierge service ensures every detail is perfected. From gourmet catering to water sports equipment, we curate bespoke experiences on the Mediterranean's most beautiful waters."
          links={[
            { label: "Luxury Villas", view: 'villas-holiday' },
            { label: "VIP Services", view: 'services' },
            { label: "Contact Us", view: 'contact' },
            { label: "Back to Home", view: 'home' }
          ]}
        />
      </div>
    </div>
  );
};

export default BoatsPage;
