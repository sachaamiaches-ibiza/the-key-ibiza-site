import React, { useEffect, useState } from 'react';
import { usePortal } from './PortalContext';
import { ownerApi, Booking, BookingType } from './ownerApi';
import { addDays, daysBetween } from './dateUtils';
import { IconX, IconTrash } from './icons';

const TYPES: BookingType[] = ['reservation', 'block', 'maintenance', 'personal', 'tentative'];
const TYPE_LABEL: Record<BookingType, any> = {
  reservation: 'typeReservation', block: 'typeBlock', maintenance: 'typeMaintenance', personal: 'typePersonal', tentative: 'typeTentative',
};
const TYPE_COLOR: Record<BookingType, string> = {
  reservation: 'var(--blocked)', block: 'var(--blocked)', maintenance: 'var(--maint)', personal: 'var(--personal)', tentative: 'var(--tentative)',
};
const SOURCES = ['direct', 'airbnb', 'booking', 'vrbo', 'website', 'manual'];
const SRC_LABEL: Record<string, any> = { direct: 'srcDirect', airbnb: 'srcAirbnb', booking: 'srcBooking', vrbo: 'srcVrbo', website: 'srcWebsite', manual: 'srcManual' };

interface Props {
  slug: string;
  booking: Booking | null;                 // null = create
  initial?: { start: string; end: string };
  onClose: () => void;
  onSaved: () => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

const BookingModal: React.FC<Props> = ({ slug, booking, initial, onClose, onSaved }) => {
  const { t, toast } = usePortal();
  const editing = !!booking;
  const imported = editing && String(booking?.created_by || '').startsWith('ical');
  const providerName = booking?.source ? booking.source.charAt(0).toUpperCase() + booking.source.slice(1) : '';
  const [type, setType] = useState<BookingType>(booking?.type || 'block');
  const [guestName, setGuestName] = useState(booking?.guest_name || '');
  const [start, setStart] = useState(booking?.start_date || initial?.start || '');
  const [end, setEnd] = useState(booking?.end_date || initial?.end || '');
  const [guests, setGuests] = useState<string>(booking?.guests ? String(booking.guests) : '');
  const [source, setSource] = useState(booking?.source || 'direct');
  const [notes, setNotes] = useState(booking?.notes || '');
  const [internal, setInternal] = useState(booking?.internal_notes || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isReservation = type === 'reservation' || type === 'tentative';
  const nights = start && end && end > start ? daysBetween(start, end) : 0;

  const save = async () => {
    setErr('');
    if (!start || !end) { setErr(t('requiredDates')); return; }
    if (end <= start) { setErr(t('requiredDates')); return; }
    setBusy(true);
    const payload: Partial<Booking> = {
      type, start_date: start, end_date: end,
      guest_name: isReservation ? guestName || null : null,
      guests: guests ? Number(guests) : null,
      source, notes: notes || null, internal_notes: internal || null,
    };
    try {
      if (editing) await ownerApi.updateBooking(booking!.id, payload);
      else await ownerApi.createBooking(slug, payload);
      toast(editing ? t('profileSaved') : t('create'));
      onSaved();
    } catch { setErr(t('errorGeneric')); }
    finally { setBusy(false); }
  };

  const del = async () => {
    setBusy(true);
    try { await ownerApi.deleteBooking(booking!.id); toast(t('deleteBooking')); onSaved(); }
    catch { setErr(t('errorGeneric')); setBusy(false); }
  };

  return (
    <div className="pl-overlay" onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(10,12,17,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div className="pl-modal pl-modal-sheet" onMouseDown={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)', width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto',
          borderRadius: '22px 22px 0 0', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', padding: '1.1rem 1.3rem', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: TYPE_COLOR[type] }} />
          <h3 className="serif" style={{ fontSize: '1.25rem', flex: 1 }}>{editing ? t('editBooking') : t('newBooking')}</h3>
          <button onClick={onClose} className="pl-btn pl-btn-ghost" style={{ padding: 8, width: 36, height: 36, borderRadius: 999 }}><IconX size={18} /></button>
        </div>

        <fieldset disabled={imported} style={{ padding: '1.3rem', display: 'flex', flexDirection: 'column', gap: 16, border: 0, margin: 0, minWidth: 0 }}>
          {imported && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--accent-bg)', borderRadius: 12, padding: '0.75rem 0.9rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--blocked)', flexShrink: 0, marginTop: 4 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <b style={{ color: 'var(--text)' }}>{t('importedFrom', { p: providerName })}</b><br />{t('importedReadonly')}
              </span>
            </div>
          )}
          {/* Type segmented */}
          <Field label={t('bookingType')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TYPES.map((ty) => (
                <button key={ty} onClick={() => setType(ty)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.7rem', borderRadius: 999,
                    fontSize: '0.8rem', fontWeight: 600, border: '1px solid', cursor: 'pointer',
                    borderColor: type === ty ? TYPE_COLOR[ty] : 'var(--border)',
                    background: type === ty ? `color-mix(in srgb, ${TYPE_COLOR[ty]} 14%, transparent)` : 'transparent',
                    color: type === ty ? 'var(--text)' : 'var(--text-muted)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: TYPE_COLOR[ty] }} />
                  {t(TYPE_LABEL[ty])}
                </button>
              ))}
            </div>
          </Field>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label={t('arrival')}>
              <input className="pl-input" type="date" value={start} max={end ? addDays(end, -1) : undefined}
                onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field label={t('departure')}>
              <input className="pl-input" type="date" value={end} min={start ? addDays(start, 1) : undefined}
                onChange={(e) => setEnd(e.target.value)} />
            </Field>
          </div>
          {nights > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: -6 }}>{nights} {t('nights')}</div>
          )}

          {/* Reservation-only fields */}
          {isReservation && (
            <>
              <Field label={t('guestName')}>
                <input className="pl-input" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t('guestNamePh')} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label={t('numGuests')}>
                  <input className="pl-input" type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="—" />
                </Field>
                <Field label={t('source')}>
                  <select className="pl-input" value={source} onChange={(e) => setSource(e.target.value)}>
                    {SOURCES.map((s) => <option key={s} value={s}>{t(SRC_LABEL[s])}</option>)}
                  </select>
                </Field>
              </div>
              <Field label={t('notes')}>
                <textarea className="pl-input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notesPh')} style={{ resize: 'vertical' }} />
              </Field>
            </>
          )}

          <Field label={t('internalNotes')}>
            <textarea className="pl-input" rows={2} value={internal} onChange={(e) => setInternal(e.target.value)} placeholder={t('internalNotesPh')} style={{ resize: 'vertical' }} />
          </Field>

          {err && <div style={{ fontSize: '0.85rem', color: 'var(--blocked)', background: 'var(--blocked-bg)', padding: '0.55rem 0.75rem', borderRadius: 10 }}>{err}</div>}
        </fieldset>

        {/* Footer */}
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface)', padding: '1rem 1.3rem calc(1rem + env(safe-area-inset-bottom))',
          borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
          {imported ? (
            <button className="pl-btn pl-btn-ghost" onClick={onClose} style={{ padding: '0.7rem 1.4rem', marginLeft: 'auto' }}>{t('close')}</button>
          ) : (<>
          {editing && (
            confirmDel ? (
              <button className="pl-btn" disabled={busy} onClick={del}
                style={{ background: 'var(--blocked)', color: '#fff', padding: '0.7rem 1rem' }}>
                <IconTrash size={16} />{t('deleteBooking')}?
              </button>
            ) : (
              <button className="pl-btn pl-btn-ghost" disabled={busy} onClick={() => setConfirmDel(true)}
                style={{ padding: '0.7rem 0.9rem', color: 'var(--blocked)', borderColor: 'var(--border)' }}>
                <IconTrash size={16} />
              </button>
            )
          )}
          <button className="pl-btn pl-btn-ghost" onClick={onClose} style={{ padding: '0.7rem 1rem', marginLeft: editing ? 0 : 'auto' }}>{t('cancel')}</button>
          <button className="pl-btn pl-btn-primary" onClick={save} disabled={busy} style={{ padding: '0.7rem 1.4rem', marginLeft: editing ? 'auto' : 0 }}>
            {busy ? (editing ? t('saving') : t('creating')) : (editing ? t('save') : t('create'))}
          </button>
          </>)}
        </div>

        <style>{`@media (min-width: 640px){ .pl-modal-sheet { border-radius: 22px !important; align-self: center; margin-bottom: 5vh; } }`}</style>
      </div>
    </div>
  );
};

export default BookingModal;
