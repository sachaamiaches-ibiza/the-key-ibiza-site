import React, { useEffect, useState } from 'react';
import { usePortal } from './PortalContext';
import { ownerApi, CalendarFeed } from './ownerApi';
import { LOCALE_MAP } from './i18n';
import { IconX, IconRefresh, IconTrash, IconPlus, IconLink, IconCopy, IconCheck } from './icons';

interface Props { slug: string; onClose: () => void; onSynced: () => void; }

const PROVIDER_LABEL: Record<string, string> = {
  airbnb: 'Airbnb', booking: 'Booking.com', vrbo: 'VRBO', homeaway: 'HomeAway',
  plumguide: 'Plum Guide', luxuryretreats: 'Luxury Retreats', website: 'Direct Website', manual: 'Manual', other: 'Other',
};
const PROVIDER_COLOR: Record<string, string> = {
  airbnb: '#FF5A5F', booking: '#003580', vrbo: '#1668E3', homeaway: '#3B5998',
  plumguide: '#111', luxuryretreats: '#8A6D3B', website: 'var(--gold)', manual: 'var(--maint)', other: 'var(--text-faint)',
};

const StatusPill: React.FC<{ f: CalendarFeed }> = ({ f }) => {
  const { t } = usePortal();
  const map = { ok: ['var(--avail)', 'var(--avail-bg)', t('statusOk')], error: ['var(--blocked)', 'var(--blocked-bg)', t('statusError')], pending: ['var(--maint)', 'var(--maint-bg)', t('statusPending')] } as const;
  const [c, bg, label] = map[f.last_status] || map.pending;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, color: c, background: bg, borderRadius: 999, padding: '3px 9px' }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: c }} />{label}
  </span>;
};

