import React, { useState, useEffect, useRef } from 'react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "James W.",
    location: "New York, USA",
    quote: "This was our third summer with The Key. Our original villa had a plumbing issue 3 days before we flew in. Sacha called me at 11pm his time with two alternatives. We ended up in a better place for the same price. That's why we keep coming back."
  },
  {
    id: 2,
    name: "Elodie R.",
    location: "Paris, France",
    quote: "J'avais des doutes sur Ibiza, je pensais que c'était que la fête. Sacha m'a trouvé une villa dans le nord, calme total, vue sur mer. Mes enfants parlent encore du chef qui leur a appris à faire des pizzas. On revient cet été."
  },
  {
    id: 3,
    name: "Oliver & Emma T.",
    location: "London, UK",
    quote: "Small thing but it meant everything — we booked a sunset yacht for our anniversary. When we got on board, our wedding song was playing. We never told anyone. Somehow they knew. Still no idea how."
  },
  {
    id: 4,
    name: "Dimitri K.",
    location: "Prague, Czech Republic",
    quote: "I manage vacation rentals. I know how this industry works. Most agencies ghost you after booking. Sacha texted me at 2am because our taxi didn't show. He wasn't even on duty. Different level."
  },
  {
    id: 5,
    name: "Tim D.",
    location: "Sydney, Australia",
    quote: "Flew 22 hours to get to Ibiza. Landed exhausted. Car was waiting, fridge stocked, AC on, playlist ready. I dropped my bags and walked straight into the pool. Didn't move for 3 days. Perfect."
  },
  {
    id: 6,
    name: "Sophie M.",
    location: "Montreal, Canada",
    quote: "Asked if they could get a private chef for my husband's birthday. Didn't expect much on short notice. They got a guy from a Michelin restaurant in Barcelona. My husband cried. Actual tears. Over paella."
  },
  {
    id: 7,
    name: "Eden M.",
    location: "Tel Aviv, Israel",
    quote: "Traveled with 12 people for a friend's wedding week. The team handled everything — airport pickups, villa setup, day trips, restaurants for a big group. Not one complaint. And trust me, this group complains about everything."
  },
  {
    id: 8,
    name: "Albert K.",
    location: "Zürich, Switzerland",
    quote: "I'm not easy to impress. I work in finance, I notice details. The Key's level of organisation is what I'd expect from a Swiss bank. Precise, quiet, no drama. Exactly what a vacation should be."
  },
  {
    id: 9,
    name: "Anna S.",
    location: "Warsaw, Poland",
    quote: "The villa was beautiful yes, but honestly? The best part was my brain being completely off for 10 days. Fridge was full when we arrived. Restaurant bookings just appeared in my inbox. I didn't plan a single thing."
  },
  {
    id: 10,
    name: "Pearl J.",
    location: "Cape Town, South Africa",
    quote: "First time in Europe, didn't know what to expect. Sacha's team made it effortless. They even remembered my husband is vegan without me asking twice. It's the small things."
  },
  {
    id: 11,
    name: "Marcus J.",
    location: "Santa Monica, USA",
    quote: "Done the whole Ibiza thing before with other services. Lot of promises, lot of upselling. Sacha was the opposite. Told me one villa wasn't worth the price and suggested somewhere else. Respect."
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  // Inject Review Schema for SEO
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "The Key Ibiza",
      "description": "Luxury concierge services, villa rentals and yacht charters in Ibiza",
      "url": "https://thekey-ibiza.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ibiza",
        "addressCountry": "ES"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "ratingCount": testimonials.length.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": testimonials.map(t => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": t.name
        },
        "reviewBody": t.quote,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }))
    };

    const scriptId = 'reviews-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (!isAutoplay) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isAutoplay]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      goTo((currentIndex + 1) % testimonials.length);
    } else if (diff < -50) {
      goTo(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    }
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] font-medium block mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonial Card */}
        <div
          className="max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16">
            {/* Quote Icon */}
            <div className="absolute top-6 left-8 md:top-10 md:left-12">
              <svg className="w-10 h-10 md:w-14 md:h-14 text-luxury-gold/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Quote Text */}
            <div className="pt-8 md:pt-6">
              <p className="text-white/80 text-lg md:text-xl lg:text-2xl font-serif italic leading-relaxed mb-8 md:mb-10">
                "{current.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  <span className="text-luxury-gold font-serif text-lg">
                    {current.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{current.name}</p>
                  <p className="text-white/40 text-sm">{current.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-luxury-gold w-8'
                    : 'bg-white/20 w-2 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrow Navigation - Desktop only */}
          <div className="hidden md:flex justify-center gap-4 mt-6">
            <button
              onClick={() => goTo(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-luxury-gold hover:text-luxury-gold transition-all"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo((currentIndex + 1) % testimonials.length)}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-luxury-gold hover:text-luxury-gold transition-all"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
