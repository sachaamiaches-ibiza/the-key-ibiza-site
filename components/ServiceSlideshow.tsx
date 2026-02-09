
import React, { useState, useEffect } from 'react';
import { getServices } from '../constants';
import { Language } from '../types';

interface ServiceSlideshowProps {
  lang?: Language;
}

const ServiceSlideshow: React.FC<ServiceSlideshowProps> = ({ lang = 'en' }) => {
  const services = getServices(lang);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setDirection('next');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
        setIsVisible(true);
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, [services.length]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setIsVisible(false);
    setDirection(idx > currentIndex ? 'next' : 'prev');
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsVisible(true);
    }, 400);
  };

  const currentService = services[currentIndex];

  return (
    <section
      className="w-full py-24 md:py-32 lg:py-40 overflow-hidden"
      style={{ backgroundColor: '#0B1C26' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.5em',
              color: 'rgba(201,178,124,0.6)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Premium Concierge
          </span>
        </div>

        {/* Slideshow Container */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

          {/* Image Side */}
          <div className="relative w-full lg:w-1/2 max-w-xl">
            <div
              className="relative aspect-[4/5] rounded-[40px] lg:rounded-[60px] overflow-hidden border border-white/5"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'translateX(0)'
                  : direction === 'next' ? 'translateX(40px)' : 'translateX(-40px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
              <img
                src={currentService.imageUrl}
                alt={currentService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26] via-[#0B1C26]/30 to-transparent"></div>

              {/* Icon Overlay */}
              <div
                className="absolute bottom-8 left-8"
                style={{
                  fontSize: '48px',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s',
                }}
              >
                {currentService.icon}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 max-w-lg text-center lg:text-left">
            <div
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'translateX(0)'
                  : direction === 'next' ? 'translateX(30px)' : 'translateX(-30px)',
                transition: 'opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s',
              }}
            >
              <h3
                className="text-4xl md:text-5xl lg:text-6xl mb-6"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 400,
                  color: '#F5F3EE',
                  letterSpacing: '-0.01em',
                }}
              >
                {currentService.title}
              </h3>
              <p
                className="text-base md:text-lg mb-10 leading-relaxed"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 300,
                }}
              >
                {currentService.description}
              </p>
              <button
                className="inline-flex items-center gap-3 group"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: '#C9B27C',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                <span>Discover More</span>
                <span
                  className="w-8 h-px bg-[#C9B27C] group-hover:w-14 transition-all duration-500"
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-3 mt-16">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="transition-all duration-500"
              style={{
                width: idx === currentIndex ? '32px' : '16px',
                height: '2px',
                backgroundColor: idx === currentIndex ? '#C9B27C' : 'rgba(201,178,124,0.25)',
              }}
              aria-label={`Go to service ${idx + 1}`}
            />
          ))}
        </div>

        {/* Service Counter */}
        <div className="text-center mt-8">
          <span
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'rgba(201,178,124,0.4)',
            }}
          >
            {String(currentIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServiceSlideshow;
