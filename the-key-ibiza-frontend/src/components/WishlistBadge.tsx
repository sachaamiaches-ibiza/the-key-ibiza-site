import React from 'react';

interface WishlistBadgeProps {
  count: number;
  hasDates: boolean;
  onClick: () => void;
}

const WishlistBadge: React.FC<WishlistBadgeProps> = ({ count, hasDates, onClick }) => {
  // Show badge when there are items (dates needed only for sharing)
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`fixed top-32 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform animate-fadeIn ${
        hasDates
          ? 'bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-blue shadow-luxury-gold/30'
          : 'bg-white/10 backdrop-blur-md border border-luxury-gold/50 text-luxury-gold shadow-black/20'
      }`}
    >
      {/* Heart icon */}
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>

      {/* Label */}
      <span className="text-sm uppercase tracking-wider">My Selection</span>

      {/* Count badge */}
      <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-luxury-blue text-white text-xs font-bold">
        {count}
      </span>
    </button>
  );
};

export default WishlistBadge;
