import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVillaBySlug } from '../services/villaService';

const CollaboratorGallery: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const v = await fetchVillaBySlug(slug);
        if (cancelled) return;
        if (!v || !v.gallery || v.gallery.length === 0) {
          setError('No photos available.');
        } else {
          setImages(v.gallery);
        }
      } catch {
        if (!cancelled) setError('Could not load photos.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight')
        setLightboxIndex(i => (i === null ? null : (i + 1) % images.length));
      if (e.key === 'ArrowLeft')
        setLightboxIndex(i =>
          i === null ? null : (i - 1 + images.length) % images.length
        );
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxIndex, images.length]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        overflowY: 'auto',
        zIndex: 1,
      }}
    >
      {loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: '#888',
            fontFamily: 'sans-serif',
            fontSize: '14px',
          }}
        >
          Loading...
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: '#888',
            fontFamily: 'sans-serif',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '4px',
            padding: '4px',
          }}
        >
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setLightboxIndex(i)}
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                overflow: 'hidden',
                background: '#111',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.97)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setLightboxIndex(null); }}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 12,
              right: 16,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 36,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
            }}
            aria-label="Previous"
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 48,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % images.length);
            }}
            aria-label="Next"
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 48,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ›
          </button>
          <img
            src={images[lightboxIndex]}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '95vw',
              maxHeight: '95vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              fontFamily: 'sans-serif',
            }}
          >
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorGallery;
