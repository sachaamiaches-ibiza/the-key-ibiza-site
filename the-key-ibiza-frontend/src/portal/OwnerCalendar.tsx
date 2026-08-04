import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortal } from './PortalContext';
import { ownerApi, OwnerVilla, Booking, BookingType } from './ownerApi';
import {
  todayIso, addDays, monthMatrix, fmtMonthYear, fmtDay, weekdayNarrow, weekdayNames, parseIso,
} from './dateUtils';
import BookingModal from './BookingModal';
import IcalModal from './IcalModal';
import { IconChevronLeft, IconChevronRight, IconPlus, IconChevronDown, IconRefresh } from './icons';

type View = 'month' | 'week' | 'year';

const TYPE_COLOR: Record<BookingType, string> = {
  reservation: 'var(--blocked)', block: 'var(--blocked)', maintenance: 'var(--maint)', personal: 'var(--personal)', tentative: 'var(--tentative)',
};
const TYPE_BG: Record<BookingType, string> = {
  reservation: 'var(--blocked-bg)', block: 'var(--blocked-bg)', maintenance: 'var(--maint-bg)', personal: 'var(--personal-bg)', tentative: 'var(--tentative-bg)',
};

// Build a lookup of date -> booking that occupies it ([start, end))
function indexBookings(bookings: Booking[]) {
  const map = new Map<string, Booking>();
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    let d = b.start_date;
    while (d < b.end_date) { map.set(d, b); d = addDays(d, 1); }
  }
  return map;
}

