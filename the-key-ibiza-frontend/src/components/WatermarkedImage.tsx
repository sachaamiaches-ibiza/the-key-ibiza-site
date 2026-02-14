import React, { useState, useEffect } from 'react';

// Key logo SVG inline for watermark
const WatermarkLogo = ({ className = "w-8 h-12", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <g>
      <circle cx="50" cy="35" r="32" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="50" cy="35" r="18" stroke="currentColor" strokeWidth="2.5" strokeDasharray="80 20" />
      <path d="M50 35V130" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 65H70" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 82H82" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 99H75" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 116H88" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 130H65" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </g>
  </svg>
);

interface WatermarkedImageProps {
  src: string;
  alt?: string;
  className?: string;
  watermarkSize?: 'small' | 'medium' | 'large' | 'gallery';
  fullBleed?: boolean;
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({
  src,
  alt = '',
  className = '',
  watermarkSize = 'large',
  fullBleed = false,
}) => {
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsVertical(img.height > img.width);
    };
    img.src = src;
  }, [src]);

  const sizeClasses = {
    small: {
      logo: 'w-6 h-9 md:w-8 md:h-12',
      text: 'text-[8px] md:text-xs tracking-[0.2em] mt-1 md:mt-2',
    },
    medium: {
      logo: 'w-10 h-14 md:w-16 md:h-22',
      text: 'text-xs md:text-sm tracking-[0.25em] mt-2',
    },
    large: {
      logo: 'w-16 h-22 md:w-32 md:h-44 lg:w-40 lg:h-56',
      text: 'text-base md:text-2xl lg:text-3xl tracking-[0.3em] mt-3 md:mt-4',
    },
    gallery: {
      logo: isVertical ? 'w-12 h-16 md:w-16 md:h-22' : 'w-16 h-22 md:w-24 md:h-32',
      text: isVertical ? 'text-sm md:text-base tracking-[0.2em] mt-2' : 'text-base md:text-xl tracking-[0.25em] mt-3',
    },
  };

  const sizes = sizeClasses[watermarkSize];

  const wrapperClass = fullBleed
    ? "relative w-full h-full"
    : "relative inline-flex items-center justify-center max-h-full max-w-full";

  return (
    <div className={wrapperClass}>
      <img src={src} alt={alt} className={className} />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10"
        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
      >
        <WatermarkLogo
          className={sizes.logo}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))' }}
        />
        <span
          className={`font-serif uppercase ${sizes.text}`}
          style={{ textShadow: '0 3px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.6)' }}
        >
          The Key Ibiza
        </span>
      </div>
    </div>
  );
};

export default WatermarkedImage;
