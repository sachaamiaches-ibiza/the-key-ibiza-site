import React, { useMemo, useState } from 'react';
import { Villa, Language } from '../types';
import { LogoTheKey } from './Navbar';
import ContactModal from './ContactModal';

interface CatalogViewProps {
  villa: Villa;
  lang: Language;
}

/**
 * Lightweight villa detail view used when villa.catalogPdfUrl is set.
 * The villa is published with minimal effort: a PDF in Cloudinary,
 * basic structured fields (so filters and the listing card still work)
 * and optional blocked dates as JSONB. Cloudinary serves page 1 of the
 * PDF as the cover image via URL transform — no separate upload needed.
 */
const CatalogView: React.FC<CatalogViewProps> = ({ villa, lang }) => {
  const [contactOpen, setContactOpen] = useState(false);

  const cover =
    villa.catalogCoverUrl ||
    villa.headerImages?.[0] ||
    villa.imageUrl ||
    '';

  const fullDescription = villa.fullDescription ?? [];

  const stats: { label: string; value: string | number }[] = [
    { label: T(lang, 'bedrooms'), value: villa.bedrooms || '—' },
    { label: T(lang, 'bathrooms'), value: villa.bathrooms || '—' },
    { label: T(lang, 'maxGuests'), value: villa.maxGuests || '—' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1C26] text-white">
      {/* ───────────── HERO ───────────── */}
      <header className="relative w-full overflow-hidden border-b border-white/10">
        {cover ? (
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] bg-[#141B24]">
            <img
              src={cover}
              alt={villa.name}
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C26] via-[#0B1C26]/30 to-transparent" />
          </div>
        ) : (
          <div className="w-full aspect-[21/9] bg-gradient-to-br from-[#141B24] to-[#0B1C26]" />
        )}

        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-10 sm:pb-12">
          <div className="mx-auto max-w-6xl">
            {villa.vip_only && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-luxury-gold/40 bg-luxury-gold/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-luxury-gold">
                <LogoTheKey size={10} color="#C4A461" />
                Members only
              </span>
            )}
            <h1
              className="text-3xl leading-tight sm:text-5xl md:text-6xl"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {villa.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/70">
              {villa.location}
              {villa.district ? ` · ${villa.district}` : ''}
            </p>
          </div>
        </div>
      </header>

      {/* ───────────── BODY ───────────── */}
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14">
        {/* Download CTA + Stats */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Download button */}
          <div className="md:col-span-2">
            <a
              href={villa.catalogPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-luxury-gold/40 bg-gradient-to-br from-luxury-gold/15 to-luxury-gold/5 px-5 py-5 transition-all hover:-translate-y-0.5 hover:border-luxury-gold hover:from-luxury-gold/25"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-luxury-gold">
                  {T(lang, 'eyebrow')}
                </div>
                <div
                  className="mt-1 text-2xl leading-tight text-white sm:text-3xl"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {T(lang, 'downloadCta')}
                </div>
                <div className="mt-1 text-xs text-white/55">
                  {T(lang, 'downloadHint')}
                </div>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-luxury-gold text-[#0B1C26] shadow-lg transition-transform group-hover:scale-110">
                <DownloadIcon />
              </div>
            </a>
          </div>

          {/* Stats card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-[9px] uppercase tracking-[0.18em] text-white/45">
                    {s.label}
                  </span>
                  <span
                    className="mt-1 text-2xl text-white"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Description */}
        {(villa.shortDescription || fullDescription.length > 0) && (
          <section className="mt-12">
            <SectionTitle>{T(lang, 'about')}</SectionTitle>
            {villa.shortDescription && (
              <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                {villa.shortDescription}
              </p>
            )}
            {fullDescription.length > 0 && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/65 sm:text-[15px]">
                {fullDescription.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Amenities */}
        {villa.amenities && villa.amenities.length > 0 && (
          <section className="mt-12">
            <SectionTitle>{T(lang, 'amenities')}</SectionTitle>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {villa.amenities.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-white/75"
                >
                  <span className="h-1 w-1 rounded-full bg-luxury-gold" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Availability (manual blocked dates) */}
        <section className="mt-12">
          <SectionTitle>{T(lang, 'availability')}</SectionTitle>
          <MiniAvailabilityCalendar
            blockedDates={villa.blockedDates || []}
            occupiedDates={villa.occupiedDates || []}
            lang={lang}
          />
          <p className="mt-3 text-xs text-white/45">
            {T(lang, 'availabilityHint')}
          </p>
        </section>

        {/* Contact CTAs */}
        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2
            className="text-2xl text-white sm:text-3xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {T(lang, 'interestedTitle')}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/65">
            {T(lang, 'interestedBody')}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/34660153207?text=${encodeURIComponent(
                `Hey! I'm interested in ${villa.name} (${villa.location}). Can we talk?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-luxury-gold/40 bg-luxury-gold/10 px-5 py-3 text-sm font-semibold text-luxury-gold transition-all hover:-translate-y-0.5 hover:bg-luxury-gold/20"
            >
              {T(lang, 'contactBtn')}
            </button>
          </div>
        </section>
      </main>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
};

export default CatalogView;

/* ───────────────────────── helpers ───────────────────────── */

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2
    className="mb-5 text-xl text-white sm:text-2xl"
    style={{ fontFamily: 'Playfair Display, serif' }}
  >
    <span className="border-b-2 border-luxury-gold pb-1">{children}</span>
  </h2>
);

function DownloadIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/* ───────────────────────── mini calendar ───────────────────────── */

interface MiniAvailabilityCalendarProps {
  blockedDates: { from: string; to: string }[];
  occupiedDates: string[];
  lang: Language;
}

function MiniAvailabilityCalendar({
  blockedDates,
  occupiedDates,
  lang,
}: MiniAvailabilityCalendarProps) {
  // Expand all blocked ranges + iCal-style occupied dates into a Set of ISO dates
  const blockedSet = useMemo(() => {
    const set = new Set<string>();
    for (const d of occupiedDates) set.add(d);
    for (const range of blockedDates) {
      const start = new Date(range.from);
      const end = new Date(range.to);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;
      const cur = new Date(start);
      while (cur <= end) {
        set.add(toIso(cur));
        cur.setDate(cur.getDate() + 1);
      }
    }
    return set;
  }, [blockedDates, occupiedDates]);

  // Render 3 months from current month
  const today = new Date();
  const months = [0, 1, 2].map((offset) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return d;
  });

  const locale = lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-GB';

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {months.map((monthStart) => (
        <MonthGrid
          key={toIso(monthStart)}
          monthStart={monthStart}
          blockedSet={blockedSet}
          locale={locale}
          todayIso={toIso(today)}
        />
      ))}
    </div>
  );
}

function MonthGrid({
  monthStart,
  blockedSet,
  locale,
  todayIso,
}: {
  monthStart: Date;
  blockedSet: Set<string>;
  locale: string;
  todayIso: string;
}) {
  const monthLabel = monthStart.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const cells = useMemo(() => {
    // Build a Mon-Sun 6-row grid
    const out: (Date | null)[] = [];
    const first = new Date(monthStart);
    const firstDow = (first.getDay() + 6) % 7; // Mon = 0
    for (let i = 0; i < firstDow; i++) out.push(null);
    const lastDay = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0
    ).getDate();
    for (let d = 1; d <= lastDay; d++) {
      out.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), d));
    }
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [monthStart]);

  const weekdayHeaders = useMemo(() => {
    const ref = new Date(2026, 5, 1); // Mon June 1 2026
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ref);
      d.setDate(ref.getDate() + i);
      return d
        .toLocaleDateString(locale, { weekday: 'narrow' })
        .toUpperCase();
    });
  }, [locale]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div
        className="mb-3 text-center text-base capitalize text-white"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {monthLabel}
      </div>
      <div className="mb-1 grid grid-cols-7 text-center text-[10px] uppercase tracking-wider text-white/35">
        {weekdayHeaders.map((wd, i) => (
          <div key={i}>{wd}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
          const iso = toIso(d);
          const isBlocked = blockedSet.has(iso);
          const isToday = iso === todayIso;
          return (
            <div
              key={iso}
              className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] ${
                isBlocked
                  ? 'bg-luxury-gold/15 text-luxury-gold/40 line-through decoration-luxury-gold/60'
                  : isToday
                    ? 'bg-luxury-gold text-[#0B1C26] font-semibold'
                    : 'text-white/75'
              }`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ───────────────────────── tiny translations ───────────────────────── */

const STRINGS: Record<string, Record<Language, string>> = {
  bedrooms: {
    en: 'Bedrooms',
    es: 'Dormitorios',
    fr: 'Chambres',
    de: 'Schlafzimmer',
  },
  bathrooms: {
    en: 'Bathrooms',
    es: 'Baños',
    fr: 'Salles de bain',
    de: 'Bäder',
  },
  maxGuests: {
    en: 'Max guests',
    es: 'Huéspedes',
    fr: 'Invités max',
    de: 'Gäste max',
  },
  eyebrow: {
    en: 'Catalogue',
    es: 'Catálogo',
    fr: 'Catalogue',
    de: 'Katalog',
  },
  downloadCta: {
    en: 'Download Catalogue PDF',
    es: 'Descargar PDF del catálogo',
    fr: 'Télécharger le PDF du catalogue',
    de: 'Katalog-PDF herunterladen',
  },
  downloadHint: {
    en: 'Full villa details, layout and photos.',
    es: 'Detalles completos de la villa, plano y fotos.',
    fr: 'Détails complets, plan et photos.',
    de: 'Volle Details, Grundriss und Fotos.',
  },
  about: {
    en: 'About the villa',
    es: 'Sobre la villa',
    fr: 'À propos',
    de: 'Über die Villa',
  },
  amenities: {
    en: 'Amenities',
    es: 'Servicios',
    fr: 'Équipements',
    de: 'Ausstattung',
  },
  availability: {
    en: 'Availability',
    es: 'Disponibilidad',
    fr: 'Disponibilité',
    de: 'Verfügbarkeit',
  },
  availabilityHint: {
    en: 'Dates with a gold strikethrough are already booked.',
    es: 'Las fechas con tachado dorado ya están ocupadas.',
    fr: 'Les dates barrées en doré sont déjà réservées.',
    de: 'Datumsangaben mit goldenem Durchstrich sind bereits gebucht.',
  },
  interestedTitle: {
    en: 'Interested?',
    es: '¿Interesado?',
    fr: 'Intéressé ?',
    de: 'Interessiert?',
  },
  interestedBody: {
    en: 'Reach out and our team will reply within hours with availability, pricing details and bespoke arrangements.',
    es: 'Contáctanos y nuestro equipo responderá en pocas horas con disponibilidad, precios y arreglos personalizados.',
    fr: 'Contactez-nous et notre équipe répondra en quelques heures avec disponibilité, tarifs et offres sur mesure.',
    de: 'Schreib uns und unser Team antwortet innerhalb von Stunden mit Verfügbarkeit, Preisen und individuellen Angeboten.',
  },
  contactBtn: {
    en: 'Contact form',
    es: 'Formulario de contacto',
    fr: 'Formulaire de contact',
    de: 'Kontaktformular',
  },
};

function T(lang: Language, key: keyof typeof STRINGS): string {
  return STRINGS[key]?.[lang] ?? STRINGS[key]?.en ?? key;
}
