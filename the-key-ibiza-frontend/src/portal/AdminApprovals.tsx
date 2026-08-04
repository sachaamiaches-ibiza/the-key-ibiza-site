import React, { useEffect, useState, useCallback } from 'react';
import { usePortal } from './PortalContext';
import { ownerApi, AdminChangeRequest } from './ownerApi';
import { IconCheck, IconX } from './icons';

const FIELD_LABEL: Record<string, string> = {
  villa_name: 'Name', short_description: 'Short description', description: 'Description',
  amenities: 'Amenities', price_min_week: 'Price/week (from)', price_max_week: 'Price/week (to)',
  location: 'Location', weekly_rates: 'Weekly rates',
};

const AdminApprovals: React.FC = () => {
  const { t, toast } = usePortal();
  const [reqs, setReqs] = useState<AdminChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { const { requests } = await ownerApi.adminRequests(); setReqs(requests); } catch { /* */ } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    setBusy(id);
    try { await ownerApi.adminApproveRequest(id); setReqs((r) => r.filter((x) => x.id !== id)); toast(t('approve')); } catch { /* */ } finally { setBusy(null); }
  };
  const reject = async (id: string) => {
    const note = window.prompt(t('rejectReason')) ?? '';
    setBusy(id);
    try { await ownerApi.adminRejectRequest(id, note); setReqs((r) => r.filter((x) => x.id !== id)); toast(t('reject')); } catch { /* */ } finally { setBusy(null); }
  };

  return (
    <div className="pl-animate">
      <div style={{ marginBottom: 20 }}>
        <h1 className="serif" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)' }}>{t('approvalsTitle')}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{t('approvalsSub')}</p>
      </div>

      {loading ? (
        <div className="pl-card" style={{ height: 200, opacity: 0.5 }} />
      ) : reqs.length === 0 ? (
        <div className="pl-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--avail-bg)', color: 'var(--avail)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}><IconCheck size={26} /></div>
          <p style={{ color: 'var(--text-muted)' }}>{t('noPending')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reqs.map((r) => (
            <div key={r.id} className="pl-card" style={{ padding: '1.2rem 1.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="serif" style={{ fontSize: '1.2rem' }}>{r.villa_name || r.villa_slug}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.owner_name || '—'}{r.owner_email ? ` · ${r.owner_email}` : ''}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.keys(r.patch || {}).map((field) => (
                  <div key={field}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>{FIELD_LABEL[field] || field.replace(/_/g, ' ')}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="pl-diff">
                      <div style={{ background: 'var(--blocked-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.55rem 0.75rem' }}>
                        <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 3 }}>{t('current')}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', wordBreak: 'break-word' }}>{String(r.before?.[field] ?? '—') || '—'}</div>
                      </div>
                      <div style={{ background: 'var(--avail-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.55rem 0.75rem' }}>
                        <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 3 }}>{t('proposed')}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)', wordBreak: 'break-word' }}>{String(r.patch[field] ?? '—') || '—'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="pl-btn pl-btn-primary" disabled={busy === r.id} onClick={() => approve(r.id)} style={{ padding: '0.55rem 1.1rem', background: 'var(--avail)' }}><IconCheck size={16} />{t('approve')}</button>
                <button className="pl-btn pl-btn-ghost" disabled={busy === r.id} onClick={() => reject(r.id)} style={{ padding: '0.55rem 1.1rem', color: 'var(--blocked)', borderColor: 'var(--border)' }}><IconX size={16} />{t('reject')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@media (max-width: 560px){ .pl-diff { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default AdminApprovals;
