import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal } from './PortalContext';
import { ownerApi, ownerSession, ApiError } from './ownerApi';
import { PORTAL_LANGS } from './i18n';
import { IconKey, IconArrow } from './icons';

const OwnerLogin: React.FC = () => {
  const { t, setUser, lang, setLang, theme, toggleTheme } = usePortal();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await ownerApi.login(email.trim(), password);
      ownerSession.set(token, user);
      setUser(user);
      if (user.preferredLang) setLang(user.preferredLang);
      navigate('/owner');
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? t('invalidCredentials') : t('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr' }} className="pl-login-grid">
      {/* Brand panel */}
      <div className="pl-login-brand" style={{
        display: 'none', position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(circle at 30% 20%, #143140 0%, #0B1C26 55%, #070f15 100%)',
        color: '#F2EEE6', padding: '3.5rem',
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(196,164,97,0.16)', color: '#D8BC84', display: 'grid', placeItems: 'center' }}>
              <IconKey size={24} />
            </div>
            <div className="serif" style={{ fontSize: '1.5rem' }}>{t('brand')}</div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4A461', marginBottom: 18 }}>
              {t('ownerPortal')}
            </div>
            <h1 className="serif" style={{ fontSize: '2.9rem', lineHeight: 1.08, color: '#fff', maxWidth: 460 }}>
              {t('tagline')}
            </h1>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 90%, rgba(196,164,97,0.12), transparent 45%)' }} />
      </div>

      {/* Form panel */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <button className="pl-btn pl-btn-ghost" style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }} onClick={toggleTheme}>
            {theme === 'dark' ? '☀︎' : '☾'}
          </button>
          <select className="pl-input" style={{ width: 'auto', padding: '0.45rem 2rem 0.45rem 0.7rem', fontSize: '0.85rem' }}
            value={lang} onChange={(e) => setLang(e.target.value as any)}>
            {PORTAL_LANGS.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>
        </div>

        <div style={{ margin: 'auto', width: '100%', maxWidth: 380, padding: '2rem 0' }}>
          <div className="pl-animate">
            <div className="pl-login-mark" style={{ width: 52, height: 52, borderRadius: 15, background: 'var(--navy)', color: 'var(--gold-soft)', display: 'grid', placeItems: 'center', marginBottom: 22 }}>
              <IconKey size={26} />
            </div>
            <h2 className="serif" style={{ fontSize: '2rem', marginBottom: 6 }}>{t('welcome')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 28 }}>{t('signInSub')}</p>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{t('email')}</label>
                <input className="pl-input" type="email" autoComplete="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="owner@thekeyibiza.com" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('password')}</label>
                  <button type="button" style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600 }}>{t('forgotPassword')}</button>
                </div>
                <input className="pl-input" type="password" autoComplete="current-password" required value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>

              {error && (
                <div className="pl-animate" style={{ fontSize: '0.85rem', color: 'var(--blocked)', background: 'var(--blocked-bg)', padding: '0.6rem 0.8rem', borderRadius: 10 }}>
                  {error}
                </div>
              )}

              <button type="submit" className="pl-btn pl-btn-primary" disabled={loading} style={{ padding: '0.8rem', fontSize: '0.95rem', marginTop: 4 }}>
                {loading ? t('signingIn') : <>{t('signIn')} <IconArrow size={18} /></>}
              </button>
            </form>

            <p style={{ marginTop: 26, fontSize: '0.75rem', color: 'var(--text-faint)', textAlign: 'center' }}>{t('demoHint')}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .pl-login-grid { grid-template-columns: 1.05fr 1fr !important; }
          .pl-login-brand { display: block !important; }
          .pl-login-mark { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default OwnerLogin;
