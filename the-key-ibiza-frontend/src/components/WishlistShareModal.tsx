import React, { useState, useEffect } from 'react';
import { createWishlist } from '../services/wishlistService';

interface WishlistShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  villaSlugs: string[];
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  villaCount: number;
}

const WishlistShareModal: React.FC<WishlistShareModalProps> = ({
  isOpen,
  onClose,
  villaSlugs,
  checkIn,
  checkOut,
  totalPrice,
  villaCount,
}) => {
  const [showPrices, setShowPrices] = useState(true);
  const [creatorName, setCreatorName] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShareUrl('');
      setCopied(false);
      setError('');
      setShowPrices(true);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCreateLink = async () => {
    setIsCreating(true);
    setError('');

    try {
      const result = await createWishlist({
        villaSlugs,
        checkIn,
        checkOut,
        showPrices,
        createdByName: creatorName || undefined,
        notes: notes || undefined,
      });

      setShareUrl(result.shareUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const text = `Check out my villa selection for ${new Date(checkIn).toLocaleDateString('en-GB')} - ${new Date(checkOut).toLocaleDateString('en-GB')}:\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = 'My Ibiza Villa Selection';
    const body = `Hi,\n\nI've selected some villas for our trip (${new Date(checkIn).toLocaleDateString('en-GB')} - ${new Date(checkOut).toLocaleDateString('en-GB')}).\n\nView the selection here: ${shareUrl}\n\nBest regards`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#0B1C26] to-[#0a1419] rounded-3xl border border-luxury-gold/20 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-luxury-gold transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-2xl font-serif text-white mb-1">Share Your Selection</h2>
          <p className="text-white/50 text-sm">
            {villaCount} villa{villaCount !== 1 ? 's' : ''} for {new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Show prices toggle */}
          {!shareUrl && (
            <>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-white font-medium">Show prices</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {showPrices ? `Total: €${totalPrice.toLocaleString()}` : 'Prices will be hidden'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPrices(!showPrices)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    showPrices ? 'bg-luxury-gold' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                      showPrices ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Optional name */}
              <div>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={creatorName}
                  onChange={e => setCreatorName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold/50 transition-colors"
                />
              </div>

              {/* Optional notes */}
              <div>
                <textarea
                  placeholder="Add a note (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold/50 transition-colors resize-none"
                />
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateLink}
                disabled={isCreating}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-luxury-gold to-amber-500 text-luxury-blue font-semibold uppercase tracking-wider text-sm hover:from-amber-500 hover:to-luxury-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-luxury-blue/30 border-t-luxury-blue rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Generate Link
                  </>
                )}
              </button>
            </>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Share options (shown after link is created) */}
          {shareUrl && (
            <>
              {/* Success icon */}
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-medium">Link created!</p>
              </div>

              {/* Link preview */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-white/70 text-sm outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-all ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold/30'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Share buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={handleEmail}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="w-full py-3 text-white/50 hover:text-white text-sm uppercase tracking-wider transition-colors"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistShareModal;