const OwnerCalendar: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, lang } = usePortal();

  const [villas, setVillas] = useState<OwnerVilla[]>([]);
  const [slug, setSlug] = useState<string | undefined>(routeSlug);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('month');
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });

  // selection (drag)
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd] = useState<string | null>(null);
  const dragging = useRef(false);

  // modal
  const [modal, setModal] = useState<null | { booking: Booking | null; initial?: { start: string; end: string } }>(null);
  const [hover, setHover] = useState<null | { b: Booking; x: number; y: number }>(null);
  const [showIcal, setShowIcal] = useState(false);

  // Load villas once
  useEffect(() => {
    (async () => {
      try {
        const { villas } = await ownerApi.villas();
        setVillas(villas);
        if (!routeSlug && villas[0]) setSlug(villas[0].slug);
      } catch { /* guard handles */ }
    })();
  }, [routeSlug]);

  useEffect(() => { if (routeSlug) setSlug(routeSlug); }, [routeSlug]);

  const loadBookings = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try { const { bookings } = await ownerApi.bookings(slug); setBookings(bookings); }
    catch { /* guard */ }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const byDate = useMemo(() => indexBookings(bookings), [bookings]);

  // ----- drag selection -----
  const inSel = (d: string) => {
    if (!selStart || !selEnd) return false;
    const [lo, hi] = selStart <= selEnd ? [selStart, selEnd] : [selEnd, selStart];
    return d >= lo && d <= hi;
  };

  const beginDrag = (d: string) => {
    if (byDate.has(d)) return; // don't start a drag on an occupied day
    dragging.current = true;
    setSelStart(d); setSelEnd(d);
  };
  const extendDrag = (d: string) => { if (dragging.current) setSelEnd(d); };
  const endDrag = () => {
    if (dragging.current && selStart && selEnd) {
      const [lo, hi] = selStart <= selEnd ? [selStart, selEnd] : [selEnd, selStart];
      setModal({ booking: null, initial: { start: lo, end: addDays(hi, 1) } }); // end exclusive
    }
    dragging.current = false;
  };

  // Global pointer up + touch move (elementFromPoint) for finger dragging
  useEffect(() => {
    const up = () => endDrag();
    const move = (e: TouchEvent) => {
      if (!dragging.current) return;
      const tch = e.touches[0]; if (!tch) return;
      const el = document.elementFromPoint(tch.clientX, tch.clientY) as HTMLElement | null;
      const d = el?.closest('[data-date]')?.getAttribute('data-date');
      if (d) { e.preventDefault(); extendDrag(d); }
    };
    window.addEventListener('pointerup', up);
    window.addEventListener('touchmove', move, { passive: false });
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('touchmove', move); };
  }, [selStart, selEnd]);

  const openBooking = (b: Booking) => setModal({ booking: b });
  const onSaved = () => { setModal(null); setSelStart(null); setSelEnd(null); loadBookings(); };

  // ----- navigation -----
  const shift = (dir: number) => {
    if (view === 'year') { setCursor((c) => ({ ...c, y: c.y + dir })); return; }
    if (view === 'week') {
      setWeekAnchor((w) => addDays(w, dir * 7));
      return;
    }
    setCursor((c) => {
      let m = c.m + dir, y = c.y;
      if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
      return { y, m };
    });
  };
  const goToday = () => { const d = new Date(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); setWeekAnchor(mondayOf(todayIso())); };

  const [weekAnchor, setWeekAnchor] = useState(() => mondayOf(todayIso()));

  // ---------- renderers ----------
  const DayCell = (d: string | null, opts: { small?: boolean } = {}) => {
    if (!d) return <div key={Math.random()} />;
    const b = byDate.get(d);
    const isToday = d === todayIso();
    const selected = inSel(d);
    const isPast = d < todayIso();
    const dayNum = Number(d.slice(8, 10));
    const isStart = b && b.start_date === d;

    return (
      <div key={d} data-date={d}
        onPointerDown={(e) => { if (b) { openBooking(b); } else { e.preventDefault(); beginDrag(d); } }}
        onPointerEnter={() => extendDrag(d)}
        onMouseEnter={(e) => b && setHover({ b, x: e.clientX, y: e.clientY })}
        onMouseMove={(e) => b && setHover((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : h))}
        onMouseLeave={() => setHover(null)}
        style={{
          position: 'relative', minHeight: opts.small ? 34 : 76, padding: opts.small ? 0 : '6px 8px',
          border: '1px solid var(--border)', cursor: 'pointer', userSelect: 'none',
          background: selected ? 'var(--accent-bg)' : b ? TYPE_BG[b.type] : 'var(--surface)',
          borderColor: selected ? 'var(--gold)' : 'var(--border)',
          display: 'flex', flexDirection: 'column', touchAction: 'none',
          opacity: isPast && !b ? 0.5 : 1,
          transition: 'background 0.12s',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: opts.small ? 'center' : 'space-between', flex: opts.small ? 1 : 'none' }}>
          <span style={{
            fontSize: opts.small ? '0.7rem' : '0.82rem', fontWeight: isToday ? 800 : 500,
            color: isToday ? '#fff' : 'var(--text)',
            background: isToday ? 'var(--gold)' : 'transparent',
            width: isToday ? 22 : 'auto', height: isToday ? 22 : 'auto', borderRadius: 999,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>{dayNum}</span>
        </div>
        {/* booking bar (month view) */}
        {b && !opts.small && (
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: TYPE_COLOR[b.type], flexShrink: 0 }} />
            {isStart && (
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {b.guest_name || t(`type${b.type.charAt(0).toUpperCase() + b.type.slice(1)}` as any)}
              </span>
            )}
          </div>
        )}
        {/* colored strip on small (year) cells */}
        {b && opts.small && (
          <div style={{ position: 'absolute', bottom: 2, left: 3, right: 3, height: 3, borderRadius: 2, background: TYPE_COLOR[b.type] }} />
        )}
      </div>
    );
  };

  const MonthView = () => {
    const cells = monthMatrix(cursor.y, cursor.m);
    const wd = weekdayNarrow(lang);
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {wd.map((w, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '8px 0', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{w}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {cells.map((c) => DayCell(c))}
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekAnchor, i));
    const wd = weekdayNames(lang);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
        {days.map((d, i) => (
          <div key={d}>
            <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
              {wd[i]}
            </div>
            <div style={{ minHeight: 260 }}>{DayCell(d)}</div>
          </div>
        ))}
      </div>
    );
  };

  const YearView = () => (
    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
      {Array.from({ length: 12 }, (_, m) => {
        const cells = monthMatrix(cursor.y, m);
        const wd = weekdayNarrow(lang);
        return (
          <div key={m} className="pl-card" style={{ padding: '0.9rem' }}>
            <button onClick={() => { setCursor({ y: cursor.y, m }); setView('month'); }}
              className="serif" style={{ fontSize: '1rem', marginBottom: 8, textTransform: 'capitalize', color: 'var(--text)' }}>
              {fmtMonthYear(cursor.y, m, lang).split(' ')[0]}
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {wd.map((w, i) => <div key={i} style={{ textAlign: 'center', fontSize: '0.58rem', color: 'var(--text-faint)', padding: '2px 0' }}>{w}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {cells.map((c) => DayCell(c, { small: true }))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const title = view === 'year' ? String(cursor.y)
    : view === 'week' ? `${fmtDay(weekAnchor, lang)} – ${fmtDay(addDays(weekAnchor, 6), lang, { day: 'numeric', month: 'short', year: 'numeric' })}`
    : fmtMonthYear(cursor.y, cursor.m, lang);

  const legend: { c: string; k: any }[] = [
    { c: 'var(--avail)', k: 'legAvailable' },
    { c: 'var(--blocked)', k: 'legBlocked' },
    { c: 'var(--tentative)', k: 'legTentative' },
    { c: 'var(--maint)', k: 'legMaintenance' },
    { c: 'var(--personal)', k: 'legPersonal' },
  ];

  return (
    <div className="pl-animate">
      {/* Header row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 18 }}>
        {/* Villa switcher */}
        {villas.length > 0 && (
          <VillaSwitch villas={villas} slug={slug} onPick={(s) => navigate(`/owner/calendar/${s}`)} />
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 999, padding: 3 }}>
            {(['month', 'week', 'year'] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: '0.4rem 0.85rem', borderRadius: 999, fontSize: '0.82rem', fontWeight: 600,
                  background: view === v ? 'var(--surface)' : 'transparent', color: view === v ? 'var(--text)' : 'var(--text-muted)',
                  boxShadow: view === v ? 'var(--shadow-sm)' : 'none' }}>
                {t(v === 'month' ? 'viewMonth' : v === 'week' ? 'viewWeek' : 'viewYear')}
              </button>
            ))}
          </div>
          <button className="pl-btn pl-btn-ghost" style={{ padding: '0.5rem 0.85rem' }} onClick={() => setShowIcal(true)}>
            <IconRefresh size={16} /><span className="pl-hide-sm">{t('syncCalendars')}</span>
          </button>
          <button className="pl-btn pl-btn-primary" style={{ padding: '0.5rem 0.9rem' }}
            onClick={() => setModal({ booking: null, initial: { start: todayIso(), end: addDays(todayIso(), 1) } })}>
            <IconPlus size={17} /><span className="pl-hide-sm">{t('addBooking')}</span>
          </button>
        </div>
      </div>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button className="pl-btn pl-btn-ghost" style={{ padding: 8, width: 38, height: 38, borderRadius: 999 }} onClick={() => shift(-1)}><IconChevronLeft size={18} /></button>
        <h2 className="serif" style={{ fontSize: '1.4rem', textTransform: 'capitalize', minWidth: 160 }}>{title}</h2>
        <button className="pl-btn pl-btn-ghost" style={{ padding: 8, width: 38, height: 38, borderRadius: 999 }} onClick={() => shift(1)}><IconChevronRight size={18} /></button>
        <button className="pl-btn pl-btn-ghost" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }} onClick={goToday}>{t('today')}</button>
      </div>

      {loading ? (
        <div className="pl-card" style={{ height: 480, opacity: 0.5 }} />
      ) : (
        <div>
          {view === 'month' && <MonthView />}
          {view === 'week' && <WeekView />}
          {view === 'year' && <YearView />}
        </div>
      )}

      {/* Legend + hint */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginTop: 16 }}>
        {legend.map((l) => (
          <span key={l.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: l.c }} />{t(l.k)}
          </span>
        ))}
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: 10 }}>{t('dragHint')}</p>

      {/* Hover popover */}
      {hover && (
        <div style={{ position: 'fixed', left: Math.min(hover.x + 14, window.innerWidth - 220), top: hover.y + 14, zIndex: 70,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'var(--shadow-lg)',
          padding: '0.7rem 0.85rem', maxWidth: 220, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: TYPE_COLOR[hover.b.type] }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              {t(`type${hover.b.type.charAt(0).toUpperCase() + hover.b.type.slice(1)}` as any)}
            </span>
          </div>
          {hover.b.guest_name && <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{hover.b.guest_name}</div>}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {fmtDay(hover.b.start_date, lang)} → {fmtDay(hover.b.end_date, lang, { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          {hover.b.guests ? <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: 2 }}>{hover.b.guests} {t('guests')}</div> : null}
        </div>
      )}

      {modal && slug && (
        <BookingModal slug={slug} booking={modal.booking} initial={modal.initial}
          onClose={() => { setModal(null); setSelStart(null); setSelEnd(null); }} onSaved={onSaved} />
      )}

      {showIcal && slug && (
        <IcalModal slug={slug} onClose={() => setShowIcal(false)} onSynced={loadBookings} />
      )}

      <style>{`@media (max-width: 520px){ .pl-hide-sm { display: none; } }`}</style>
    </div>
  );
};

