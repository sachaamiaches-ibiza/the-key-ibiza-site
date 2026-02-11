import React from 'react';

// Key logo SVG inline for watermark
const WatermarkLogo = ({ className = "w-4 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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
  alt: string;
  className?: string;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'center';
  watermarkSize?: 'small' | 'medium' | 'large';
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({
  src,
  alt,
  className = '',
  watermarkPosition = 'bottom-right',
  watermarkSize = 'small',
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-3 right-3 md:bottom-4 md:right-4',
    'bottom-left': 'bottom-3 left-3 md:bottom-4 md:left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  const sizeClasses = {
    small: 'text-[8px] md:text-[10px]',
    medium: 'text-[10px] md:text-xs',
    large: 'text-xs md:text-sm',
  };

  const logoSizes = {
    small: 'w-3 h-4 md:w-4 md:h-5',
    medium: 'w-4 h-5 md:w-5 md:h-6',
    large: 'w-5 h-6 md:w-6 md:h-8',
  };

  return (
    <div className="relative w-full h-full">
      <img src={src} alt={alt} className={className} />
      <div
        className={`absolute ${positionClasses[watermarkPosition]} flex items-center gap-1 md:gap-1.5 pointer-events-none select-none z-20`}
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
        }}
      >
        <WatermarkLogo className={logoSizes[watermarkSize]} />
        <span
          className={`${sizeClasses[watermarkSize]} font-serif tracking-wider uppercase`}
          style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)' }}
        >
          The Key Ibiza
        </span>
      </div>
    </div>
  );
};

export default WatermarkedImage;
