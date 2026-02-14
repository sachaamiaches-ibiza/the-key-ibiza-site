
import React, { useState, useEffect } from 'react';
import { LogoTheKey } from './Navbar';
import { Language } from '../types';

interface HeroProps {
  onNavigate: (view: any) => void;
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, lang }) => {
  const [circleTopVisible, setCircleTopVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [claimVisible, setClaimVisible] = useState(false);
  const [theKeyVisible, setTheKeyVisible] = useState(false);
  const [ibizaVisible, setIbizaVisible] = useState(false);
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [circleBottomVisible, setCircleBottomVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setCircleTopVisible(true), 300);
    setTimeout(() => setLogoVisible(true), 700);
    setTimeout(() => setClaimVisible(true), 1200);
    setTimeout(() => setTheKeyVisible(true), 1700);
    setTimeout(() => setIbizaVisible(true), 2200);
    setTimeout(() => setSecondaryVisible(true), 2700);
    setTimeout(() => setButtonsVisible(true), 3200);
    setTimeout(() => setCircleBottomVisible(true), 3700);
  }, []);

  return (
    <>
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#0B1C26', paddingTop: '100px' }}>

        <div className="absolute inset-0 z-0" style={{ backgroundColor: '#0B1C26' }}></div>

        <div
          className="absolute z-10 left-1/2 -translate-x-1/2 w-[700px] md:w-[900px] lg:w-[1100px] h-[700px] md:h-[900px] lg:h-[1100px] rounded-full pointer-events-none"
          style={{
            top: '-35%',
            background: 'radial-gradient(circle, rgba(201,178,124,0.18) 0%, rgba(201,178,124,0.12) 35%, rgba(201,178,124,0.05) 55%, transparent 65%)',
            filter: 'blur(60px)',
            opacity: circleTopVisible ? 1 : 0,
            transition: 'opacity 3s ease-out',
          }}
        ></div>

        <div
          className="absolute z-10 left-1/2 -translate-x-1/2 w-[700px] md:w-[900px] lg:w-[1100px] h-[700px] md:h-[900px] lg:h-[1100px] rounded-full pointer-events-none"
          style={{
            bottom: '-35%',
            background: 'radial-gradient(circle, rgba(201,178,124,0.18) 0%, rgba(201,178,124,0.12) 35%, rgba(201,178,124,0.05) 55%, transparent 65%)',
            filter: 'blur(60px)',
            opacity: circleBottomVisible ? 1 : 0,
            transition: 'opacity 3s ease-out',
          }}
        ></div>

        <div className="relative z-20 flex flex-col items-center justify-center px-6 w-full max-w-4xl mx-auto">

          <div
            className="mb-6"
            style={{
              opacity: logoVisible ? 1 : 0,
              transform: logoVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s ease-out, transform 2s ease-out',
            }}
          >
            <LogoTheKey className="w-8 h-12 md:w-10 md:h-14" color="#C9B27C" />
          </div>

          <div
            className="mb-8"
            style={{
              opacity: claimVisible ? 1 : 0,
              transform: claimVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s ease-out, transform 2s ease-out',
            }}
          >
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: '#C9B27C',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              The Ultimate Privilege Ibiza
            </span>
          </div>

          <div
            style={{
              opacity: theKeyVisible ? 1 : 0,
              transform: theKeyVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s ease-out, transform 2s ease-out',
            }}
          >
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none text-center"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                color: '#F5F3EE',
                letterSpacing: '-0.01em',
              }}
            >
              THE KEY
            </h1>
          </div>

          <div
            className="mt-2"
            style={{
              opacity: ibizaVisible ? 1 : 0,
              transform: ibizaVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s ease-out, transform 2s ease-out',
            }}
          >
            <span
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#C9B27C',
                letterSpacing: '0.15em',
              }}
            >
              Ibiza
            </span>
          </div>

          <div
            className="mt-12 max-w-lg text-center"
            style={{
              opacity: secondaryVisible ? 1 : 0,
              transform: secondaryVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s ease-out, transform 2s ease-out',
            }}
          >
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 300,
                letterSpacing: '0.02em',
              }}
            >
              Architects of bespoke stays and tailored experiences.<br />
              Your key to the hidden and the exceptional.
            </p>
          </div>

          <div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              opacity: buttonsVisible ? 1 : 0,
              transform: buttonsVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s ease-out, transform 2s ease-out',
            }}
          >
            <button
              onClick={() => onNavigate('services')}
              className="px-8 py-3.5 rounded-full"
              style={{
                backgroundColor: '#C4A461',
                color: '#0B1C26',
                border: '1px solid #C4A461',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0B1C26'; e.currentTarget.style.color = '#C4A461'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C4A461'; e.currentTarget.style.color = '#0B1C26'; }}
            >
              Explore Our World
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 rounded-full"
              style={{
                backgroundColor: '#0B1C26',
                color: '#C4A461',
                border: '1px solid #C4A461',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C4A461'; e.currentTarget.style.color = '#0B1C26'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0B1C26'; e.currentTarget.style.color = '#C4A461'; }}
            >
              Request A Service
            </button>
          </div>

        </div>

        <div
          className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          style={{
            opacity: buttonsVisible ? 0.35 : 0,
            transition: 'opacity 2s ease-out',
          }}
          onClick={() => document.getElementById('explore-world')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <svg className="w-5 h-5 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '2.5s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7"></path>
          </svg>
        </div>

      </section>
    </>
  );
};

export default Hero;