// Villa dropdown
const VillaSwitch: React.FC<{ villas: OwnerVilla[]; slug?: string; onPick: (s: string) => void }> = ({ villas, slug, onPick }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = villas.find((v) => v.slug === slug) || villas[0];
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  if (!current) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="pl-btn pl-btn-ghost" style={{ padding: '0.5rem 0.75rem', maxWidth: 260 }} onClick={() => setOpen((o) => !o)} disabled={villas.length < 2}>
        {current.photo && <img src={current.photo} alt="" style={{ width: 24, height: 24, borderRadius: 7, objectFit: 'cover' }} />}
        <span className="serif" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current.name}</span>
        {villas.length > 1 && <IconChevronDown size={15} />}
      </button>
      {open && villas.length > 1 && (
        <div className="pl-modal" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 60, minWidth: 240,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: 'var(--shadow-lg)', padding: 6, maxHeight: 320, overflowY: 'auto' }}>
          {villas.map((v) => (
            <button key={v.slug} onClick={() => { onPick(v.slug); setOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '0.5rem 0.6rem', borderRadius: 10,
                background: v.slug === current.slug ? 'var(--accent-bg)' : 'transparent', color: 'var(--text)' }}>
              {v.photo ? <img src={v.photo} alt="" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} /> : <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--surface-2)' }} />}
              <span style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function mondayOf(dstr: string): string {
  const d = parseIso(dstr);
  const dow = (d.getDay() + 6) % 7;
  return addDays(dstr, -dow);
}

export default OwnerCalendar;
