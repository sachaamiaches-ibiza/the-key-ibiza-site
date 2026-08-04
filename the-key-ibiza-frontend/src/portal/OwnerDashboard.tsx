import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from './PortalContext';
import { ownerApi, DashboardData, OwnerVilla, BookingType } from './ownerApi';
import { fmtDay, fmtRange, daysBetween, todayIso } from './dateUtils';
import { IconCalendar, IconArrow, IconUsers, IconBell, IconActivity, IconSpark, IconChevronRight } from './icons';

const TYPE_COLOR: Record<BookingType, string> = {
  reservation: 'var(--blocked)', block: 'var(--maint)', maintenance: 'var(--maint)',
  personal: 'var(--personal)', tentative: 'var(--tentative)',
};

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; className?: string }> = ({ children, style, onClick, className }) => (
  <div className={`pl-card ${className || ''}`} onClick={onClick}
    style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', cursor: onClick ? 'pointer' : 'default', ...style }}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; Icon?: React.FC<any>; action?: React.ReactNode }> = ({ children, Icon, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
    {Icon && <span style={{ color: 'var(--text-faint)' }}><Icon size={17} /></span>}
    <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{children}</span>
    {action && <span style={{ marginLeft: 'auto' }}>{action}</span>}
  </div>
);

const OwnerDashboard: React.FC = () => {
  const { t, user, lang } = usePortal();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [villas, setVillas] = useState<OwnerVilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setError(false); setLoading(true);
      try {
        const [d, v] = await Promise.all([ownerApi.dashboard(), ownerApi.villas()]);
        if (!alive) return;
        setData(d); setVillas(v.villas);
      } catch { if (alive) setError(true); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const villaName = (slug: string) => villas.find((v) => v.slug === slug)?.name || slug;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');
  const firstName = (user?.name || '').split(' ')[0];

  const totalAvail = villas.reduce((s, v) => s + v.availableNext30, 0);
  const totalDays = villas.length * 30;
  const availPct = totalDays ? Math.round((totalAvail / totalDays) * 100) : 0;

  if (loading) {
    return (
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="pl-card" style={{ height: 150, opacity: 0.5, animation: 'pl-fade 1.2s ease-in-out infinite alternate' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="pl-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{t('errorGeneric')}</p>
        <button className="pl-btn pl-btn-primary" onClick={() => location.reload()}>{t('retry')}</button>
      </div>
    );
  }

  const d = data!;

  return (
    <div className="pl-animate">
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="serif" style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', lineHeight: 1.1 }}>
          {greeting}, {firstName}.
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: '1rem' }}>{t('overviewSub')}</p>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {/* Availability */}
        <Card>
          <CardTitle Icon={IconCalendar}>{t('cardAvailability')}</CardTitle>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="serif" style={{ fontSize: '2.6rem', lineHeight: 1, color: 'var(--avail)' }}>{availPct}%</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('next30')}</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-2)', overflow: 'hidden', margin: '14px 0 10px' }}>
            <div style={{ height: '100%', width: `${availPct}%`, background: 'var(--avail)', borderRadius: 999, transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)' }} />
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span><b style={{ color: 'var(--text)' }}>{totalAvail}</b> {t('availableDays')}</span>
            <span><b style={{ color: 'var(--text)' }}>{d.blockedNext30}</b> {t('blockedDays')}</span>
          </div>
        </Card>

        {/* Properties */}
        <Card onClick={() => navigate('/owner/properties')}>
          <CardTitle Icon={IconSpark} action={<IconChevronRight size={16} className="pl-fade" />}>{t('properties')}</CardTitle>
          <span className="serif" style={{ fontSize: '2.6rem', lineHeight: 1 }}>{d.villas}</span>
          <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {villas.slice(0, 3).map((v) => (
              <span key={v.slug} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--surface-2)', borderRadius: 999, padding: '3px 9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{v.name}</span>
            ))}
          </div>
        </Card>

        {/* Revenue (Phase 3) */}
        <Card>
          <CardTitle Icon={IconActivity}>{t('cardRevenue')}</CardTitle>
          <span className="serif" style={{ fontSize: '2.6rem', lineHeight: 1, color: 'var(--text-faint)' }}>€—</span>
          <span style={{ marginTop: 'auto', paddingTop: 14, fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('comingInPhase')}</span>
        </Card>

        {/* Upcoming reservations */}
        <Card style={{ gridColumn: 'span 1', minHeight: 190 }} className="pl-span2">
          <CardTitle Icon={IconArrow} action={
            <button onClick={() => navigate('/owner/calendar')} style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>{t('viewAll')}</button>
          }>{t('cardUpcoming')}</CardTitle>
          {d.upcoming.length === 0 ? (
            <p style={{ color: 'var(--text-faint)', fontSize: '0.9rem', margin: 'auto 0' }}>{t('noUpcoming')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {d.upcoming.map((b) => (
                <div key={b.id} onClick={() => navigate(`/owner/calendar/${b.villa}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.55rem 0.4rem', borderRadius: 10, cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 999, background: 'var(--blocked)' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.guest || t('typeReservation')}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{villaName(b.villa)}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{fmtRange(b.start, b.end, lang)}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{daysBetween(b.start, b.end)} {t('nights')}{b.guests ? ` · ${b.guests} ${t('guests')}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Arrivals */}
        <Card>
          <CardTitle Icon={IconUsers}>{t('cardArrivals')}</CardTitle>
          {d.arrivals.length === 0 ? (
            <p style={{ color: 'var(--text-faint)', fontSize: '0.9rem', margin: 'auto 0' }}>{t('noArrivals')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {d.arrivals.slice(0, 4).map((a) => {
                const days = daysBetween(todayIso(), a.start);
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 42, textAlign: 'center', flexShrink: 0 }}>
                      <div className="serif" style={{ fontSize: '1.25rem', lineHeight: 1, color: 'var(--gold)' }}>{fmtDay(a.start, lang, { day: 'numeric' })}</div>
                      <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{fmtDay(a.start, lang, { month: 'short' })}</div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.guest || t('typeReservation')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{days === 0 ? t('today') : fmtDay(a.start, lang, { weekday: 'long' })}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Unread messages (Phase 2) */}
        <Card>
          <CardTitle Icon={IconBell}>{t('cardMessages')}</CardTitle>
          <span className="serif" style={{ fontSize: '2.6rem', lineHeight: 1, color: 'var(--text-faint)' }}>0</span>
          <span style={{ marginTop: 'auto', paddingTop: 14, fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('comingInPhase')}</span>
        </Card>

        {/* Latest activity */}
        <Card className="pl-span2">
          <CardTitle Icon={IconActivity}>{t('cardActivity')}</CardTitle>
          {d.activity.length === 0 ? (
            <p style={{ color: 'var(--text-faint)', fontSize: '0.9rem', margin: 'auto 0' }}>{t('noActivity')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {d.activity.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0.5rem 0.3rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: TYPE_COLOR[a.type], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.87rem', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <b style={{ fontWeight: 600 }}>{t(`type${a.type.charAt(0).toUpperCase() + a.type.slice(1)}` as any)}</b>
                    {a.guest ? ` · ${a.guest}` : ''} <span style={{ color: 'var(--text-muted)' }}>· {villaName(a.villa)}</span>
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-faint)', flexShrink: 0 }}>{fmtDay(a.start, lang)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <style>{`
        @media (min-width: 900px) { .pl-span2 { grid-column: span 2 !important; } }
      `}</style>
    </div>
  );
};

export default OwnerDashboard;
