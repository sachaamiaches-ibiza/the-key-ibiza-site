import React, { useState } from 'react';

interface WishlistButtonProps {
  villaSlug: string;
  isInWishlist: boolean;
  onToggle: (villaSlug: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  villaSlug,
  isInWishlist,
  onToggle,
  size = 'md',
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Trigger animation on add
    if (!isInWishlist) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

    onToggle(villaSlug);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        transition-all duration-300
        ${isInWishlist
          ? 'bg-luxury-gold text-luxury-blue shadow-lg shadow-luxury-gold/30'
          : 'bg-black/40 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-black/60 hover:text-white'
        }
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={`${iconSizes[size]} transition-transform ${isAnimating ? 'scale-110' : ''}`}
        fill={isInWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={isInWishlist ? 0 : 2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default WishlistButton;
