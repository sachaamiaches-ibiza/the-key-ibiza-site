import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePortal } from './PortalContext';
import { ownerApi, AdminOwner, AdminStats, CatalogVilla } from './ownerApi';
import { PORTAL_LANGS } from './i18n';
import { IconUsers, IconPlus, IconX, IconTrash, IconPin, IconCheck, IconChevronRight } from './icons';

const Stat: React.FC<{ label: string; value: number | string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="pl-card" style={{ padding: '1rem 1.2rem' }}>
    <div className="serif" style={{ fontSize: '2rem', lineHeight: 1, color: accent ? 'var(--tentative)' : 'var(--text)' }}>{value}</div>
    <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
  </div>
);

// ---------- Add owner modal ----------
const AddOwnerModal: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
  const { t, toast } = usePortal();
  const [f, setF] = useState({ name: '', email: '', password: '', preferred_lang: 'es' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async () => {
    setErr('');
    if (!f.name.trim() || !f.email.trim() || !f.password) { setErr(t('fillAllFields')); return; }
    if (!/\S+@\S+\.\S+/.test(f.email)) { setErr(t('invalidEmail')); return; }
    setBusy(true);
    try { await ownerApi.adminCreateOwner({ ...f, email: f.email.trim(), name: f.name.trim() }); toast(t('ownerCreated')); onCreated(); }
    catch (e: any) {
      const msg = String(e?.message || '');
      setErr(/already exists/i.test(msg) ? t('emailExists') : t('errorGeneric'));
      setBusy(false);
    }
  };
  return (
    <ModalSheet title={t('addOwner')} onClose={onClose} footer={
      <>
        <button className="pl-btn pl-btn-ghost" onClick={onClose} style={{ padding: '0.7rem 1rem', marginLeft: 'auto' }}>{t('cancel')}</button>
        <button className="pl-btn pl-btn-primary" onClick={submit} disabled={busy} style={{ padding: '0.7rem 1.4rem' }}>{busy ? t('creating') : t('create')}</button>
      </>
    }>
      <Field label={t('ownerName')}><input className="pl-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="John Carter" /></Field>
      <Field label={t('ownerEmail')}><input className="pl-input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="owner@email.com" /></Field>
      <Field label={t('ownerPassword')}><input className="pl-input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="••••••••" /></Field>
      <Field label={t('ownerLang')}>
        <select className="pl-input" value={f.preferred_lang} onChange={(e) => setF({ ...f, preferred_lang: e.target.value })}>
          {PORTAL_LANGS.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
        </select>
      </Field>
      {err && <div style={{ fontSize: '0.85rem', color: 'var(--blocked)' }}>{err}</div>}
    </ModalSheet>
  );
};

// ---------- Catalog picker (assign villas) ----------
const CatalogModal: React.FC<{ ownerId: string; assignedSlugs: Set<string>; onClose: () => void; onChanged: () => void }> = ({ ownerId, assignedSlugs, onClose, onChanged }) => {
  const { t } = usePortal();
  const [q, setQ] = useState('');
  const [villas, setVillas] = useState<CatalogVilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Set<string>>(new Set(assignedSlugs));

  const load = useCallback(async (query: string) => {
    setLoading(true);
    try { const { villas } = await ownerApi.adminCatalog(query); setVillas(villas); } catch { /* */ } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(''); }, [load]);
  useEffect(() => { const id = setTimeout(() => load(q), 300); return () => clearTimeout(id); }, [q, load]);

  const toggle = async (v: CatalogVilla) => {
    setBusySlug(v.slug);
    try {
      if (assigned.has(v.slug)) { await ownerApi.adminUnassignVilla(ownerId, v.slug); assigned.delete(v.slug); }
      else { await ownerApi.adminAssignVilla(ownerId, v.slug); assigned.add(v.slug); }
      setAssigned(new Set(assigned)); onChanged();
    } catch { /* */ } finally { setBusySlug(null); }
  };

  return (
    <ModalSheet title={t('assignVilla')} onClose={onClose} wide>
      <input className="pl-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('searchProperties')} autoFocus />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '55vh', overflowY: 'auto', marginTop: 4 }}>
        {loading ? (
          <div className="pl-card" style={{ height: 120, opacity: 0.5 }} />
        ) : villas.map((v) => {
          const isAssigned = assigned.has(v.slug);
          const otherOwner = v.owners.find((o) => o.id !== ownerId);
          return (
            <div key={v.slug} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.6rem', borderRadius: 12, border: '1px solid var(--border)', background: isAssigned ? 'var(--accent-bg)' : 'var(--surface)' }}>
              {v.photo ? <img src={v.photo} alt="" style={{ width: 52, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 52, height: 40, borderRadius: 8, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', flexShrink: 0, color: 'var(--text-faint)' }}><IconPin size={16} /></div>}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.location || '—'}{otherOwner && !isAssigned ? ` · ${otherOwner.name}` : ''}
                </div>
              </div>
              <button className={`pl-btn ${isAssigned ? 'pl-btn-ghost' : 'pl-btn-primary'}`} disabled={busySlug === v.slug}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', flexShrink: 0 }} onClick={() => toggle(v)}>
                {isAssigned ? <><IconCheck size={15} />{t('assigned')}</> : t('assign')}
              </button>
            </div>
          );
        })}
      </div>
    </ModalSheet>
  );
};

// ---------- Owner detail drawer ----------
const OwnerDrawer: React.FC<{ owner: AdminOwner; onClose: () => void; onChanged: () => void }> = ({ owner, onClose, onChanged }) => {
  const { t, toast } = usePortal();
  const [villas, setVillas] = useState<{ slug: string; name: string; location: string | null; photo: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCatalog, setShowCatalog] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { villas } = await ownerApi.adminOwnerVillas(owner.id); setVillas(villas); } catch { /* */ } finally { setLoading(false); }
  }, [owner.id]);
  useEffect(() => { load(); }, [load]);

  const remove = async (slug: string) => { await ownerApi.adminUnassignVilla(owner.id, slug); load(); onChanged(); };
  const del = async () => { await ownerApi.adminDeleteOwner(owner.id); toast(t('deleteOwner') || 'Deleted'); onChanged(); onClose(); };

  return (
    <ModalSheet title={owner.name} subtitle={owner.email} onClose={onClose}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        <span style={{ fontSize: '0.75rem', background: 'var(--surface-2)', borderRadius: 999, padding: '3px 10px', color: 'var(--text-muted)' }}>{owner.villaCount} {t('villasLabel')}</span>
        {owner.pendingRequests > 0 && <span style={{ fontSize: '0.75rem', background: 'var(--tentative-bg)', color: 'var(--tentative)', borderRadius: 999, padding: '3px 10px', fontWeight: 700 }}>{owner.pendingRequests} {t('pendingLabel')}</span>}
        <span style={{ fontSize: '0.75rem', background: 'var(--surface-2)', borderRadius: 999, padding: '3px 10px', color: 'var(--text-muted)' }}>{(PORTAL_LANGS.find((l) => l.code === owner.preferred_lang) || {}).flag} {owner.preferred_lang.toUpperCase()}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t('manageVillas')}</span>
        <button className="pl-btn pl-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }} onClick={() => setShowCatalog(true)}><IconPlus size={15} />{t('assignVilla')}</button>
      </div>

      {loading ? <div className="pl-card" style={{ height: 80, opacity: 0.5 }} /> : villas.length === 0 ? (
        <p style={{ fontSize: '0.88rem', color: 'var(--text-faint)', padding: '0.5rem 0' }}>—</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {villas.map((v) => (
            <div key={v.slug} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.5rem', borderRadius: 10, border: '1px solid var(--border)' }}>
              {v.photo ? <img src={v.photo} alt="" style={{ width: 44, height: 34, borderRadius: 7, objectFit: 'cover' }} /> : <div style={{ width: 44, height: 34, borderRadius: 7, background: 'var(--surface-2)' }} />}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{v.location || '—'}</div>
              </div>
              <button onClick={() => remove(v.slug)} className="pl-btn pl-btn-ghost" style={{ padding: 6, width: 30, height: 30, borderRadius: 999, color: 'var(--blocked)' }} title={t('unassignVilla')}><IconX size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--border)', marginTop: 14, paddingTop: 14 }}>
        {confirmDel ? (
          <button className="pl-btn" onClick={del} style={{ background: 'var(--blocked)', color: '#fff', padding: '0.6rem 1rem' }}><IconTrash size={15} />{t('deleteOwnerConfirm')}</button>
        ) : (
          <button className="pl-btn pl-btn-ghost" onClick={() => setConfirmDel(true)} style={{ color: 'var(--blocked)', borderColor: 'var(--border)', padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}><IconTrash size={15} />{t('deleteOwnerConfirm').split('?')[0]}</button>
        )}
      </div>

      {showCatalog && <CatalogModal ownerId={owner.id} assignedSlugs={new Set(villas.map((v) => v.slug))} onClose={() => setShowCatalog(false)} onChanged={() => { load(); onChanged(); }} />}
    </ModalSheet>
  );
};

// ---------- Page ----------
const AdminOwners: React.FC = () => {
  const { t } = usePortal();
  const [owners, setOwners] = useState<AdminOwner[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<AdminOwner | null>(null);

  const load = useCallback(async () => {
    try {
      const [{ owners }, stats] = await Promise.all([ownerApi.adminOwners(), ownerApi.adminStats()]);
      setOwners(owners.filter((o) => o.role !== 'admin'));
      setStats(stats);
    } catch { /* */ } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="pl-animate">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 className="serif" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)' }}>{t('adminOwners')}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{t('ownersSub')}</p>
        </div>
        <button className="pl-btn pl-btn-primary" onClick={() => setShowAdd(true)}><IconPlus size={17} />{t('addOwner')}</button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', marginBottom: 22 }}>
          <Stat label={t('stOwners')} value={stats.owners} />
          <Stat label={t('stVillas')} value={stats.villas} />
          <Stat label={t('stAssigned')} value={stats.assignedVillas} />
          <Stat label={t('stPending')} value={stats.pendingRequests} accent={stats.pendingRequests > 0} />
        </div>
      )}

      {loading ? (
        <div className="pl-card" style={{ height: 200, opacity: 0.5 }} />
      ) : owners.length === 0 ? (
        <div className="pl-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-bg)', color: 'var(--gold)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}><IconUsers size={26} /></div>
          <p style={{ color: 'var(--text-muted)' }}>{t('noOwners')}</p>
        </div>
      ) : (
        <div className="pl-card" style={{ padding: 6 }}>
          {owners.map((o) => (
            <button key={o.id} onClick={() => setSelected(o)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '0.85rem 0.9rem', borderRadius: 12, textAlign: 'left', background: 'transparent', color: 'var(--text)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--accent-bg)', color: 'var(--gold)', display: 'grid', placeItems: 'center', fontWeight: 700, flexShrink: 0 }}>{o.name.slice(0, 1).toUpperCase()}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}{!o.active && <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}> · {t('inactive')}</span>}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.email}</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--surface-2)', borderRadius: 999, padding: '3px 10px', flexShrink: 0 }}>{o.villaCount} {t('villasLabel')}</span>
              {o.pendingRequests > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--tentative)', background: 'var(--tentative-bg)', borderRadius: 999, padding: '3px 10px', fontWeight: 700, flexShrink: 0 }}>{o.pendingRequests}</span>}
              <IconChevronRight size={16} className="pl-fade" />
            </button>
          ))}
        </div>
      )}

      {showAdd && <AddOwnerModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
      {selected && <OwnerDrawer owner={selected} onClose={() => setSelected(null)} onChanged={load} />}
    </div>
  );
};

// ---------- shared modal + field ----------
export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

export const ModalSheet: React.FC<{ title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }> = ({ title, subtitle, onClose, children, footer, wide }) => {
  const { theme } = usePortal();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  const node = (
    <div className="pl-overlay" onMouseDown={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(10,12,17,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div className="pl-modal pl-modal-sheet" onMouseDown={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)', width: '100%', maxWidth: wide ? 620 : 480, maxHeight: '92vh', overflowY: 'auto', borderRadius: '22px 22px 0 0', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', padding: '1.1rem 1.3rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="serif" style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h3>
            {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} className="pl-btn pl-btn-ghost" style={{ padding: 8, width: 36, height: 36, borderRadius: 999 }}><IconX size={18} /></button>
        </div>
        <div style={{ padding: '1.3rem', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
        {footer && <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface)', padding: '1rem 1.3rem calc(1rem + env(safe-area-inset-bottom))', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>{footer}</div>}
        <style>{`@media (min-width:640px){ .pl-modal-sheet { border-radius: 22px !important; align-self: center; margin: 5vh 0; } }`}</style>
      </div>
    </div>
  );
  if (typeof document === 'undefined') return node;
  // Render at <body> in a theme-carrying wrapper so nested modals position
  // against the viewport (not trapped by an ancestor's backdrop-filter).
  return createPortal(
    <div className={`portal ${theme}`} style={{ minHeight: 0, background: 'transparent' }}>{node}</div>,
    document.body
  );
};

export default AdminOwners;
