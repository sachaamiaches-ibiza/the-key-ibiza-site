import React, { useState } from 'react';
import { usePortal } from './PortalContext';
import { ownerApi, ownerSession } from './ownerApi';
import { PORTAL_LANGS, PortalLang } from './i18n';
import { IconCheck } from './icons';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="pl-card" style={{ padding: '1.3rem 1.4rem', marginBottom: 16 }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>{title}</div>
    {children}
  </div>
);

const OwnerSettings: React.FC = () => {
  const { t, lang, setLang, theme, setTheme, user, toast } = usePortal();
  const [tz, setTz] = useState(user?.timezone || 'Europe/Madrid');
  const [currency, setCurrency] = useState(user?.currency || 'EUR');

  const persistLang = async (l: PortalLang) => {
    setLang(l);
    try { await ownerApi.updateMe({ preferred_lang: l }); } catch { /* non-blocking */ }
  };
  const savePrefs = async () => {
    try { await ownerApi.updateMe({ timezone: tz, currency } as any); toast(t('profileSaved')); }
    catch { toast(t('errorGeneric')); }
  };

  return (
    <div className="pl-animate" style={{ maxWidth: 640 }}>
      <h1 className="serif" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)', marginBottom: 22 }}>{t('settingsTitle')}</h1>

      <Section title={t('language')}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PORTAL_LANGS.map((l) => (
            <button key={l.code} onClick={() => persistLang(l.code)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.9rem', borderRadius: 999,
                border: '1px solid', borderColor: l.code === lang ? 'var(--gold)' : 'var(--border)',
                background: l.code === lang ? 'var(--accent-bg)' : 'transparent', color: 'var(--text)', fontWeight: 600, fontSize: '0.88rem' }}>
              <span style={{ fontSize: '1.05rem' }}>{l.flag}</span>{l.label}
              {l.code === lang && <IconCheck size={15} className="pl-fade" />}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t('appearance')}>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['light', 'dark'] as const).map((tm) => (
            <button key={tm} onClick={() => setTheme(tm)}
              style={{ flex: 1, padding: '0.9rem', borderRadius: 14, border: '1px solid',
                borderColor: theme === tm ? 'var(--gold)' : 'var(--border)', background: theme === tm ? 'var(--accent-bg)' : 'transparent',
                color: 'var(--text)', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', height: 42, borderRadius: 8, background: tm === 'light' ? '#F7F5F0' : '#0B1C26', border: '1px solid var(--border)' }} />
              {t(tm)}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t('account')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.name}</span>
            <span style={{ color: 'var(--text-faint)', fontSize: '0.9rem' }}>{user?.email}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{t('timezone')}</label>
              <select className="pl-input" value={tz} onChange={(e) => setTz(e.target.value)}>
                {['Europe/Madrid', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'UTC'].map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{t('currency')}</label>
              <select className="pl-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {['EUR', 'GBP', 'USD', 'CHF'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="pl-btn pl-btn-primary" style={{ marginTop: 14, alignSelf: 'flex-start' }} onClick={savePrefs}>{t('save')}</button>
        </div>
      </Section>

      <Section title={t('security')}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.9rem' }}>
          {t('comingInPhase')} — {t('password')} · 2FA · {ownerSession.user()?.role === 'admin' ? 'Admin' : ''}
        </p>
      </Section>
    </div>
  );
};

export default OwnerSettings;
