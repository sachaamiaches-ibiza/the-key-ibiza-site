import React from 'react';

interface WishlistBadgeProps {
  count: number;
  hasDates: boolean;
  onClick: () => void;
}

const WishlistBadge: React.FC<WishlistBadgeProps> = ({ count, hasDates, onClick }) => {
  // Only show badge when there are items AND dates are selected
  if (count === 0 || !hasDates) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-blue font-semibold shadow-xl shadow-luxury-gold/30 hover:scale-105 transition-transform animate-fadeIn"
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
