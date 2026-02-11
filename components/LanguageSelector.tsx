
import React, { useState, useRef, useEffect } from 'react';
import { Language, languages } from '../types';

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'navbar' | 'fullscreen';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
  variant = 'navbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find(l => l.code === currentLang);

  if (variant === 'fullscreen') {
    // Full screen menu variant - dropdown opens UPWARD with solid background
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 text-white/60 hover:text-luxury-gold transition-colors"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold">{currentLang.toUpperCase()}</span>
          <span className="text-white/30">–</span>
          <span className="text-sm">{currentLanguage?.native}</span>
          <svg
            className={`w-4 h-4 opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeWidth="2"></path>
          </svg>
        </button>

        {/* Dropdown Menu - Opens UPWARD with solid background */}
        <div
          className={`absolute bottom-full left-0 mb-3 transition-all duration-300 z-50 ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div
            className="border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-[50vh] overflow-y-auto"
            style={{ minWidth: '220px', backgroundColor: '#0A0E14' }}
          >
            <div className="py-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left flex items-center justify-between transition-colors ${
                    currentLang === lang.code
                      ? 'bg-luxury-gold/20 text-luxury-gold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-xs uppercase tracking-wider font-semibold w-6">
                      {lang.code.toUpperCase()}
                    </span>
                    <span className="text-white/40">–</span>
                    <span className="text-sm">{lang.native}</span>
                  </span>
                  {currentLang === lang.code && (
                    <svg className="w-4 h-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Navbar dropdown variant
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white/60 hover:text-luxury-gold transition-colors text-xs uppercase tracking-[0.2em]"
      >
        <span>{currentLang.toUpperCase()}</span>
        <span className="text-white/30">–</span>
        <span className="normal-case tracking-normal">{currentLanguage?.native}</span>
        <svg
          className={`w-3 h-3 opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeWidth="2"></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 mt-4 transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div
          className="bg-luxury-blue/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          style={{ minWidth: '200px' }}
        >
          <div className="py-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-5 py-3 text-left flex items-center justify-between transition-colors ${
                  currentLang === lang.code
                    ? 'bg-luxury-gold/10 text-luxury-gold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-xs uppercase tracking-wider font-semibold w-6">
                    {lang.code.toUpperCase()}
                  </span>
                  <span className="text-white/30">–</span>
                  <span className="text-sm">{lang.native}</span>
                </span>
                {currentLang === lang.code && (
                  <svg className="w-4 h-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
