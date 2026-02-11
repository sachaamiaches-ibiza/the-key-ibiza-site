import React from 'react';

// Key logo SVG inline for watermark
const WatermarkLogo = ({ className = "w-8 h-12" }: { className?: string }) => (
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
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  return (
    <div className="relative inline-block w-full h-full">
      <img src={src} alt={alt} className={className} />
      {/* Watermark overlay - centered and attached to image */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
        style={{
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <WatermarkLogo className="w-10 h-14 md:w-20 md:h-28 drop-shadow-lg" />
        <span
          className="text-sm md:text-xl font-serif tracking-[0.3em] uppercase mt-2 md:mt-3"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          The Key Ibiza
        </span>
      </div>
    </div>
  );
};

export default WatermarkedImage;
