import React, { useEffect, useState } from 'react';
import { usePortal } from './PortalContext';
import { ownerApi, VillaDetail } from './ownerApi';
import { IconX, IconCheck } from './icons';

interface Props { slug: string; onClose: () => void; onSubmitted: () => void; }

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div>
    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>
      {label}{hint && <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}> · {hint}</span>}
    </label>
    {children}
  </div>
);

const VillaEditModal: React.FC<Props> = ({ slug, onClose, onSubmitted }) => {
  const { t, toast } = usePortal();
  const [villa, setVilla] = useState<VillaDetail | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    (async () => {
      try {
        const { villa, pending } = await ownerApi.villaDetail(slug);
        setVilla(villa);
        setPending(pending.length > 0);
        setForm({
          villa_name: villa.villa_name || '',
          short_description: villa.short_description || '',
          description: villa.description || '',
          amenities: villa.amenities || '',
          price_min_week: villa.price_min_week != null ? String(villa.price_min_week) : '',
          price_max_week: villa.price_max_week != null ? String(villa.price_max_week) : '',
        });
      } catch { setErr(t('errorGeneric')); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setErr('');
    setBusy(true);
    try {
      await ownerApi.submitChangeRequest(slug, {
        villa_name: form.villa_name,
        short_description: form.short_description,
        description: form.description,
        amenities: form.amenities,
        price_min_week: form.price_min_week,
        price_max_week: form.price_max_week,
      });
      toast(t('changeSubmitted'));
      onSubmitted();
    } catch (e: any) {
      setErr(e?.message === 'No changes detected' || e?.message === 'No changes in request' ? t('noChangesToSubmit') : t('errorGeneric'));
      setBusy(false);
    }
  };

  return (
    <div className="pl-overlay" onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(10,12,17,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div className="pl-modal pl-modal-sheet" onMouseDown={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)', width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto', borderRadius: '22px 22px 0 0', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', padding: '1.1rem 1.3rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
          <h3 className="serif" style={{ fontSize: '1.25rem', flex: 1 }}>{t('editDetails')}</h3>
          <button onClick={onClose} className="pl-btn pl-btn-ghost" style={{ padding: 8, width: 36, height: 36, borderRadius: 999 }}><IconX size={18} /></button>
        </div>

        <div style={{ padding: '1.3rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Approval notice */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--accent-bg)', borderRadius: 12, padding: '0.75rem 0.9rem' }}>
            <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}><IconCheck size={18} /></span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t('editDetailsSub')}</span>
          </div>

          {pending && (
            <div style={{ fontSize: '0.82rem', color: 'var(--tentative)', background: 'var(--tentative-bg)', borderRadius: 10, padding: '0.6rem 0.8rem', fontWeight: 600 }}>
              {t('pendingApprovalNote')}
            </div>
          )}

          {loading ? (
            <div style={{ height: 300, opacity: 0.5 }} className="pl-card" />
          ) : villa && (
            <>
              <Field label={t('fldName')}>
                <input className="pl-input" value={form.villa_name} onChange={set('villa_name')} />
              </Field>
              <Field label={t('fldShortDesc')}>
                <textarea className="pl-input" rows={2} value={form.short_description} onChange={set('short_description')} style={{ resize: 'vertical' }} />
              </Field>
              <Field label={t('fldDescription')}>
                <textarea className="pl-input" rows={4} value={form.description} onChange={set('description')} style={{ resize: 'vertical' }} />
              </Field>
              <Field label={t('fldAmenities')} hint={t('amenitiesHint')}>
                <textarea className="pl-input" rows={2} value={form.amenities} onChange={set('amenities')} style={{ resize: 'vertical' }} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label={t('fldPriceMin')}>
                  <input className="pl-input" type="number" value={form.price_min_week} onChange={set('price_min_week')} placeholder="€" />
                </Field>
                <Field label={t('fldPriceMax')}>
                  <input className="pl-input" type="number" value={form.price_max_week} onChange={set('price_max_week')} placeholder="€" />
                </Field>
              </div>
            </>
          )}

          {err && <div style={{ fontSize: '0.85rem', color: 'var(--blocked)', background: 'var(--blocked-bg)', padding: '0.55rem 0.75rem', borderRadius: 10 }}>{err}</div>}
        </div>

        <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface)', padding: '1rem 1.3rem calc(1rem + env(safe-area-inset-bottom))', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <button className="pl-btn pl-btn-ghost" onClick={onClose} style={{ padding: '0.7rem 1rem', marginLeft: 'auto' }}>{t('cancel')}</button>
          <button className="pl-btn pl-btn-primary" onClick={submit} disabled={busy || loading} style={{ padding: '0.7rem 1.4rem' }}>
            {busy ? t('saving') : t('submitForApproval')}
          </button>
        </div>
        <style>{`@media (min-width: 640px){ .pl-modal-sheet { border-radius: 22px !important; align-self: center; margin-bottom: 5vh; } }`}</style>
      </div>
    </div>
  );
};

export default VillaEditModal;
