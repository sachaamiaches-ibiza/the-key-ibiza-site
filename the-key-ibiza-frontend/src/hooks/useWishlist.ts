import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'thekey-wishlist';

export interface WishlistState {
  villaSlugs: string[];
  checkIn: string;
  checkOut: string;
}

interface UseWishlistReturn {
  wishlist: WishlistState;
  addVilla: (villaSlug: string) => void;
  removeVilla: (villaSlug: string) => void;
  toggleVilla: (villaSlug: string) => void;
  isInWishlist: (villaSlug: string) => boolean;
  setDates: (checkIn: string, checkOut: string) => void;
  clearWishlist: () => void;
  count: number;
  hasDates: boolean;
  isReady: boolean; // True when dates are set and at least one villa is selected
}

const getInitialState = (): WishlistState => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load wishlist from sessionStorage:', e);
  }
  return { villaSlugs: [], checkIn: '', checkOut: '' };
};

export function useWishlist(): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<WishlistState>(getInitialState);

  // Persist to sessionStorage whenever wishlist changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to sessionStorage:', e);
    }
  }, [wishlist]);

  const addVilla = useCallback((villaSlug: string) => {
    setWishlist(prev => {
      if (prev.villaSlugs.includes(villaSlug)) return prev;
      return { ...prev, villaSlugs: [...prev.villaSlugs, villaSlug] };
    });
  }, []);

  const removeVilla = useCallback((villaSlug: string) => {
    setWishlist(prev => ({
      ...prev,
      villaSlugs: prev.villaSlugs.filter(slug => slug !== villaSlug),
    }));
  }, []);

  const toggleVilla = useCallback((villaSlug: string) => {
    setWishlist(prev => {
      if (prev.villaSlugs.includes(villaSlug)) {
        return { ...prev, villaSlugs: prev.villaSlugs.filter(slug => slug !== villaSlug) };
      }
      return { ...prev, villaSlugs: [...prev.villaSlugs, villaSlug] };
    });
  }, []);

  const isInWishlist = useCallback((villaSlug: string) => {
    return wishlist.villaSlugs.includes(villaSlug);
  }, [wishlist.villaSlugs]);

  const setDates = useCallback((checkIn: string, checkOut: string) => {
    setWishlist(prev => ({ ...prev, checkIn, checkOut }));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist({ villaSlugs: [], checkIn: '', checkOut: '' });
  }, []);

  const count = wishlist.villaSlugs.length;
  const hasDates = !!(wishlist.checkIn && wishlist.checkOut);
  const isReady = count > 0 && hasDates;

  return {
    wishlist,
    addVilla,
    removeVilla,
    toggleVilla,
    isInWishlist,
    setDates,
    clearWishlist,
    count,
    hasDates,
    isReady,
  };
}
