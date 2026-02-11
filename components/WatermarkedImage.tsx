import React from 'react';

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
  alt: string;
  className?: string;
}

const WatermarkedImage: React.FC<WatermarkedImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  return (
    <div className="relative inline-block w-full h-full overflow-hidden">
      <img src={src} alt={alt} className={className} />
      {/* Watermark overlay - centered, larger, more visible */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10"
        style={{
          color: 'rgba(255, 255, 255, 0.65)',
        }}
      >
        <WatermarkLogo
          className="w-16 h-22 md:w-32 md:h-44 lg:w-40 lg:h-56"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
          }}
        />
        <span
          className="text-base md:text-2xl lg:text-3xl font-serif tracking-[0.3em] uppercase mt-3 md:mt-4"
          style={{
            textShadow: '0 3px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.6)',
          }}
        >
          The Key Ibiza
        </span>
      </div>
    </div>
  );
};

export default WatermarkedImage;
