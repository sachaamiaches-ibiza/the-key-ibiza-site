import React, { useEffect, useState } from 'react';

/**
 * Dedicated, shareable review page at /review (and /leave-review).
 * Clients who have just finished their stay get this URL from the team —
 * it's a focused, distraction-free form that posts to the same
 * /api/reviews endpoint the homepage Testimonials modal uses, so
 * admin approval + aggregate stats keep working the same way.
 */

const BACKEND_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://the-key-ibiza-backend.vercel.app';

const LeaveReviewPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    quote: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  // SEO: unique title + description so it ranks for "review" / "testimonial"
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Leave a Review · The Key Ibiza';
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute('content') ?? null;
    metaDesc?.setAttribute(
      'content',
      'Share your experience with The Key Ibiza — luxury villas and concierge services in Ibiza. Your feedback helps us keep raising the bar.'
    );
    return () => {
      document.title = prevTitle;
      if (prevDesc != null) metaDesc?.setAttribute('content', prevDesc);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', location: '', quote: '', email: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
    setSubmitting(false);
  };

  return (
    <section
      className="min-h-screen py-20 md:py-28"
      style={{ backgroundColor: '#0B1C26' }}
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] font-medium block mb-4">
            Guest Feedback
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6">
            Thank you for staying with us
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Your words help us keep raising the bar — and help future guests
            discover what makes a stay with The Key feel different. We read
            every review personally.
          </p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-12">
          {submitStatus === 'success' ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-3">
                Thank you!
              </h2>
              <p className="text-white/60 max-w-md mx-auto">
                Your review has been received and will appear on our site once
                approved. We truly appreciate you taking the time.
              </p>
              <a
                href="/"
                className="inline-block mt-8 px-6 py-3 rounded-full border border-luxury-gold/40 text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold/10 transition-all"
              >
                Back to The Key Ibiza
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John D."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  Where you're from *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="London, UK"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  Your Review *
                </label>
                <textarea
                  required
                  minLength={20}
                  maxLength={500}
                  rows={6}
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  placeholder="Tell us about your experience — what stood out, what we did well, what we could do better…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold resize-none"
                />
                <p className="text-white/30 text-xs mt-1">
                  {formData.quote.length}/500
                </p>
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold"
                />
                <p className="text-white/30 text-xs mt-1">
                  Only if you'd like us to follow up personally.
                </p>
              </div>

              {submitStatus === 'error' && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again, or email us
                  directly at hello@thekey-ibiza.com.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-luxury-gold text-luxury-blue py-4 rounded-full text-sm uppercase tracking-wider font-medium hover:bg-luxury-gold/90 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>

              <p className="text-center text-white/40 text-xs pt-2">
                Reviews are moderated before publishing. We never share your
                email.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeaveReviewPage;
