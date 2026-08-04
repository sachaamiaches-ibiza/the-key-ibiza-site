import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from './PortalContext';
import { ownerApi, OwnerVilla } from './ownerApi';
import { IconBed, IconBath, IconUsers, IconPin, IconCalendar, IconCheck } from './icons';
import VillaEditModal from './VillaEditModal';

const OwnerVillas: React.FC = () => {
  const { t, toast } = usePortal();
  const navigate = useNavigate();
  const [villas, setVillas] = useState<OwnerVilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingSlugs, setPendingSlugs] = useState<Set<string>>(new Set());
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const loadPending = async () => {
    try {
      const { requests } = await ownerApi.myChangeRequests();
      setPendingSlugs(new Set(requests.filter((r) => r.status === 'pending').map((r) => r.villa_slug)));
    } catch { /* non-blocking */ }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const { villas } = await ownerApi.villas(); if (alive) setVillas(villas); }
      catch { /* handled by guard */ }
      finally { if (alive) setLoading(false); }
    })();
    loadPending();
    return () => { alive = false; };
  }, []);

  return (
    <div className="pl-animate">
      <div style={{ marginBottom: 22 }}>
        <h1 className="serif" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)' }}>{t('yourProperties')}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{t('propertiesSub')}</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="pl-card" style={{ height: 320, opacity: 0.5 }} />)}
        </div>
      ) : villas.length === 0 ? (
        <div className="pl-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 8 }}>{t('noVillas')}</h3>
          <p style={{ color: 'var(--text-muted)' }}>{t('noVillasSub')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {villas.map((v) => {
            const availPct = Math.round((v.availableNext30 / 30) * 100);
            return (
              <div key={v.slug} className="pl-card" style={{ overflow: 'hidden', padding: 0 }}>
                {/* Photo */}
                <div style={{ position: 'relative', aspectRatio: '16 / 10', background: 'var(--surface-2)', overflow: 'hidden' }}>
                  {v.photo ? (
                    <img src={v.photo} alt={v.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-faint)' }}><IconPin size={28} /></div>
                  )}
                  {pendingSlugs.has(v.slug) && (
                    <span style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.68rem', fontWeight: 700,
                      background: 'var(--tentative)', color: '#fff', borderRadius: 999, padding: '4px 10px' }}>
                      {t('pendingBadge')}
                    </span>
                  )}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700,
                      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#fff', borderRadius: 999, padding: '4px 10px' }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: availPct > 40 ? 'var(--avail)' : 'var(--tentative)' }} />
                      {availPct}% {t('availableLabel')}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.1rem 1.2rem 1.2rem' }}>
                  <h3 className="serif" style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>{v.name}</h3>
                  {v.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>
                      <IconPin size={14} /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.location}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 16, marginTop: 12, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {v.bedrooms != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><IconBed size={16} />{v.bedrooms}</span>}
                    {v.bathrooms != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><IconBath size={16} />{v.bathrooms}</span>}
                    {v.guests != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><IconUsers size={16} />{v.guests}</span>}
                    {v.hasIcal && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginLeft: 'auto', color: 'var(--avail)' }}><IconCheck size={15} />{t('synced')}</span>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
                    <button className="pl-btn pl-btn-primary" style={{ padding: '0.55rem' }} onClick={() => navigate(`/owner/calendar/${v.slug}`)}>
                      <IconCalendar size={16} />{t('calendar')}
                    </button>
                    <button className="pl-btn pl-btn-ghost" style={{ padding: '0.55rem' }} onClick={() => toast(t('comingInPhase'))}>{t('view')}</button>
                    <button className="pl-btn pl-btn-ghost" style={{ padding: '0.55rem' }} onClick={() => setEditSlug(v.slug)}>{t('edit')}</button>
                    <button className="pl-btn pl-btn-ghost" style={{ padding: '0.55rem' }} onClick={() => toast(t('comingInPhase'))}>{t('settings')}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editSlug && (
        <VillaEditModal slug={editSlug} onClose={() => setEditSlug(null)}
          onSubmitted={() => { setEditSlug(null); loadPending(); }} />
      )}
    </div>
  );
};

export default OwnerVillas;