const IcalModal: React.FC<Props> = ({ slug, onClose, onSynced }) => {
  const { t, lang, toast } = usePortal();
  const [feeds, setFeeds] = useState<CalendarFeed[]>([]);
  const [exportUrl, setExportUrl] = useState('');
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState('airbnb');
  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const r = await ownerApi.feeds(slug);
      setFeeds(r.feeds); setExportUrl(r.exportUrl); setProviders(r.providers);
    } catch { setErr(t('errorGeneric')); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    load();
    return () => document.removeEventListener('keydown', onKey);
  }, [slug]);

  const fmtSync = (s: string | null) => s ? new Intl.DateTimeFormat(LOCALE_MAP[lang], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(s)) : t('never');
  const fmtNext = (s: string | null) => s ? new Intl.DateTimeFormat(LOCALE_MAP[lang], { hour: '2-digit', minute: '2-digit' }).format(new Date(new Date(s).getTime() + 15 * 60000)) : '—';

  const add = async () => {
    setErr('');
    if (!/^https?:\/\//i.test(url.trim())) { setErr(t('feedUrl')); return; }
    setAdding(true);
    try {
      const { sync } = await ownerApi.addFeed(slug, provider, url.trim());
      setUrl('');
      await load();
      onSynced();
      toast(sync.ok ? `${t('statusOk')} · ${sync.count ?? 0} ${t('events')}` : t('statusError'));
    } catch (e: any) {
      setErr(e?.message === 'This feed already exists' ? e.message : t('errorGeneric'));
    } finally { setAdding(false); }
  };

  const syncOne = async (id: string) => {
    setSyncingId(id);
    try { await ownerApi.syncFeed(id); await load(); onSynced(); } catch { /* */ } finally { setSyncingId(null); }
  };
  const syncAll = async () => {
    setSyncingAll(true);
    try { const { feeds } = await ownerApi.syncVilla(slug); setFeeds(feeds); onSynced(); toast(t('statusOk')); } catch { /* */ } finally { setSyncingAll(false); }
  };
  const remove = async (id: string) => {
    try { await ownerApi.removeFeed(id); await load(); onSynced(); } catch { /* */ }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(exportUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* */ }
  };

  return (
    <div className="pl-overlay" onMouseDown={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(10,12,17,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div className="pl-modal pl-modal-sheet" onMouseDown={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)', width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', borderRadius: '22px 22px 0 0', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', padding: '1.1rem 1.3rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
          <h3 className="serif" style={{ fontSize: '1.25rem', flex: 1 }}>{t('icalTitle')}</h3>
          <button onClick={syncAll} disabled={syncingAll || feeds.length === 0} className="pl-btn pl-btn-ghost" style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}>
            <span style={{ display: 'inline-flex', animation: syncingAll ? 'spin 0.9s linear infinite' : 'none' }}><IconRefresh size={15} /></span>
            {t('syncNow')}
          </button>
          <button onClick={onClose} className="pl-btn pl-btn-ghost" style={{ padding: 8, width: 36, height: 36, borderRadius: 999 }}><IconX size={18} /></button>
        </div>

        <div style={{ padding: '1.3rem', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: -4 }}>{t('icalSub')}</p>

          {/* Connected feeds */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>{t('connectedFeeds')}</div>
            {loading ? (
              <div className="pl-card" style={{ height: 80, opacity: 0.5 }} />
            ) : feeds.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-faint)', padding: '1rem 0' }}>{t('noFeeds')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {feeds.map((f) => (
                  <div key={f.id} className="pl-card" style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: PROVIDER_COLOR[f.provider] || 'var(--text-faint)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{PROVIDER_LABEL[f.provider] || f.provider}</span>
                      <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StatusPill f={f} />
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-faint)', margin: '6px 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.url}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      <span>{t('lastSync')}: <b style={{ color: 'var(--text)' }}>{fmtSync(f.last_sync)}</b></span>
                      <span>{t('nextSync')}: {fmtNext(f.last_sync)}</span>
                      {f.last_status === 'ok' && <span>{f.events_count} {t('events')}</span>}
                      <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                        <button onClick={() => syncOne(f.id)} disabled={syncingId === f.id} className="pl-btn pl-btn-ghost" style={{ padding: 6, width: 32, height: 32, borderRadius: 999 }} title={t('syncNow')}>
                          <span style={{ display: 'inline-flex', animation: syncingId === f.id ? 'spin 0.9s linear infinite' : 'none' }}><IconRefresh size={14} /></span>
                        </button>
                        <button onClick={() => remove(f.id)} className="pl-btn pl-btn-ghost" style={{ padding: 6, width: 32, height: 32, borderRadius: 999, color: 'var(--blocked)' }} title={t('remove')}>
                          <IconTrash size={14} />
                        </button>
                      </span>
                    </div>
                    {f.last_status === 'error' && f.last_error && (
                      <div style={{ marginTop: 8, fontSize: '0.74rem', color: 'var(--blocked)', background: 'var(--blocked-bg)', padding: '0.4rem 0.6rem', borderRadius: 8 }}>{f.last_error}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add feed */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>{t('addFeed')}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select className="pl-input" style={{ width: 'auto', minWidth: 130 }} value={provider} onChange={(e) => setProvider(e.target.value)}>
                {(providers.length ? providers : Object.keys(PROVIDER_LABEL)).map((p) => <option key={p} value={p}>{PROVIDER_LABEL[p] || p}</option>)}
              </select>
              <input className="pl-input" style={{ flex: 1, minWidth: 180 }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('feedUrlPh')} />
              <button className="pl-btn pl-btn-primary" onClick={add} disabled={adding || !url}>
                <IconPlus size={16} />{adding ? t('syncing') : t('connect')}
              </button>
            </div>
            {err && <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--blocked)' }}>{err}</div>}
          </div>

          {/* Export */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
              <IconLink size={14} />{t('exportTitle')}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>{t('exportSub')}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="pl-input" readOnly value={exportUrl} onFocus={(e) => e.currentTarget.select()} style={{ flex: 1, fontSize: '0.78rem' }} />
              <button className="pl-btn pl-btn-ghost" onClick={copy} style={{ padding: '0.5rem 0.9rem' }}>
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}{copied ? t('copied') : t('copy')}
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (min-width: 640px){ .pl-modal-sheet { border-radius: 22px !important; align-self: center; margin-bottom: 5vh; } }
        `}</style>
      </div>
    </div>
  );
};

export default IcalModal;
