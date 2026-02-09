
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import LanguageSelector from './LanguageSelector';

export const LogoTheKey = ({ className = "w-8 h-8", color = "#C4A461" }) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <circle cx="50" cy="35" r="32" stroke={color} strokeWidth="3.5" />
      <circle cx="50" cy="35" r="18" stroke={color} strokeWidth="2.5" strokeDasharray="80 20" />
      <path d="M50 35V130" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M50 65H70" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M50 82H82" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M50 99H75" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M50 116H88" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M50 130H65" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </g>
  </svg>
);

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, lang, onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (target: string, isView: boolean = false) => {
    if (isView) {
      onNavigate(target);
    } else {
      if (currentView !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById(target);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
    setExpandedSection(null);
  };

  const menuItems = [
    { label: t.welcome, target: 'home', isView: true, img: 'https://images.unsplash.com/photo-1558384216-3694038a8341?auto=format&fit=crop&q=80&w=1200' },
    { 
      label: t.villas, 
      target: 'service-villas', 
      isView: true, 
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      subItems: [
        { label: t.holiday, target: 'villas-holiday' },
        { label: t.longterm, target: 'villas-longterm' },
        { label: t.sale, target: 'villas-sale' }
      ]
    },
    {
      label: t.boats,
      target: 'service-yacht',
      isView: true,
      img: 'https://images.unsplash.com/photo-1567899378494-47b22a2bb96a?auto=format&fit=crop&q=80&w=1200',
      subItems: [
        { label: 'Yates', target: 'boats-yachts' },
        { label: 'Catamaranes', target: 'boats-catamarans' }
      ]
    },
    { 
      label: t.services, 
      target: 'services', 
      isView: true, 
      img: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80&w=1200',
      subItems: [
        { label: 'Personalized events', target: 'service-events' },
        { label: 'Night life', target: 'service-nightlife' },
        { label: 'Catering & Bottle service', target: 'service-catering' },
        { label: 'Furniture', target: 'service-furniture' },
        { label: 'Health & Beauty program', target: 'service-health' },
        { label: 'Yoga & Personal growth', target: 'service-yoga' },
        { label: 'Professional photographer', target: 'photographer' },
        { label: 'Security services', target: 'service-security' },
        { label: 'Cleaning services', target: 'service-cleaning' },
        { label: 'Driver services', target: 'service-driver' },
        { label: 'Deliveries', target: 'service-deliveries' },
        { label: 'Babysitting', target: 'service-babysitting' }
      ]
    },
    { label: t.blog, target: 'blog', isView: true, img: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=1200' },
    { label: t.about, target: 'about', isView: true, img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200' },
    { label: t.contact, target: 'contact', isView: false, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200' },
  ];

  return (
    <>
      {/* Navbar Wrapper - positioned below top gold bar */}
      <div className="fixed left-0 w-full z-[60]" style={{ top: '23px' }}>
        {/* Navbar Content + Golden Line Container */}
        <div
          className={`w-full transition-all duration-500`}
          style={{
            backgroundColor: isScrolled ? 'rgba(8, 20, 28, 1)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(12px)' : 'none',
            borderBottom: isScrolled ? '1px solid rgba(201,178,124,0.3)' : 'none',
          }}
        >
          <nav className={`w-full ${isScrolled ? 'py-3 md:py-4' : 'py-6 md:py-8'}`}>
          <div className="container mx-auto px-6 flex justify-between items-center">
            <div
              className="flex items-center space-x-4 md:space-x-5 cursor-pointer group"
              onClick={() => handleNavClick('home', true)}
            >
            <LogoTheKey className="w-10 h-16 md:w-12 md:h-20 transition-all group-hover:scale-105 duration-700" color="#C9B27C" />
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl tracking-[0.25em] leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, color: '#C9B27C' }}>
                THE KEY
              </span>
              <span className="text-xs md:text-sm tracking-[0.3em] mt-0.5" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, fontStyle: 'italic', color: 'rgba(201,178,124,0.7)' }}>
                Ibiza
              </span>
            </div>
          </div>
          
          <div className="hidden lg:flex space-x-6 items-center text-xs uppercase tracking-[0.3em] font-semibold text-white/40">
            {menuItems.slice(0, 6).map((item) => (
              <div key={item.label} className="relative group/item">
                <button 
                  onClick={() => handleNavClick(item.target, item.isView)} 
                  className={`${currentView === item.target || (item.subItems && item.subItems.some(s => currentView === s.target)) ? 'text-luxury-gold border-b border-luxury-gold/30' : ''} hover:text-luxury-gold transition-all pb-1 flex items-center space-x-1.5`}
                >
                  <span>{item.label}</span>
                  {item.subItems && (
                    <svg className="w-2.5 h-2.5 opacity-40 group-hover/item:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"></path></svg>
                  )}
                </button>
                
                {item.subItems && (
                  <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:pointer-events-auto transition-all duration-300">
                    <div className="bg-luxury-blue/95 backdrop-blur-xl border border-white/5 p-6 rounded-[24px] shadow-2xl min-w-[280px]">
                      <div className="grid grid-cols-1 gap-y-3.5">
                        {item.subItems.map(sub => (
                          <button 
                            key={sub.label}
                            onClick={() => handleNavClick(sub.target, true)}
                            className="text-left hover:text-luxury-gold transition-colors whitespace-nowrap text-white/60 hover:text-white text-xs tracking-wider"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Language Selector */}
            <div className="border-l border-white/10 pl-6">
              <LanguageSelector
                currentLang={lang}
                onLanguageChange={onLanguageChange}
                variant="navbar"
              />
            </div>

            <button
              onClick={() => handleNavClick('contact')}
              className="border border-luxury-gold/40 text-luxury-gold px-5 py-1.5 rounded-full hover:border-luxury-gold hover:bg-luxury-gold/5 transition-all font-normal tracking-[0.2em] uppercase text-[9px] ml-2"
            >
              {t.contact}
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(true)} className="p-2 text-luxury-gold hover:scale-110 transition-transform focus:outline-none">
            <svg className="w-8 h-8 md:w-9 md:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16"></path>
            </svg>
          </button>
          </div>
        </nav>
        </div>
      </div>

      {/* Full screen menu */}
      <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-luxury-blue/98 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)}></div>
        
        <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000 overflow-hidden">
          {menuItems.map((item) => (
            <img
              key={item.label}
              src={item.img}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${hoveredItem === item.label ? 'opacity-15 scale-105' : 'opacity-0 scale-100'}`}
              alt=""
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-blue via-transparent to-luxury-blue"></div>
        </div>

        <div className={`relative z-10 h-full w-full flex flex-col justify-start items-center md:items-start px-8 md:pl-24 pt-10 transition-transform duration-700 ${isMenuOpen ? 'translate-y-0' : 'translate-y-10'}`}>
          
          {/* Header of Full Screen Menu */}
          <div className="w-full flex justify-between items-center mb-10 max-w-7xl mx-auto">
             {/* Language Selection - All 10 languages */}
            <LanguageSelector
              currentLang={lang}
              onLanguageChange={onLanguageChange}
              variant="fullscreen"
            />

            <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-luxury-gold transition-colors p-2 focus:outline-none">
              <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="1"></path></svg>
            </button>
          </div>

          <div className="flex flex-col space-y-4 md:space-y-6 w-full max-w-4xl max-h-[60vh] overflow-y-auto no-scrollbar py-6">
            {menuItems.map((item, idx) => (
              <div key={item.label} className="flex flex-col items-center md:items-start">
                <button 
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    if(item.subItems) {
                      setExpandedSection(expandedSection === item.label ? null : item.label);
                    } else {
                      handleNavClick(item.target, item.isView);
                    }
                  }} 
                  className="group relative flex items-center md:items-baseline text-3xl sm:text-4xl md:text-7xl font-serif text-white/40 hover:text-white transition-all text-left"
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <span className={`italic transition-all duration-500 block ${hoveredItem === item.label || expandedSection === item.label ? 'translate-x-4 md:translate-x-8 text-luxury-gold' : ''}`}>
                    {item.label}
                  </span>
                  {item.subItems && (
                    <span className={`ml-4 text-xs md:text-xl transition-transform duration-500 ${expandedSection === item.label ? 'rotate-180' : ''}`}>
                      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="1"></path></svg>
                    </span>
                  )}
                </button>
                
                {item.subItems && (
                  <div className={`flex flex-col items-center md:items-start space-y-3 md:space-y-4 md:pl-20 overflow-hidden transition-all duration-700 ${expandedSection === item.label ? 'max-h-[600px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.subItems.map(sub => (
                      <button 
                        key={sub.label}
                        onClick={() => handleNavClick(sub.target, true)}
                        className="text-center md:text-left text-lg sm:text-xl md:text-3xl font-serif text-white/30 hover:text-luxury-gold transition-colors italic"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pb-10 flex flex-col md:flex-row items-center md:items-end md:justify-between w-full max-w-4xl border-t border-white/5 pt-10">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <p className="text-[9px] uppercase tracking-[0.5em] text-luxury-gold font-bold mb-4 opacity-60">{t.curating}</p>
              <a href="tel:+34660153207" className="text-lg text-white/30 hover:text-white transition-colors tracking-widest font-light">+34 660 153 207</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
